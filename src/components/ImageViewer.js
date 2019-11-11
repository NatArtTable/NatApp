import React from 'react';
import {StyleSheet, Image, Text, View, TouchableOpacity} from 'react-native';

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
  }

  render() {
    const style = {...this.props.style, backgroundColor: '#e1e4e8'};

    return (
      <TouchableOpacity onPress={this.props.onPress} style={style}>
        <Image
          style={styles.image}
          source={{uri: this.props.source.thumbnail_uri}}
          resizeMode="contain"
        />
        <Image
          style={{...styles.imageOverlay, ...style.image}}
          source={{uri: this.props.source.fallback_uri}}
          resizeMode="contain"
        />
        <Image
          style={{...styles.imageOverlay, ...style.image}}
          source={{uri: this.props.source.uri}}
          resizeMode="contain"
        />
        <View style={styles.labelContainer}>
          <Text style={styles.textLabel}>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
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
  labelContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#3ca897',
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 8,
  },
  textLabel: {
    fontSize: 12,
    color: 'white',
  },
});
