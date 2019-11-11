import React from 'react';
import {StyleSheet, View} from 'react-native';
import ImageViewer from './ImageViewer';

export default class ArtRefItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const itemSyle = {...styles.item, ...this.props};

    return (
      <View style={itemSyle} key={this.props.id}>
        <ImageViewer
          onPress={this.props.onPress}
          label={this.props.folder}
          style={styles.image}
          source={{
            thumbnail_uri: this.props.thumbnail_uri,
            uri: this.props.public_uri,
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
