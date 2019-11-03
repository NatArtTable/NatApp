import React from 'react';
import {StyleSheet, ScrollView, View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import ImageViewer from '../components/ImageViewer';

import repository from '../components/Repository';

export default class ImageScreen extends React.Component {
  static navigationOptions = {
    title: 'New Art Reference',
  };

  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      description: '',
    };

    this._onFormSubmit = this._onFormSubmit.bind(this);
  }

  _onFormSubmit() {
    const image = {...this.props.navigation.getParam('image', {})};

    console.log(`Adding ArtRef! uri: ${image.uri}`);

    image.description = this.state.description;
    image.tags = this.state.tags;

    repository.addImage(image).then(() => this.props.navigation.goBack());
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
              thumbnailUri: image.thumbnailUri,
              uri: image.uri,
            }}
            resizeMode="contain"
          />
          <View style={styles.formContainer}>
            <TextInput
              placeholder="description"
              multiline={true}
              style={styles.textInput}
              value={this.state.description}
              onChangeText={description => {
                this.setState({description});
              }}
            />
            <TextInput
              placeholder="tags"
              style={styles.textInput}
              value={this.state.tags.join(', ')}
              onChangeText={text => {
                this.setState({
                  tags: text.split(',').map(tag => tag.trim().toLowerCase()),
                });
              }}
            />

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
  icon: {},
  formContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
    paddingBottom: 20,
  },
});
