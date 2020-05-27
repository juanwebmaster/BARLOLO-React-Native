import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {fetchNotification} from '../store/actions/notification';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class NotificationList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }
      this.setState({isLoading: true});

      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
      ]).then(() => {
        const {routeName, params} = state;
        if (params && params.requiresAuth && !this.props.isLogged) {
          this.setState({isLoading: false});
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
        }

        if(this.props.isLogged) {
          this.props.fetchNotification(this.props.user.id)
          .then(() => {
            this.setState({isLoading: false});
          })
          .catch(() => {
            this.setState({isLoading: false});
          })
        }
      })
      .catch(error => {
        this.setState({isLoading: false});

        navigation.goBack();
      })
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  orderLink() {
    return notification => {
      if (notification.status == 'disapproved')
        return 'purchase-history/seller-to-confirm'
      if (
        notification.status == 'approved' ||
        notification.status == 'processing' ||
        notification.status == 'shipped'
      )
        return `purchase-history/to-receive#card-${notification.order_id}`

      if (notification.status == 'complete')
        return `purchase-history/complete#card-${notification.order_id}`
      if (notification.status == 'Product wishlist')
        return `wishlists#card-${notification.wishlist_id}`

      return 'purchase-history/seller-to-confirm'
    }
  }

  ago(value) {
    return moment(value).fromNow()
  }

  render() {
    const {isLoading} = this.state;
    const {unreadNotifyCount, notifyitems, navigation} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Notification') + (unreadNotifyCount ? ` (${unreadNotifyCount})` : '')}/>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentStyle}
            removeClippedSubviews={true}
          >
          {notifyitems && notifyitems.map((notification, index) => 
            <TouchableOpacity key={index} style={styles.notifyItem}>
              <FallbackImage
                style={styles.notifyimg}
                source={notification.value}
              />
              <View style={styles.notifyInfo}>
                <Text style={styles.notifyTitle}>{notification.title + (notification.ordernumber ? (' - ' + notification.ordernumber) : '')}</Text>
                <Text style={styles.notifyMgs}>{notification.msg}</Text>
                <Text style={styles.notifyAge}>{this.ago(notification.created_at)}</Text>
              </View>
            </TouchableOpacity>
          )}
          </ScrollView>
          <LoadingComponent visible={isLoading}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentStyle: {
    paddingHorizontal: '5%',
  },
  notifyItem: {
    width: '100%',
    paddingVertical: dynamicSize(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifyimg: {
    width: dynamicSize(64),
    height: dynamicSize(64),
    resizeMode: 'stretch',
  },
  notifyInfo: {
    flex: 1,
    marginLeft: dynamicSize(15),
  },
  notifyTitle: {
    fontSize: dynamicSize(18),
    color: Colors.black,
  },
  notifyMgs: {
    width: '90%',
    fontSize: dynamicSize(16),
    color: '#6c757d',
  },
  notifyAge: {
    right: 0,
    fontSize: dynamicSize(14),
    color: '#a9a9a9',
    alignSelf: 'flex-end',
  }
});

const mapStateToProps = ({ auth, user, notification }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  notifyitems: notification.notifyitems,
  unreadNotifyCount: notification.unreadcount.count,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchNotification,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationList);