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

import TagInput from 'react-native-tags-input';

import repository from './Repository';

export default class ArtRefMetadataForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagInput: '',
      folderSuggestion: [],
      folderInputFocus: false,
    };

    this.render = this.render.bind(this);
    this._formatTags = this._formatTags.bind(this);
    this._onTagUpdate = this._onTagUpdate.bind(this);
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
    const query = this.props.data.folder;

    repository.suggestFolder(query).then(res => {
      this.setState({folderSuggestion: res});
    });
  }

  render() {
    this._getFolderSuggestion();

    return (
      <View style={this.props.containerStyle}>
        <View style={styles.autocompleteContainer}>
          <Autocomplete
            data={this.state.folderSuggestion}
            hideResults={!this.state.folderInputFocus}
            inputContainerStyle={styles.noMargin}
            listStyle={styles.suggestContainer}
            renderItem={({item, i}) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.data.folder = this._formatFolder(item);
                  this.props.onChangeData(this.props.data);
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
                  autoCorrect={false}
                  onFocus={() => this.setState({folderInputFocus: true})}
                  // onBlur={() => this.setState({folderInputFocus: false})}
                  onChangeText={folder => {
                    this.props.data.folder = this._formatFolder(folder);
                    this.props.onChangeData(this.props.data);
                  }}
                />
              </View>
            )}
          />
        </View>

        <View
          style={StyleSheet.flatten([
            styles.textInputContainer,
            styles.descriptionInputContainer,
          ])}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputContainer: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionInputContainer: {
    marginTop: 70,
  },
  autocompleteContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  noMargin: {
    marginBottom: 0,
    marginTop: 0,
  },
  textInput: {
    fontSize: 16,
    width: '100%',
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
    backgroundColor: 'white',
    margin: 0,
    // height: 4242,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  suggestItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 0,
    height: 45,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  suggestText: {
    fontSize: 18,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
  },
});
