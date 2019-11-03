import React from 'react';
import {StyleSheet, Image, View, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

export default class ArtRefViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      image: {uri: '', width: 1, height: 1},
    };

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.render = this.render.bind(this);
  }

  show(image) {
    console.log(`Showing ${JSON.stringify(image)}`);
    this.setState({visible: true, image});
  }

  isVisible() {
    return this.state.visible;
  }

  close() {
    console.log('ArtRefViewer hide called!');
    this.setState({visible: false});
  }

  render() {
    const imageStyle = {
      ...styles.image,
      width: '100%',
      aspectRatio: this.state.image.width / this.state.image.height,
    };

    return this.state.visible ? (
      <View style={styles.container}>
        <ScrollView>
          <Image
            style={imageStyle}
            source={{uri: this.state.image.uri}}
            resizeMode="contain"
          />
          <View style={styles.buttonsContainer}>
            <Icon
              name="trash"
              onPress={() => this.props.onPressThrash(this.state.image)}
              size={45}
              style={styles.icon}
            />
          </View>
        </ScrollView>
        <View style={styles.exitButtonContainer}>
          <Icon
            style={styles.exitButton}
            onPress={this.close}
            name="close-o"
            size={50}
          />
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    width: '90%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 50,
  },
  image: {
    borderRadius: 20,
  },
  exitButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  icon: {},
  buttonsContainer: {
    height: 50,
  },
  exitButton: {
    // backgroundColor: 'white',
    color: '#595959',
    borderRadius: 200,
  },
});