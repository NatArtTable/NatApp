import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import repository from '../components/Repository';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);

    this._renderSidemenuHeader = this._renderSidemenuHeader.bind(this);
  }

  _renderSidemenuHeader() {
    if (repository.isLogged()) {
      return <Text>Logged in as {repository.getCredential().email}</Text>;
    } else {
      return <Text>Not logged in</Text>;
    }
  }

  _renderItem(text, onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
        <Icon name="camera" size={22} style={styles.itemIcon} />
        <Text style={styles.itemText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return this.props.on ? (
      <View style={styles.container}>
        <View style={styles.sidemenu}>
          <View style={styles.head}>{this._renderSidemenuHeader()}</View>
          <ScrollView style={styles.scroll} />
          {this._renderItem(
            this.props.lastButtonLabel,
            this.props.onLastButtonClicked,
          )}
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
    height: '100%',
    width: '100%',
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
