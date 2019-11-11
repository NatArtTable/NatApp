import React from 'react';
import {View, StyleSheet} from 'react-native';
import {withNavigationFocus} from 'react-navigation';

import ActionsBar from '../components/ActionsBar';
import SearchForm from '../components/SearchForm';

import ArtRefsViewer from '../components/ArtRefsViewer';

import repository from '../components/Repository';
import Loading from '../components/Loading';

function debounce(func, wait) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, wait);
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      query: {text: ''},
      loading: false,
    };

    this.render = this.render.bind(this);
    this.search = this.search.bind(this);
    this._onSearchFormChange = this._onSearchFormChange.bind(this);
    this.onItemPressed = this.onItemPressed.bind(this);
    this.addImage = this.addImage.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.search = debounce(this.search, 200);

    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      this._onFocus,
    );
  }

  _onFocus() {
    this.search();
  }

  search() {
    this.setState({loading: true}, () => {
      console.log(`Buscando com query: ${JSON.stringify(this.state.query)}`);
      repository
        .search(this.state.query)
        .then(res => {
          console.log(`Encontrados ${res.length} resultados para esta busca!`);
          this.setState({items: res});
        })
        .catch(err => console.error(err))
        .finally(() => this.setState({loading: false}));
    });
  }

  _onSearchFormChange(query) {
    this.setState({query}, () => this.search());
  }

  onItemPressed(item) {
    this.setState({loading: true}, () =>
      this.props.navigation.push('Image', {image: item, mode: 'edit'}),
    );
    return true;
  }

  addImage(image) {
    this.setState({loading: true});
    this.props.navigation.push('Image', {image, mode: 'add'});
  }

  render() {
    return (
      <View style={styles.container}>
        <View styles={styles.searchBarContainer}>
          <SearchForm
            onChange={this._onSearchFormChange}
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
        <Loading on={this.state.loading} />
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
