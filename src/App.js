import React from 'react';
import {Image} from 'react-native';

import ShareMenu from 'react-native-share-menu';

import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import AddImageScreen from './screens/AddImageScreen';
import HomeScreen from './screens/HomeScreen';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this._MainNavigator = createStackNavigator({
      Home: {screen: HomeScreen},
      AddImage: {screen: AddImageScreen},
    });

    this._AppContainer = createAppContainer(this._MainNavigator);
  }

  componentDidMount() {
    ShareMenu.getSharedText(image => {
      ShareMenu.clearSharedText();

      console.log(`Adding image shared. Uri: ${image}`);
      Image.getSize(
        image,
        (width, height) => {
          this._navigator.dispatch(
            NavigationActions.navigate({
              routeName: 'AddImage',
              action: 'push',
              params: {image: {uri: image, width, height}},
            }),
          );
        },
        err => console.error(err),
      );
    });
  }

  render() {
    return (
      <this._AppContainer
        ref={nav => {
          this._navigator = nav;
        }}
      />
    );
  }
}
