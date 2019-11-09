import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Icon} from 'react-native-elements';

import TagInput from 'react-native-tags-input';

export default class ArtRefMetadataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagInput: ''};

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

  render() {
    return (
      <View style={this.props.containerStyle}>
        <View style={styles.textInputContainer}>
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
            onChangeText={folder => {
              console.log(folder);
              this.props.data.folder = this._formatFolder(folder);
              this.props.onChangeData(this.props.data);
            }}
          />
        </View>
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
  textInput: {
    fontSize: 16,
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
});
