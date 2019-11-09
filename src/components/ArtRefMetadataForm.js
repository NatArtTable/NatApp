import React from 'react';

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
import ImageViewer from '../components/ImageViewer';

import TagInput from 'react-native-tags-input';

import repository from './Repository';

export default class ArtRefMetadataForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagInput: '',
      folderSuggestion: [],
      editFolderFocused: false,
    };

    this.render = this.render.bind(this);
    this._formatTags = this._formatTags.bind(this);
    this._onTagUpdate = this._onTagUpdate.bind(this);
    this._focusEditFolder = this._focusEditFolder.bind(this);
    this._unfocusEditFolder = this._unfocusEditFolder.bind(this);
  }

  _focusEditFolder() {
    this.setState({editFolderFocused: true});
  }

  _unfocusEditFolder() {
    this.setState({editFolderFocused: false});
  }

  _formatTags(tags) {
    return {
      tag: this.state.tagInput,
      tagsArray: tags.slice(0),
    };
  }

  _formatTag(text) {
    return text
      .normalize('NFD')
      .replace(/[^\w\s]|_/g, '')
      .toLowerCase();
  }

  _formatFolder(text) {
    return text
      .normalize('NFD')
      .replace(/[^\w]|_/g, '')
      .toLowerCase();
  }

  _onTagUpdate(tags) {
    this.props.data.tags = tags.tagsArray.map(this._formatTag);
    this.setState({tagInput: this._formatTag(tags.tag)}, () =>
      this.props.onChangeData(this.props.data),
    );
  }

  _getFolderSuggestion() {
    repository.suggestFolder('').then(res => {
      this.setState({folderSuggestion: res});
    });
  }

  render() {
    this._getFolderSuggestion();

    const imageStyle = {
      ...styles.image,
      width: '50%',
      aspectRatio: this.props.data.width / this.props.data.height,
    };

    return (
      <View
        style={StyleSheet.flatten([
          styles.container,
          this.props.containerStyle,
        ])}>
        <ImageViewer
          style={imageStyle}
          source={{
            thumbnail_uri: this.props.data.thumbnail_uri,
            uri: this.props.data.uri,
          }}
          resizeMode="contain"
          label={this.props.data.folder}
        />
        <TouchableOpacity
          style={styles.textInputContainer}
          onPress={this._focusEditFolder}>
          <Icon
            iconStyle={styles.margin}
            name={'folder'}
            type={'material-community'}
            color={styles.tagText.color}
          />
          <Text style={styles.textInput}>{this.props.data.folder}</Text>
        </TouchableOpacity>

        <View style={styles.textInputContainer}>
          <Icon
            iconStyle={styles.margin}
            name={'file-document-box'}
            type={'material-community'}
            color={styles.tagText.color}
          />
          <TextInput
            placeholder="description"
            multiline={true}
            style={styles.textInput}
            value={this.props.data.description}
            onChangeText={description => {
              this.props.data.description = description;
              this.props.onChangeData(this.props.data);
            }}
          />
        </View>

        <TagInput
          tags={this._formatTags(this.props.data.tags)}
          placeholder="tags..."
          leftElement={
            <Icon
              name={'tag-multiple'}
              type={'material-community'}
              color={styles.tagText.color}
            />
          }
          containerStyle={styles.textTagInputContainer}
          inputContainerStyle={styles.textInputContainer}
          tagStyle={styles.tag}
          tagsViewStyle={styles.textInputContainer}
          tagTextStyle={styles.tagText}
          updateState={this._onTagUpdate}
          autoCorrect={false}
        />
        {this.state.editFolderFocused ? (
          <View style={styles.modal}>
            <Autocomplete
              data={this.state.folderSuggestion}
              listStyle={styles.suggestContainer}
              renderItem={({item, _}) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.data.folder = this._formatFolder(item);
                    this.props.onChangeData(this.props.data);
                    this._unfocusEditFolder();
                  }}
                  style={styles.suggestItem}>
                  <Text style={styles.suggestText}>{item}</Text>
                </TouchableOpacity>
              )}
              renderTextInput={() => (
                <View
                  style={StyleSheet.flatten([
                    styles.textInputContainer,
                    styles.noMargin,
                  ])}>
                  <Icon
                    iconStyle={styles.margin}
                    name={'folder'}
                    type={'material-community'}
                    color={styles.tagText.color}
                  />
                  <TextInput
                    placeholder="folder..."
                    style={styles.textInput}
                    value={this.props.data.folder}
                    onBlur={this._unfocusEditFolder}
                    autoCorrect={false}
                    onChangeText={folder => {
                      this.props.data.folder = this._formatFolder(folder);
                      this.props.onChangeData(this.props.data);
                    }}
                  />
                </View>
              )}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textInputContainer: {
    marginTop: 15,
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  autocompleteContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  textInput: {
    color: '#666',
    paddingLeft: 3,
    fontSize: 16,
    width: '100%',
    minHeight: 50,
    textAlignVertical: 'center',
    fontFamily: 'Open Sans',
    fontWeight: 'normal',
  },
  margin: {
    marginLeft: 10,
  },
  textTagInputContainer: {
    paddingHorizontal: 0,
  },
  tag: {
    backgroundColor: '#fff',
  },
  tagText: {
    color: '#3ca897',
  },
  suggestContainer: {
    margin: 0,
    borderWidth: 2,
    borderColor: '#cccccc',
  },
  suggestItem: {
    padding: 10,
    backgroundColor: '#eee',
    marginRight: 0,
    height: 45,
    width: '100%',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  suggestText: {
    fontSize: 18,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
  },
  modal: {
    paddingHorizontal: 13,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
  },
  noMargin: {
    backgroundColor: '#fff',
    marginTop: 0,
  },
});
