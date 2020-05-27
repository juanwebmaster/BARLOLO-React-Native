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
import {fetchFollowers} from '../store/actions/merchant';

import ChatService from '../services/ChatService';

import NavHeader from '../components/NavHeader';
import FallbackImage from '../components/FallbackImage';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class FollowerList extends React.Component {
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
    this.props.fetchFollowers([], {
      storeId: 1,
      sellerId: this.props.user.id
    })
    .then(() => {
      this.setState({refreshing: false});
    })
    .catch(error => {
      console.log(error.message);
      this.setState({refreshing: false});
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

  _renderHeader = (followersCount) => {
    return (
      <View style={styles.titleBar}>
        <Text style={styles.title}>Followers ({ followersCount })</Text>
      </View>
    );
  }

  _renderItem = ({item, index}) => {
    return (
        <View style={styles.renderItem}>
          <TouchableOpacity style={styles.userImg} onPress={() => this.onClickChatWith(item.customer_Id)}>
            {item.customer_image ?
            <Image style={styles.image} source={{uri: item.customer_image}} />:
            <FontAwesomeIcon name='user' size={dynamicSize(40)}/>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.userInfo} onPress={() => this.onClickChatWith(item.customer_Id)}>
            <Text style={styles.name}>{ item.customer_name }</Text>
            <View style={styles.location}>
              <Icon name='map-marker' size={dynamicSize(13)} color='#A1A1A1'/>
              <Text style={styles.label}>{ item.location }</Text>
            </View>
          </TouchableOpacity>
        </View>
    );
  }

  render() {
    const {navigation, followers, followersCount} = this.props;
    const {isLoading, refreshing} = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={'Followers'} />
          <FlatList
            contentContainerStyle={styles.contentStyle}
            data={followers}
            ListHeaderComponent={this._renderHeader(followersCount)}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item.customer_Id}
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
    padding: 5,
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
  }
});

const mapStateToProps = ({ auth, user, merchant }) => ({
  isLogged: auth.isLogged,
  user: auth.user,
  lang: user.lang,
  followers: merchant.followers,
  followersCount: merchant.followersCount,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchFollowers,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FollowerList);