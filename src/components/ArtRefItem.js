import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ImageViewer from './ImageViewer';

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
        <ImageViewer
          style={styles.image}
          source={{thumbnailUri: this.props.thumbnailUri, uri: this.props.uri}}
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
    borderRadius: 2,
    width: '98%',
    height: '98%',
  },
});
