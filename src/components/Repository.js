import SQLite from 'react-native-sqlite-storage';

class Repository {
  constructor() {
    this._openCB = this._openCB.bind(this);
    this._executeSql = this._executeSql.bind(this);
    this.search = this.search.bind(this);
    this.removeImage = this.removeImage.bind(this);

    this.db = SQLite.openDatabase(
      'repository.db',
      '1.0',
      'Repository Database',
      200000,
      this._openCB,
      this._errorCB,
    );
  }

  _executeSql(query) {
    const queryStripped = query.replace(/\s+/g, ' ');
    const db = this.db;

    return new Promise(function(resolve, reject) {
      db.transaction(txn =>
        txn.executeSql(
          queryStripped,
          [],
          (_, result) => {
            resolve(result);
          },
          err => reject(err),
        ),
      );
    });
  }
  _openCB() {
    console.log('Database Opened');

    // this._executeSql('DROP TABLE tb_images').then(
    this._createTable()
      .then(() => console.log('Table Created!'))
      .catch(e => console.error(e));
    // );
  }

  _createTable() {
    const reflect = p =>
      p.then(res => console.log(res), err => console.log(err));

    return reflect(
      this._executeSql(
        'CREATE TABLE tb_images(id INTEGER PRIMARY KEY NOT NULL)',
      ),
    )
      .then(
        reflect(
          this._executeSql(
            'ALTER TABLE tb_images ADD COLUMN thumbnail VARCHAR(200000) DEFAULT ""',
          ),
        ),
      )
      .then(
        reflect(
          this._executeSql('ALTER TABLE tb_images ADD COLUMN uri VARCHAR(300)'),
        ),
      )
      .then(
        reflect(
          this._executeSql(
            'ALTER TABLE tb_images ADD COLUMN description VARCHAR(1000) DEFAULT ""',
          ),
        ),
      )
      .then(
        reflect(
          this._executeSql(
            'ALTER TABLE tb_images ADD COLUMN tags VARCHAR(1000) DEFAULT ""',
          ),
        ),
      )
      .then(
        reflect(this._executeSql('ALTER TABLE tb_images ADD COLUMN width INT')),
      )
      .then(
        reflect(
          this._executeSql('ALTER TABLE tb_images ADD COLUMN height INT'),
        ),
      );
  }

  _errorCB(err) {
    console.log('SQL Error: ' + JSON.stringify(err));
  }

  addImage(image) {
    return this._executeSql(`
          INSERT INTO \`tb_images\`
          (uri,width,height) 
          VALUES ("${image.uri}",${image.width},${image.height})
    `);
  }

  removeImage(id) {
    console.log(`Removing image with id: ${id}`);

    return this._executeSql(`DELETE FROM \`tb_images\`WHERE id = ${id}`);
  }

  search(query) {
    return this._executeSql(
      `SELECT * FROM tb_images 
       WHERE description || ' ' || tags LIKE '%${query.text}%'`,
    ).then(res => {
      var rows = [];
      for (var i = 0; i < res.rows.length; i++) {
        var row = res.rows.item(i);
        rows.push(row);
      }
      return rows;
    });
  }
}

export default new Repository();
