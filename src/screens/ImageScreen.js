import React from 'react';
import {Alert, StyleSheet, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import {withNavigationFocus} from 'react-navigation';

import ArtRefMetadataForm from '../components/ArtRefMetadataForm';
import repository from '../components/Repository';

class ImageScreen extends React.Component {
  static navigationOptions = {
    title: 'Art Reference',
  };

  constructor(props) {
    super(props);

    const image = Object.assign(
      {
        tags: [],
        folder: '',
        description: '',
        submitted: false,
        width: 1,
        height: 1,
      },
      this.props.image,
    );

    this.state = {mode: 'add', image, submitted: false};

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._addImage = this._addImage.bind(this);
    this._updateImage = this._updateImage.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onPressSave = this._onPressSave.bind(this);
    this._onPressTrash = this._onPressTrash.bind(this);

    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      this._onFocus,
    );
  }

  _onFocus() {
    const image = this.props.navigation.getParam('image', {});
    const mode = this.props.navigation.getParam('mode', {});

    console.log(
      `Tab ImageScreen refocused. With parameters mode -> ${mode} and image ->${JSON.stringify(
        image,
      )}`,
    );

    this.setState({mode, image: Object.assign(this.state.image, image)});
  }

  _onFormSubmit() {
    if (this.state.submitted) {
      return;
    }

    if (this.state.mode === 'add') {
      this._addImage();
    } else if (this.state.mode === 'edit') {
      this._updateImage();
    }
  }

  _onPressSave() {
    Alert.alert('Edit', 'You are sure you want to save your changes?', [
      {
        text: 'Do It!',
        onPress: () => {
          console.log(`Altering image! id: ${this.state.image.id}`);
          this._onFormSubmit();
        },
      },
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
    ]);
  }

  _onPressTrash() {
    Alert.alert(
      'Remove',
      'You are sure you want to remove this image from your library?',
      [
        {
          text: 'Do It!',
          onPress: () => {
            console.log(`Removendo Imagem! id: ${this.state.image.id}`);
            repository
              .removeImage(this.state.image.id)
              .then(() => this.props.navigation.goBack());
          },
        },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
    );
  }

  _addImage() {
    this.setState({submitted: true});

    const image = this.state.image;

    console.log(`Adding ArtRef! uri: ${image.uri}`);

    return repository
      .addImage(
        image.uri,
        image.width,
        image.height,
        image.description,
        image.tags,
        image.folder,
      )
      .then(() => this.props.navigation.goBack());
  }

  _updateImage() {
    this.setState({submitted: true});

    const image = this.state.image;

    console.log(`Adding ArtRef! uri: ${image.uri}`);

    return repository
      .updateImage(image.id, image.description, image.tags, image.folder)
      .then(() => this.props.navigation.goBack());
  }

  render() {
    const image = this.state.image;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formContainer}>
            <ArtRefMetadataForm
              containerStyle={styles.form}
              data={image}
              onChangeData={data => {
                this.setState({image: Object.assign(this.state.image, data)});
              }}
            />
          </View>
          {this.state.mode === 'add' ? (
            <View style={styles.buttonsContainer}>
              <Icon
                name="check"
                onPress={this._onFormSubmit}
                size={70}
                style={styles.icon}
              />
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <Icon
                name="trash"
                onPress={this._onPressTrash}
                size={45}
                style={styles.icon}
              />
              <Icon
                name="pencil"
                onPress={this._onPressSave}
                size={45}
                style={styles.icon}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default withNavigationFocus(ImageScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 50,
  },
  image: {
    borderRadius: 2,
  },
  textInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 0.4,
    width: '90%',
    margin: 15,
  },
  icon: {
    color: '#595959',
    borderRadius: 200,
  },
  form: {
    flex: 1,
  },
  formContainer: {
    zIndex: 2,
    flex: 1,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6b1de',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 80,
  },
});
