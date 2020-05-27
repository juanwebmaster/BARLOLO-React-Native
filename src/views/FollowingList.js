import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {fetchFollowings, postUnfollow} from '../store/actions/merchant';

import ChatService from '../services/ChatService';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class FollowingList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      refreshing: false,
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
        this.setState({isLoading: false});

        const {routeName, params} = state;
        if (params && params.requiresAuth && !this.props.isLogged) {
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
          return;
        }
        this.handleRefresh();
      })
      .catch(error => {
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  handleRefresh = () => {
    this.setState({refreshing: true});
    this.props.fetchFollowings([], {
      storeId: 1,
      customerId: this.props.user.id
    })
    .then(() => {
      this.setState({refreshing: false});
    })
    .catch(error => {
      console.log(error.message);
      this.setState({refreshing: false});
    })
  }

  unfollow = (following) => {
    this.setState({isLoading: true});
    this.props.postUnfollow({
      entityId: following.entity_id,
      customerId: this.props.user.id,
      sellerId: following.seller_id
    })
    .then(() => {
      this.setState({isLoading: false});
    })
    .catch(() => {
      this.setState({isLoading: false});
    })
  }

  onClickChatWith = (id) => {
    this.setState({isLoading: true});
    ChatService.getCustomerUniqueId(id)
    .then(response => {
      this.setState({isLoading: false});
      const uniqueId = response.data.customerUniqueId;
      this.props.navigation.navigate('ChatBox', {uniqueId});
    })
    .catch(error => {
      console.log(error.response)
      this.setState({isLoading: false});
    })
  }

  _renderHeader = (followingsCount) => {
    return (
      <View style={styles.titleBar}>
        <Text style={styles.title}>Followings ({ followingsCount })</Text>
      </View>
    );
  }

  _renderItem = ({item, index}) => {
    return (
        <View style={styles.renderItem}>
          <TouchableOpacity style={styles.userImg} onPress={() => this.onClickChatWith(item.seller_id)}>
            {item.logo_pic ?
            <Image style={styles.image} source={{uri: item.logo_pic}} />:
            <FontAwesomeIcon name='user' size={dynamicSize(40)}/>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.userInfo} onPress={() => this.onClickChatWith(item.seller_id)}>
            <Text style={styles.name}>{ item.shop_title }</Text>
            <View style={styles.location}>
              <Icon name='map-marker' size={dynamicSize(13)} color='#A1A1A1'/>
              <Text style={styles.label}>{ item.city }</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.unfollow(item)}>
            <Text style={styles.buttonLabel}><Text style={styles.symbol}>-</Text>  {'Unfollow'}</Text>
          </TouchableOpacity>
        </View>
    );
  }

  render() {
    const {navigation, followings, followingsCount} = this.props;
    const {isLoading, refreshing} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={'Followings'} />
          <FlatList
            contentContainerStyle={styles.contentStyle}
            data={followings}
            ListHeaderComponent={this._renderHeader(followingsCount)}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item.seller_id}
            refreshing={refreshing}
            // onRefresh={this.handleRefresh}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
          />
          <LoadingComponent visible={isLoading}/>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2',
  },
  contentStyle: {
    marginTop: dynamicSize(10),
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  titleBar: {
    width: SCREEN_WIDTH - dynamicSize(20),
    paddingVertical: dynamicSize(10),
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: dynamicSize(13),
    color: Colors.red,
  },
  renderItem: {
    width: SCREEN_WIDTH - dynamicSize(40),
    padding: dynamicSize(10),
    flexDirection: 'row',
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
  },
  userImg: {
    width: dynamicSize(45),
    height: dynamicSize(45),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginLeft: dynamicSize(15),
    padding: dynamicSize(15),
    width: '50%',
    borderRadius: dynamicSize(10),
    backgroundColor: '#D7D7D7',
  },
  name: {
    fontSize: dynamicSize(12),
    fontWeight: 'bold',
    color: '#A1A1A1'
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dynamicSize(5),
  },
  label: {
    marginLeft: dynamicSize(5),
    fontSize: dynamicSize(13),
    color: '#A1A1A1',
  },
  button: {
    flex: 1,
    marginLeft: dynamicSize(10),
    padding: dynamicSize(5),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.red,
  },
  buttonLabel: {
    fontSize: dynamicSize(14),
    color: 'white',
    textAlign: 'center',
  },
  symbol: {
    fontSize: dynamicSize(20),
    fontWeight: 'bold',
  }
});

const mapStateToProps = ({ auth, user, merchant }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  followings: merchant.followings,
  followingsCount: merchant.followingsCount,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchFollowings,
  postUnfollow,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowingList);