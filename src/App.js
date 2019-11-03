import React from 'react';
import {Image} from 'react-native';

import ShareMenu from 'react-native-share-menu';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import AddImageScreen from './screens/AddImageScreen';
import HomeScreen from './screens/HomeScreen';

import repository from './components/Repository';

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
      console.log(`Adding image shared. Uri: ${image}`);
      Image.getSize(image, (width, height) => {
        repository.addImage({uri: image, width, height}).then(() => {
          ShareMenu.clearSharedText();
        });
      });
    });
  }

  render() {
    return <this._AppContainer />;
  }
}
