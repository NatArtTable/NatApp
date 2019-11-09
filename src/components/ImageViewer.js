import React from 'react';
import {StyleSheet, Image, View} from 'react-native';

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = {...this.props.style, backgroundColor: '#e1e4e8'};

    return (
      <View style={style}>
        <Image
          style={styles.image}
          source={{uri: this.props.source.thumbnail_uri}}
          resizeMode="contain"
        />
        <Image
          style={{...styles.imageOverlay, ...style.image}}
          source={{uri: this.props.source.uri}}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: '#e1e4e8',
  },
});
