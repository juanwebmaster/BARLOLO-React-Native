import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

import Colors from '../../config/colors';
import {dynamicSize} from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class ToggleCart extends React.Component {
  onTap = () => {
    this.props.navigation.navigate('CartList');
  }
  render() {
    const { style, navigation, cartCount } = this.props;
    return (
      <TouchableOpacity style={style} onPress={this.onTap}>
        <View style={styles.container}>
          <Icon name='shopping-cart' size={dynamicSize(18)} color={Colors.red} />
          {cartCount != 0 && <View style={styles.notifyBg}>
            <Text style={styles.notifyTxt}>{cartCount}</Text>
          </View>}
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
  notifyBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: dynamicSize(16),
    height: dynamicSize(16),
    borderRadius: dynamicSize(8),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyTxt: {
    fontSize: dynamicSize(10),
    color: 'white',
  }
});

const mapStateToProps = ({ cart }) => ({
  cartCount: cart.carts.totalItem ? cart.carts.totalItem : 0,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleCart);
