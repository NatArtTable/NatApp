import SQLite from 'react-native-sqlite-storage';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

class Repository {
  constructor() {
    this._openCB = this._openCB.bind(this);
    this._executeSql = this._executeSql.bind(this);
    this._executeReflectedSql = this._executeReflectedSql.bind(this);
    this.search = this.search.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.thumbnailPath = `${RNFS.DocumentDirectoryPath}/images`;
    this.suggestFolder = this.suggestFolder.bind(this);
    this._createTables = this._createTables.bind(this);
    this._createFolderIfNotExists = this._createFolderIfNotExists.bind(this);

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

  _reflect = p => p.then(res => console.log(res), err => console.log(err));

  _executeReflectedSql(query) {
    return this._reflect(this._executeSql(query));
  }

  _openCB() {
    console.log('Database Opened');

    // this._executeSql('DROP TABLE tb_images').then(
    this._createTables()
      .then(() => console.log('Table Created!'))
      .catch(e => console.error(e));
    // );

    RNFS.mkdir(this.thumbnailPath).then(() =>
      console.log('images folder created!'),
    );
  }

  _createTables() {
    return this._executeReflectedSql(
      'CREATE TABLE tb_images(id INTEGER PRIMARY KEY NOT NULL)',
    )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN thumbnail_uri VARCHAR(300) DEFAULT ""',
        ),
      )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN original_uri VARCHAR(300)',
        ),
      )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN public_uri VARCHAR(300)',
        ),
      )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN description VARCHAR(1000) DEFAULT ""',
        ),
      )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN tags VARCHAR(1000) DEFAULT ""',
        ),
      )
      .then(
        this._executeReflectedSql('ALTER TABLE tb_images ADD COLUMN width INT'),
      )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN height INT',
        ),
      )
      .then(
        this._executeReflectedSql(
          'ALTER TABLE tb_images ADD COLUMN folder VARCHAR(100) DEFAULT ""',
        ),
      )
      .then(
        this._executeReflectedSql(
          'CREATE TABLE tb_folders(name VARCHAR(150) PRIMARY KEY NOT NULL)',
        ),
      );
  }

  _errorCB(err) {
    console.log('SQL Error: ' + JSON.stringify(err));
  }

  addImage(uri, width, height, description = '', tags = [], folder = '') {
    return this._createFolderIfNotExists(folder)
      .then(
        ImageResizer.createResizedImage(
          uri,
          50,
          50,
          'PNG',
          100,
          0,
          this.thumbnailPath,
        ),
      )
      .then(response => {
        console.log(`Image resized: ${JSON.stringify(response)}`);
        return this._executeSql(`
          INSERT INTO \`tb_images\`
          (
            thumbnail_uri,public_uri,original_uri,
            width,height,
            description,tags,folder
          ) VALUES 
          (
            "${response.uri}","${uri}","${uri}",
            ${width},${height},
            "${description}","${tags.join(',')}","${folder}"
          )
        `);
      })
      .catch(err => console.error(err));
  }

  updateImage(id, description = '', tags = [], folder = '') {
    console.debug(
      `Atualizando artref com id -> ${id} para valores (description, tags, folder) -> (${description},[${tags}],${folder})`,
    );
    return this._createFolderIfNotExists(folder).then(
      this._executeSql(`
      UPDATE \`tb_images\`
      SET description="${description}", 
      tags="${tags.join(',')}",
      folder="${folder}" 
      WHERE id=${id}
    `),
    );
  }

  suggestFolder(query) {
    return this._executeSql(
      `SELECT \`name\` FROM \`tb_folders\` WHERE \`name\` LIKE "%${query}%"`,
    ).then(res => {
      var rows = [];
      for (var i = 0; i < res.rows.length; i++) {
        var row = res.rows.item(i);
        rows.push(row.name);
      }

      return rows;
    });
  }

  _createFolderIfNotExists(folder) {
    if (folder === '') {
      return new Promise.reject(new Error('Folder cannot be empty'));
    } else {
      console.log(`Creating new folder ${folder}`);
      return this._executeReflectedSql(
        `INSERT INTO tb_folders (name) VALUES ("${folder}")`,
      );
    }
  }

  removeImage(id) {
    console.log(`Removing image with id: ${id}`);

    return this._executeSql(`DELETE FROM \`tb_images\`WHERE id = ${id}`);
  }

  search(query) {
    const text = query.text.trim().toLowerCase();

    return this._executeSql(
      `SELECT * FROM tb_images 
       WHERE description || ' ' || tags || ' ' || folder LIKE '%${text}%'`,
    ).then(res => {
      var rows = [];
      for (var i = 0; i < res.rows.length; i++) {
        var row = res.rows.item(i);
        row.tags = row.tags.split(',');
        rows.push(row);
      }
      return rows;
    });
  }
}

export default new Repository();
