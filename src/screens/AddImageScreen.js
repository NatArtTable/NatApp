import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import ImageViewer from '../components/ImageViewer';
import ArtRefMetadataForm from '../components/ArtRefMetadataForm';
import repository from '../components/Repository';

export default class AddImageScreen extends React.Component {
  static navigationOptions = {
    title: 'New Art Reference',
  };

  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      folder: '',
      description: '',
      submitted: false,
    };

    this._onFormSubmit = this._onFormSubmit.bind(this);
  }

  _onFormSubmit() {
    if (this.state.submitted) {
      return;
    }

    this.setState({submitted: true});

    const image = {...this.props.navigation.getParam('image', {})};

    console.log(`Adding ArtRef! uri: ${image.uri}`);

    image.description = this.state.description;
    image.tags = this.state.tags;
    image.folder = this.state.folder;

    repository
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

  render() {
    const image = this.props.navigation.getParam('image', {});

    const imageStyle = {
      ...styles.image,
      width: '100%',
      aspectRatio: image.width / image.height,
    };

    console.log(`ImageScreen called with uri ${image.uri}`);

    return (
      <View style={styles.container}>
        <ScrollView>
          <ImageViewer
            style={imageStyle}
            source={{
              thumbnail_uri: image.thumbnail_uri,
              uri: image.uri,
            }}
            resizeMode="contain"
          />
          <View style={styles.formContainer}>
            <ArtRefMetadataForm
              containerStyle={styles.form}
              data={{
                description: this.state.description,
                tags: this.state.tags,
                folder: this.state.folder,
              }}
              onChangeData={data => {
                this.setState({
                  folder: data.folder,
                  description: data.description,
                  tags: data.tags,
                });
              }}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Icon
              name="check"
              onPress={this._onFormSubmit}
              size={70}
              style={styles.icon}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

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
