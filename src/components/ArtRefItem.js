import React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';

export default class ArtRefItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const itemSyle = {...styles.item, ...this.props};

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={itemSyle}
        key={this.props.id}>
        <Image
          style={styles.image}
          source={{uri: this.props.uri}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 20,
    width: '98%',
    height: '98%',
  },
});
