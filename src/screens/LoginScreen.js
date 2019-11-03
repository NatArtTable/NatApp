import React from 'react';
import {View, Text} from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Tela de Login</Text>
      </View>
    );
  }
}
