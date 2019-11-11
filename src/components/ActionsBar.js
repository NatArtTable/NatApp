import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';

export default class ActionsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activated: false};

    this._onPlusButtonPressed = this._onPlusButtonPressed.bind(this);
    this._renderButton = this._renderButton.bind(this);
  }

  _renderButton(name, onPressHandler, options) {
    const bStyle = {
      ...styles.iconBackground,
      ...options,
    };

    return (
      <View style={bStyle}>
        <Icon
          onPress={onPressHandler}
          name={name}
          size={iconSize}
          style={styles.icon}
        />
      </View>
    );
  }

  _onPlusButtonPressed() {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error(response.error);
      } else {
        this.props.onAddImage(response);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderButton('bars', this.props.onBarsPressed, {
          position: 'absolute',
          left: 12,
        })}
        {this._renderButton('plus', this._onPlusButtonPressed, {
          position: 'absolute',
          right: 12,
        })}
      </View>
    );
  }
}

const iconSize = 30;
const backgroundIconSize = 50;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: iconSize * 0.7,
    justifyContent: 'center',
  },
  icon: {
    color: 'white',
  },
  iconBackground: {
    backgroundColor: '#e324a7',
    borderRadius: backgroundIconSize * 4,
    width: backgroundIconSize,
    height: backgroundIconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
