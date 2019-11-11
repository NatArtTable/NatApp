import React from 'react';
import {Modal, StyleSheet} from 'react-native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

export default class ImageBigViewer extends React.Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
  }

  render() {
    return this.props.on ? (
      <Modal visible={true} transparent={true}>
        <ImageZoomViewer
          enableSwipeDown={true}
          onSwipeDown={this.props.onSwipeDown}
          imageUrls={[{url: this.props.uri}]}
        />
      </Modal>
    ) : null;
  }
}

const styles = StyleSheet.create({});
