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

import i18n from "@app/locale/i18n";
import Colors from '../config/colors';
import {TabBarIconSets} from '../config/images';
import {dynamicSize} from '../config';

class TabBarComponent extends React.Component {
  render() {
    const {navigation, unreadChatCount, unreadNotifyCount} = this.props;
    const {routeName} = navigation.state.routes[navigation.state.index];
    return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')} >
              <Image style={[styles.icon, routeName == 'Home' && {tintColor: Colors.active}]} source={TabBarIconSets.home}/>
              <Text style={[styles.label, routeName == 'Home' && {color: Colors.active}]}>{i18n.t('home')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Wish')} >
              <Image style={[styles.icon, routeName == 'Wish' && {tintColor: Colors.active}]} source={TabBarIconSets.wish}/>
              <Text style={[styles.label, routeName == 'Wish' && {color: Colors.active}]}>{i18n.t('wishlist')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Chat')} >
              <View>
                <Image style={[styles.icon, routeName == 'Chat' && {tintColor: Colors.active}]} source={TabBarIconSets.chat}/>
                {unreadChatCount != 0 && <View style={styles.notifyBg}>
                  <Text style={styles.notifyTxt}>{unreadChatCount}</Text>
                </View>}
              </View>
              <Text style={[styles.label, routeName == 'Chat' && {color: Colors.active}]}>{i18n.t('chat')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Notification')} >
              <View>
                <Image style={[styles.icon, routeName == 'Notification' && {tintColor: Colors.active}]} source={TabBarIconSets.notification}/>
                {(unreadNotifyCount != 0 )&& <View style={styles.notifyBg}>
                  <Text style={styles.notifyTxt}>{unreadNotifyCount}</Text>
                </View>}
              </View>
              <Text style={[styles.label, routeName == 'Notification' && {color: Colors.active}]}>{i18n.t('notification')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Account')} >
              <Image style={[styles.icon, routeName == 'Account' && {tintColor: Colors.active}]} source={TabBarIconSets.account}/>
              <Text style={[styles.label, routeName == 'Account' && {color: Colors.active}]}>{i18n.t('Account')}</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: dynamicSize(8),
    width: '100%',
    height: dynamicSize(70),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: dynamicSize(25),
    height: dynamicSize(25),
    resizeMode: 'contain',
    tintColor: 'gray',
  },
  label: {
    fontSize: dynamicSize(12),
    textAlign: 'center',
    color: Colors.gray,
  },
  notifyBg: {
    position: 'absolute',
    top: -5,
    right: -5,
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

const mapStateToProps = ({ auth, user, chat, notification }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  unreadChatCount: chat.unreadCount,
  unreadNotifyCount: notification.unreadcount.count,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabBarComponent);