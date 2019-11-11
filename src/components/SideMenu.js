import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderItem(text) {
    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Icon name="camera" size={22} style={styles.itemIcon} />
        <Text style={styles.itemText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return this.props.on ? (
      <View style={styles.container}>
        <View style={styles.sidemenu}>
          <View style={styles.head} />
          <ScrollView>
            {this._renderItem('Item 1')}
            {this._renderItem('Item 2')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
            {this._renderItem('Item 3')}
          </ScrollView>
          {this._renderItem('Logout')}
        </View>
        <View
          style={styles.rest}
          onStartShouldSetResponder={this.props.onClickedOutOfMenu}
        />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
  },
  rest: {
    flex: 1,
    backgroundColor: '#fff0',
  },
  sidemenu: {
    flex: 3,
    backgroundColor: '#fff',
    borderRightWidth: 0.7,
  },
  head: {
    height: '20%',
    backgroundColor: '#fafa',
  },
  itemContainer: {
    height: 70,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#bbb',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    color: '#888',
  },
  itemText: {
    marginLeft: 20,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#555',
  },
});
