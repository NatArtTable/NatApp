import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Masonry from './Masonry';
import ArtRefItem from './ArtRefItem';

export default class ArtRefsViewer extends React.Component {
  constructor(props) {
    super(props);

    const {width, height} = Dimensions.get('window');
    this.state = {
      width,
      height,
    };

    this.render = this.render.bind(this);
    this._fitToScreen = this._fitToScreen.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this._getNumberOfColumns = this._getNumberOfColumns.bind(this);
  }

  _fitToScreen(item) {
    const itemCopy = {...item};

    const columnWidth =
      this.state.width / this._getNumberOfColumns(this.state.width);

    itemCopy.width = columnWidth;
    itemCopy.height = (item.height / item.width) * columnWidth;

    return itemCopy;
  }

  _onLayout() {
    const {height, width} = Dimensions.get('window');
    this.setState({height, width});
  }

  _getNumberOfColumns(width) {
    return width > 500 ? 3 : 2;
  }

  render() {
    const numberOfColumns = this._getNumberOfColumns(this.state.width);

    return (
      <View onLayout={this._onLayout}>
        <Masonry
          style={styles.container}
          ref={masonry => {
            this._masonry = masonry;
          }}
          items={this.props.items.map(this._fitToScreen)}
          columns={numberOfColumns}
          renderItem={item => (
            <ArtRefItem
              {...item}
              onPress={() => this.props.onItemPressed(item)}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
