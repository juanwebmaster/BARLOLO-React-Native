import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import Colors from '../../config/colors';
import {dynamicSize} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class ToggleBack extends React.Component {
  render() {
    const { style, navigation } = this.props;
    return (
      <TouchableOpacity style={style} onPress={() => navigation.goBack()}>
        <View style={styles.container}>
          <Icon name='arrow-left' size={dynamicSize(18)} color={Colors.red} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: dynamicSize(40),
    height: dynamicSize(40),
    borderRadius: dynamicSize(20),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.placeholder,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
});
