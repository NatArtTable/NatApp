import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';

export default class ActionsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activated: false};

    this._onToggleButtonPressed = this._onToggleButtonPressed.bind(this);
    this._renderButton = this._renderButton.bind(this);
    this._renderToggleButton = this._renderToggleButton.bind(this);
  }

  _renderButton(name, onPressHandler, options) {
    const bStyle = {
      ...styles.iconBackground,
      backgroundColor: options.backgroundColor,
    };
    const iStyle = {...styles.icon, color: options.color};

    return (
      <TouchableOpacity onPress={onPressHandler} style={bStyle}>
        <Icon
          name={name}
          onPress={onPressHandler}
          size={iconSize}
          style={iStyle}
        />
      </TouchableOpacity>
    );
  }

  _renderMenu() {
    return (
      <View style={styles.container}>
        {this._renderButton('image', () => 1, {
          color: '#595959',
          backgroundColor: 'white',
        })}
        {this._renderButton('camera', () => 1, {
          color: '#595959',
          backgroundColor: 'white',
        })}
        {this._renderButton('minus', this._onToggleButtonPressed, {
          color: '#595959',
          backgroundColor: '#1f7a1f',
        })}
      </View>
    );
  }

  _renderToggleButton() {
    return (
      <View>
        {this._renderButton('plus', this._onToggleButtonPressed, {
          color: 'white',
          backgroundColor: '#e324a7',
        })}
      </View>
    );
  }

  _onToggleButtonPressed() {
    // this.setState({activated: !this.state.activated});
    const options = {
      title: 'Select Image',
      // customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
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

  untoggle() {
    this.setState({activated: false});
  }

  isToggled() {
    return this.state.activated;
  }

  render() {
    if (this.state.activated) {
      return this._renderMenu();
    } else {
      return this._renderToggleButton();
    }
  }
}

const iconSize = 30;
const backgroundIconSize = 50;

const spacing = 30;
const buttonsNumber = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: buttonsNumber * (iconSize + spacing),
  },
  icon: {
    color: 'white',
  },

  iconBackground: {
    borderRadius: backgroundIconSize * 4,
    width: backgroundIconSize,
    height: backgroundIconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
