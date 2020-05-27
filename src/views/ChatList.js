import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {fetchSenderUniqueId, fetchChats} from '../store/actions/chat';

import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';

class ChatList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      // if (action.type === 'Navigation/BACK') {
      //   return;
      // }
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
          this.props.fetchSenderUniqueId(this.props.user.id)
          .then(() => {
            this.props.fetchChats(this.props.senderUniqueId)
            .then(() => {
              this.setState({isLoading: false});
            })
            .catch(() => {
              this.setState({isLoading: false});
            })
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

  _renderItem = ({item, index}) => {
    const {senderUniqueId, navigation} = this.props;
    const unread_messages = parseInt(item.unread_messages);
    return (
      <TouchableOpacity
        key={index}
        style={styles.listItem}
        onPress={() => {
          navigation.navigate('ChatBox', {
            uniqueId: senderUniqueId == item.sender_unique_id ? item.receiver_unique_id : item.sender_unique_id,
          })
        }}
      >
        <View style={styles.avatar}>
          <FontAwesomeIcon name='user' size={dynamicSize(20)} color='gray' />
        </View>
        <View style={styles.info}>
          <View style={styles.chatInfo}>
            <Text style={[styles.name, unread_messages > 0 && {color: Colors.red}]}>{senderUniqueId == item.sender_unique_id ? item.receiver_name ? item.receiver_name : item.receiver_unique_id : item.sender_name}</Text>
            <Text style={[styles.msg, unread_messages > 0 && {color: Colors.red}]}>{item.last_message}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.date}>{item.msgTime}</Text>
            {unread_messages > 0 &&
            <View style={styles.unreadView}>
              <Text style={styles.unread}>{unread_messages}</Text>
            </View>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _renderEmpty = () => {
    return (
      <View style={{marginTop: 20}}>
        <Text style={{alignSelf: 'center'}}>No active chat</Text>
      </View>
    );
  }
  
  render() {
    const {isLoading} = this.state;
    const {navigation, unreadCount} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader navigation={navigation} title={i18n.t('Chat')+`(${unreadCount})`} />
          <FlatList
            key={'Products'}
            style={styles.list}
            data={this.props.chats}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
            keyExtractor={(item, index) => 'chatlist'+index}
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
  },
  list: {
    flex: 1,
    paddingHorizontal: '5%',
  },
  listItem: {
    marginTop: dynamicSize(20),
    width: '100%',
    flexDirection: 'row',
  },
  avatar: {
    width: dynamicSize(36),
    height: dynamicSize(36),
    borderRadius: dynamicSize(18),
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginTop: dynamicSize(5),
    marginLeft: dynamicSize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatInfo: {
    width: '70%',
  },
  name: {
    fontSize: dynamicSize(14),
    color: '#a1a1a1',
  },
  msg: {
    fontSize: dynamicSize(14),
    color: Colors.gray,
  },
  date: {
    fontSize: dynamicSize(15),
    color: Colors.gray,
  },
  unreadView: {
    width: dynamicSize(20),
    height: dynamicSize(20),
    borderRadius: dynamicSize(10),
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  unread: {
    fontSize: dynamicSize(12),
    color: 'white',
  }
});

const mapStateToProps = ({ auth, user, chat }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  senderUniqueId: chat.senderUniqueId,
  chats: chat.chats,
  unreadCount: chat.unreadCount,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchSenderUniqueId,
  fetchChats,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatList);