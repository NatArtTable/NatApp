import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

export default class Loading extends React.Component {
  render() {
    return this.props.on ? (
      <View style={styles.container}>
        <ActivityIndicator size={100} color="#f000ff" />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffb',
  },
});
