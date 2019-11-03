import React from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import ActionsBar from '../components/ActionsBar';
import SearchForm from '../components/SearchForm';
import ArtRefsViewer from '../components/ArtRefsViewer';
import ArtRefViewer from '../components/ArtRefViewer';
import repository from '../components/Repository';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      numberOfTimesBackButtonPressed: 0,
      items: [],
      query: {text: ''},
    };

    this._handleBackPress = this._handleBackPress.bind(this);
    this.render = this.render.bind(this);
    this.search = this.search.bind(this);
    this.onItemPressed = this.onItemPressed.bind(this);
    this.addImage = this.addImage.bind(this);
    this.research = this.research.bind(this);

    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this._handleBackPress,
    );
  }

  componentDidMount() {
    this.research();
  }

  research() {
    this.search(this.state.query);
  }

  _handleBackPress() {
    console.log('HomeScreen _handleBackPress Called!');

    if (this._artRefViewer.isVisible()) {
      this._artRefViewer.close();
      this.setState({numberOfTimesBackButtonPressed: 0});
    }

    if (this._actionsBar.isToggled()) {
      this._actionsBar.untoggle();
      this.setState({numberOfTimesBackButtonPressed: 0});
    } else {
      this.setState({
        numberOfTimesBackButtonPressed:
          this.state.numberOfTimesBackButtonPressed + 1,
      });
    }

    return true;
  }

  search(query) {
    console.log(`Buscando com query: ${JSON.stringify(query)}`);
    repository
      .search(query)
      .then(res => {
        console.log(`Encontrados ${res.length} resultados para esta busca!`);
        this.setState({items: res, query});
      })
      .catch(err => console.error(err));
  }

  onItemPressed(item) {
    this._artRefViewer.show(item);
    return true;
  }

  addImage(image) {
    console.log(`Imagem adicionada! uri: ${image.uri}`);

    repository.addImage(image).then(() => this.research());
  }

  removeImage(image) {
    console.log(`Removendo Imagem! id: ${image.id}`);

    repository.removeImage(image.id).then(() => this.research());
  }

  render() {
    if (this.state.numberOfTimesBackButtonPressed >= 2) {
      BackHandler.exitApp();
    }

    return (
      <View style={styles.container}>
        <View styles={styles.searchBarContainer}>
          <SearchForm
            onChange={this.search}
            ref={search => {
              this._searchForm = search;
            }}
          />
        </View>
        <ArtRefsViewer
          items={this.state.items}
          ref={viewer => {
            this._artRefsViewer = viewer;
          }}
          onItemPressed={item => this.onItemPressed(item)}
        />
        <View style={styles.actionsBarContainer}>
          <ActionsBar
            onAddImage={this.addImage}
            ref={bar => {
              this._actionsBar = bar;
            }}
          />
        </View>
        <ArtRefViewer
          ref={viewer => {
            this._artRefViewer = viewer;
          }}
          onPressThrash={item => {
            this.removeImage(item);
            this._artRefViewer.close();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  actionsBarContainer: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },

  searchBarContainer: {
    width: '100%',
  },
});
