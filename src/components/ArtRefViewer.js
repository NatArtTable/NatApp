import React from 'react';
import {StyleSheet, TextInput, View, ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import repository from './Repository';
import ImageViewer from './ImageViewer';
import ArtRefMetadatForm from './ArtRefMetadataForm';

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
    this._onPressTrash = this._onPressTrash.bind(this);
    this._onPressSave = this._onPressSave.bind(this);
  }

  show(image) {
    console.log(`Showing ${JSON.stringify(image)}`);
    this.setState({
      visible: true,
      image,
    });
  }

  isVisible() {
    return this.state.visible;
  }

  close() {
    console.log('ArtRefViewer hide called!');
    this.setState({visible: false});
  }

  _onPressSave() {
    Alert.alert('Edit', 'You are sure you want to save your changes?', [
      {
        text: 'Do It!',
        onPress: () => {
          console.log(`Altering image! id: ${this.state.image.id}`);

          repository
            .updateImage(
              this.state.image.id,
              this.state.image.description,
              this.state.image.tags,
              this.state.image.folder,
            )
            .then(() => this.props.reload())
            .catch(e => console.error(e));
          this.close();
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
              .then(() => this.props.reload());
            this.close();
          },
        },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
      ],
    );
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
          <ImageViewer
            style={imageStyle}
            source={{
              thumbnail_uri: this.state.image.thumbnail_uri,
              uri: this.state.image.uri,
            }}
            resizeMode="contain"
          />
          <View style={styles.formContainer}>
            <ArtRefMetadatForm
              containerStyle={styles.form}
              data={{
                description: this.state.image.description,
                tags: this.state.image.tags,
                folder: this.state.image.folder,
              }}
              onChangeData={data => {
                var image = Object.assign({}, this.state.image);
                image.description = data.description;
                image.tags = data.tags;
                image.folder = data.folder;

                this.setState({image});
              }}
            />
          </View>
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
    borderWidth: 0.3,
    borderColor: 'gray',
  },
  image: {
    borderRadius: 2,
  },
  exitButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  form: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6b1de',
  },
  icon: {},
  infoContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    margin: 10,
    width: '80%',
    height: 80,
    borderWidth: 0.5,
    borderColor: 'gray',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 80,
  },
  exitButton: {
    color: '#595959',
    borderRadius: 200,
  },
});
