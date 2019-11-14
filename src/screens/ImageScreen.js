import React from 'react';
import {Alert, StyleSheet, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import {withNavigationFocus} from 'react-navigation';

import ArtRefMetadataForm from '../components/ArtRefMetadataForm';
import repository from '../components/Repository';
import Loading from '../components/Loading';
import ImageBigViewer from '../components/ImageBigViewer';

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
        width: 1,
        height: 1,
        uri: '',
      },
      this.props.navigation.getParam('image', {}),
    );

    console.log(
      `Tab ImageScreen called with parameters mode -> ${mode} and image.uri ->${
        image.uri
      }`,
    );

    const mode = this.props.navigation.getParam('mode', {});

    this.state = {
      mode,
      image,
      loading: false,
      big: false,
    };

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onImagePress = this._onImagePress.bind(this);
    this._addImage = this._addImage.bind(this);
    this._updateImage = this._updateImage.bind(this);
    this._onPressSave = this._onPressSave.bind(this);
    this._onPressNew = this._onPressNew.bind(this);
    this._onPressTrash = this._onPressTrash.bind(this);
    this._hideBigViewer = this._hideBigViewer.bind(this);
    this._onArtRefMetadaFormChangeData = this._onArtRefMetadaFormChangeData.bind(
      this,
    );
  }

  _onFormSubmit(action = 'save') {
    console.log(`Image Screen submitted form with action: ${action}`);

    this.setState({loading: true}, () => {
      var promise = null;

      if (action === 'save') {
        if (this.state.mode === 'add') {
          promise = this._addImage();
        } else if (this.state.mode === 'edit') {
          promise = this._updateImage();
        }
      } else if (action === 'delete') {
        promise = this._deleteImage();
      }
      promise
        .then(() => this.props.navigation.goBack())
        .catch(err => Alert.alert('Error!', err.message))
        .finally(() => this.setState({loading: false}));
    });
  }

  _onImagePress() {
    console.log('BIG!');
    this.setState({big: true});
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

  _onPressNew() {
    Alert.alert(
      'Save',
      'You are sure you want add this image to the catalog?',
      [
        {
          text: 'Do It!',
          onPress: () => {
            console.log(`Adding new image! id: ${this.state.image.uri}`);
            this._onFormSubmit();
          },
        },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
    );
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
            this._onFormSubmit('delete');
          },
        },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
    );
  }

  _addImage() {
    const image = this.state.image;

    console.log(`Adding ArtRef! uri: ${image.uri}`);

    return repository.addImage(
      image.uri,
      image.width,
      image.height,
      image.description,
      image.tags,
      image.folder,
    );
  }

  _updateImage() {
    const image = this.state.image;

    console.log(`Updating ArtRef! uri: ${image.uri}; id: ${image.id}`);

    return repository.updateImage(
      image.id,
      image.description,
      image.tags,
      image.folder,
    );
  }

  _deleteImage() {
    return repository.removeImage(this.state.image.id);
  }

  _onArtRefMetadaFormChangeData(data) {
    this.setState({image: Object.assign({}, this.state.image, data)});
  }

  _hideBigViewer() {
    this.setState({big: false});
  }

  render() {
    const image = this.state.image;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formContainer}>
            <ArtRefMetadataForm
              onImagePress={this._onImagePress}
              containerStyle={styles.form}
              data={image}
              onChangeData={this._onArtRefMetadaFormChangeData}
            />
          </View>
          {this.state.mode === 'add' ? (
            <View style={styles.buttonsContainer}>
              <Icon
                name="check"
                onPress={this._onPressNew}
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
        <ImageBigViewer
          on={this.state.big}
          uri={image.public_uri}
          onSwipeDown={this._hideBigViewer}
        />
        <Loading on={this.state.loading} />
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
