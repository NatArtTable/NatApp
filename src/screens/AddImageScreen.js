import React from 'react';
import {View, Text} from 'react-native';

export default class AddImageScreen extends React.Component {
  static navigationOptions = {
    title: 'New Art Reference',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Oxe mainha!</Text>
      </View>
    );
  }
}
