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

  render() {
    return (
      <View style={this.props.containerStyle}>
        <View style={styles.textInputContainer}>
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
          inputStyle={styles.textInput}
          inputContainerStyle={styles.textInputContainer}
          tagStyle={styles.tag}
          tagsViewStyle={styles.textInputContainer}
          tagTextStyle={styles.tagText}
          updateState={tags => {
            this.props.data.tags = tags.tagsArray.map(this._formatTag);
            this.setState({tagInput: this._formatTag(tags.tag)}, () =>
              this.props.onChangeData(this.props.data),
            );
          }}
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
    paddingHorizontal: 0,
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: '800',
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
