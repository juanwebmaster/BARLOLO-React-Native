/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import {DrawerActions} from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import i18n from "@app/locale/i18n";
import Colors from '../config/colors';
import {dynamicSize} from '../config';

class NavHeader extends React.Component {

  static defaultProps = {
    title: '',
    isBack: true,
    isMenuBtn: false,
    isCartBtn: false,
  }

  goBack() {
    if(this.props.goBack) {
      this.props.goBack();
      return;
    }
    const {navigation} = this.props;
    navigation.goBack();
  }

  onClickMenu() {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  }

  onClickCart() {
    this.props.navigation.navigate('CartList');
  }

  onClickChat() {
    this.props.navigation.navigate('Chat');
  }

  render() {
    const {style, isBack, title, isMenuBtn, isCartBtn, cartCount, onClear, isChatBtn} = this.props;
    return (
      <View style={[styles.container, style]}>
        {isBack &&
        <TouchableOpacity style={styles.leftBtn} onPress={() => this.goBack()}>
          <Icon name='arrow-left' size={dynamicSize(16)} color={Colors.white}/>
        </TouchableOpacity>}
        {isMenuBtn &&
        <TouchableOpacity style={styles.leftBtn} onPress={() => this.onClickMenu()}>
          <Icon name='bars' size={dynamicSize(20)} color={Colors.white}/>
        </TouchableOpacity>}
        <Text style={styles.title}>{title}</Text>
        {isCartBtn &&
        <TouchableOpacity style={styles.rightBtn} onPress={() => this.onClickCart()}>
          <Icon name='shopping-cart' size={dynamicSize(16)} color={Colors.white}/>
          {isCartBtn && cartCount != 0 && <View style={styles.notifyBg}>
            <Text style={styles.notifyTxt}>{cartCount}</Text>
          </View>}
        </TouchableOpacity>}
        {onClear &&
        <TouchableOpacity style={styles.rightBtn} onPress={onClear}>
          <Text style={styles.rightLabel}>{i18n.t('Clear')}</Text>
        </TouchableOpacity>}
        {isChatBtn &&
        <TouchableOpacity style={styles.rightBtn} onPress={() => this.onClickChat()}>
          <Icon name='comments' size={dynamicSize(16)} color={Colors.white}/>
        </TouchableOpacity>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: dynamicSize(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.red,
  },
  leftBtn: {
    position: 'absolute',
    left: '4%',
  },
  title: {
    fontSize: dynamicSize(18),
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.white,
  },
  rightBtn: {
    position: 'absolute',
    right: '4%',
  },
  notifyBg: {
    position: 'absolute',
    top: dynamicSize(-8),
    right: dynamicSize(-10),
    width: dynamicSize(16),
    height: dynamicSize(16),
    borderRadius: dynamicSize(8),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyTxt: {
    fontSize: dynamicSize(10),
    color: Colors.red,
  },
  rightLabel: {
    fontSize: dynamicSize(16),
    textAlign: 'center',
    color: Colors.white,
  },
});

const mapStateToProps = ({ cart }) => ({
  cartCount: cart.carts.totalItem ? cart.carts.totalItem : 0,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavHeader);
