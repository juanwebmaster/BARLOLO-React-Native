import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';

import LoadingComponent from '../components/LoadingComponent';
import NavHeader from '../components/NavHeader';
import config from '../config/config';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class Help extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  clickContact = () => {
    const {navigation} = this.props;
    let supportId = config.get('APP_SUPPORT_CHAT_UNIQUE_ID');
    navigation.navigate('ChatBox', { uniqueId: supportId });
  }

  render() {
    const {navigation} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Help')}/>
          <Image style={styles.logoImg} source={require('../assets/img/contact-us.png')}/>
          <Text style={styles.title}>{i18n.t('Contact Us')}</Text>
          <View style={styles.separator} />
          <View style={styles.contentsView}>
            <View style={styles.listItem}>
              <Image style={styles.itemIcon} source={require('../assets/img/record-button.png')}/>
              <Text style={styles.itemLabel}>{i18n.t('welcome')}</Text>
            </View>
            <View style={styles.listItem}>
              <Image style={styles.itemIcon} source={require('../assets/img/record-button.png')}/>
              <Text style={styles.itemLabel}>{i18n.t('happy')}</Text>
            </View>
            <View style={styles.listItem}>
              <Image style={styles.itemIcon} source={require('../assets/img/record-button.png')}/>
              <Text style={styles.itemLabel}>{i18n.t('talk')}</Text>
            </View>
            <View style={styles.listItem}>
              <Image style={[styles.itemIcon2, {marginLeft: 25}]} source={require('../assets/img/phone-receiver.png')}/>
              <Text style={styles.itemLabel}>+959 9611 33322,   +959 9611 33344</Text>
            </View>
            <View style={styles.listItem}>
              <Image style={[styles.itemIcon2, {marginLeft: 25}]} source={require('../assets/img/close-envelope.png')}/>
              <Text style={styles.itemLabel}>hello@barlolo.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.contactBtn} onPress={this.clickContact}>
            <Text style={styles.btnLabel}>{i18n.t('Customer Service')}</Text>
          </TouchableOpacity>
          <LoadingComponent visible={false}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoImg: {
    marginTop: dynamicSize(20),
    width: dynamicSize(120),
    height: dynamicSize(120),
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    fontSize: dynamicSize(25),
    fontWeight: 'bold',
    color: Colors.red,
  },
  separator: {
    marginTop: dynamicSize(15),
    width: '100%',
    height: dynamicSize(5),
    borderTopWidth: 1,
    borderColor: Colors.borderColor,
    opacity: 0.3,
  },
  contentsView: {
    flex: 1,
    paddingHorizontal: '5%',
  },
  listItem: {
    marginVertical: dynamicSize(5),
    flexDirection: 'row',
  },
  itemIcon: {
    marginTop: dynamicSize(5),
    marginRight: dynamicSize(15),
    width: dynamicSize(12),
    height: dynamicSize(12)
  },
  itemIcon2: {
    marginTop: 1,
    marginRight: dynamicSize(15),
    width: dynamicSize(20),
    height: dynamicSize(20),
    resizeMode: 'contain',
  },
  itemLabel: {
    flex: 1,
    fontSize: dynamicSize(16),
    fontWeight: '100',
    lineHeight: dynamicSize(22),
    color: Colors.black,
    opacity: 0.8,
  },
  contactBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: dynamicSize(50),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    fontSize: dynamicSize(20),
    color: Colors.white,
  }
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
)(Help);