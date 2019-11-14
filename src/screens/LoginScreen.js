import React from 'react';
import {StyleSheet, View, TextInput, Image, Button, Alert} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import repository from '../components/Repository';
import logo from '../assets/logo.png';

import Loading from '../components/Loading';

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {loading: true, email: '', password: ''};

    this._login = this._login.bind(this);
    this._goBack = this._goBack.bind(this);
    this._setEmail = this._setEmail.bind(this);
    this._setPassword = this._setPassword.bind(this);
  }

  _login() {
    console.log(`Trying to login with email: ${this.state.email}`);
    this.setState({loading: true}, () =>
      repository
        .login(this.state.email, this.state.password)
        .catch(err => Alert.alert('Error!', err.message))
        .then(() => this._goBack())
        .finally(() => this.setState({loading: false})),
    );
  }

  _goBack() {
    this.props.navigation.pop();
  }

  componentDidMount() {
    if (repository.isLogged()) {
      this._goBack();
    } else {
      this.setState({loading: false});
    }
  }

  _setEmail(email) {
    this.setState({email});
  }

  _setPassword(password) {
    this.setState({password});
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={this.state.email}
            onChangeText={this._setEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={this.state.password}
            onChangeText={this._setPassword}
          />
          <Button title="login" onPress={this._login} />
        </View>
        <Loading on={this.state.loading} />
      </View>
    );
  }
}

export default withNavigationFocus(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafa',
  },
  logo: {
    flex: 1,
    width: '50%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 30,
    fontSize: 22,
    width: '100%',
    height: 50,
    borderBottomWidth: 0.2,
  },
  form: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
  },
});
