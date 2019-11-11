import React from 'react';
import {Image} from 'react-native';

import ShareMenu from 'react-native-share-menu';

import {createAppContainer, NavigationActions} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ImageScreen from './screens/ImageScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this._MainNavigator = createStackNavigator({
      Home: {screen: HomeScreen},
      Login: {screen: LoginScreen},
      Image: {screen: ImageScreen},
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
              routeName: 'Image',
              action: 'push',
              params: {mode: 'add', image: {uri: image, width, height}},
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
