import React from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {withNavigationFocus} from 'react-navigation';

import ActionsBar from '../components/ActionsBar';
import SearchForm from '../components/SearchForm';

import ArtRefsViewer from '../components/ArtRefsViewer';

import repository from '../components/Repository';

class HomeScreen extends React.Component {
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

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      console.log('Tab refocused. Redoing search...');
      this.research();
    }
  }

  research() {
    this.search(this.state.query);
  }

  _handleBackPress() {
    console.log('HomeScreen _handleBackPress Called!');

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
    this.props.navigation.push('Image', {image: item, mode: 'edit'});
    return true;
  }

  addImage(image) {
    this.props.navigation.push('Image', {image, mode: 'add'});
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

export default withNavigationFocus(HomeScreen);
