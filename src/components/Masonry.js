import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';

class Column extends React.Component {
  static propTypes = {
    keyExtractor: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  render() {
    const items = this.props.data.map((item, index) => (
      <View key={index}>{this.props.renderItem(item)}</View>
    ));

    return (
      <View style={styles.column} data={this.props.data}>
        {items}
      </View>
    );
  }
}

export default class Masonry extends React.Component {
  static defaultProps = {
    columnsNumber: 2,
  };

  constructor(props) {
    super(props);
  }

  _arrange(columnNumber, items) {
    const columns = [...Array(columnNumber)].map(_ => new Array(0));
    const heights = new Array(columnNumber).fill(0);

    items.forEach(item => {
      const smallest = this._argmin(heights);

      columns[smallest].push(item);
      heights[smallest] += item.height;
    });

    const maxHeight = Math.max(...heights);

    return {columns, maxHeight};
  }

  _argmin(a) {
    var smallest = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] < a[smallest]) {
        smallest = i;
      }
    }
    return smallest;
  }

  render() {
    const {maxHeight, columns} = this._arrange(
      this.props.columns,
      this.props.items,
    );

    console.log('Masonry rerendered!');

    const containerSytyle = {...styles.container, height: maxHeight};
    return (
      <ScrollView {...this.props}>
        {this.props.header}
        <View style={containerSytyle}>
          {columns.map((col, index) => {
            return (
              <Column
                key={index}
                data={col}
                renderItem={this.props.renderItem.bind(this)}
              />
            );
          })}
        </View>
        {this.props.footer}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  column: {flex: 1},
});
