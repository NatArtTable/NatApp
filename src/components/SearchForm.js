import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SearchBar} from 'react-native-elements';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {
        text: '',
      },
    };

    this.render = this.render.bind(this);
    this._handleChangeText = this._handleChangeText.bind(this);
    this._handleChangeQuery = this._handleChangeQuery.bind(this);
  }

  _handleChangeText(text) {
    this.setState({query: {text}}, this._handleChangeQuery);
  }

  _handleChangeQuery() {
    this.props.onChange(this.state.query);
  }

  render() {
    return (
      <View>
        <SearchBar
          placeholder="search"
          style={styles.input}
          onChangeText={this._handleChangeText}
          value={this.state.query.text}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
