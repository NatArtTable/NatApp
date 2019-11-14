import React from 'react';
import {StyleSheet, View} from 'react-native';
import ImageViewer from './ImageViewer';

export default class ArtRefItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const itemSyle = {
      ...styles.item,
      width: this.props.item.width,
      height: this.props.item.height,
    };

    return (
      <View style={itemSyle} key={this.props.item.id}>
        <ImageViewer
          onPress={() => this.props.onPress(this.props.item)}
          label={this.props.item.folder}
          style={styles.image}
          source={{
            thumbnail_uri: this.props.item.thumbnail_uri,
            uri: this.props.item.public_uri,
          }}
          resizeMode="contain"
        />
      </View>
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
