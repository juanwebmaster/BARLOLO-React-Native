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
import {dynamicSize} from '../config';
// import {TabBarIconSets} from '../config/images';

const TabBarIconSets = {
  home: require('../assets/img/home.png'),
  wish: require('../assets/img/wish.png'),
  chat: require('../assets/img/chat.png'),
  notification: require('../assets/img/notification.png'),
  account: require('../assets/img/user.png'),
  sort: require('../assets/img/sort.png'),
  filter: require('../assets/img/filter.png'),
  viewlist: require('../assets/img/bulleted-list.png'),
  viewgrid: require('../assets/img/grid-view.png'),
};

class CatTabBar extends React.Component {
  render() {
    const {style, navigation, setSortBy, setfilter, setView, viewType} = this.props;
    return (
        <View style={[styles.container, style]}>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')} >
              <Image style={styles.icon} source={TabBarIconSets.home}/>
              <Text style={styles.label}>{i18n.t('home')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={setSortBy} >
              <Image style={styles.icon} source={TabBarIconSets.sort}/>
              <Text style={styles.label}>{i18n.t('Sort')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={setfilter} >
              <Image style={styles.icon} source={TabBarIconSets.filter}/>
              <Text style={styles.label}>{i18n.t('Filters')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={setView} >
              {viewType == 'grid' ?
              <Image style={styles.icon} source={TabBarIconSets.viewlist}/> :
              <Image style={styles.icon} source={TabBarIconSets.viewgrid}/>}
              <Text style={styles.label}>{i18n.t('View')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Account')} >
              <Image style={styles.icon} source={TabBarIconSets.account}/>
              <Text style={styles.label}>{i18n.t('Account')}</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
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
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
    tintColor: 'gray',
  },
  label: {
    fontSize: dynamicSize(12),
    textAlign: 'center',
    color: Colors.gray,
  },
});

const mapStateToProps = ({ auth, user }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
});

const mapDispatchToProps = {
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CatTabBar);