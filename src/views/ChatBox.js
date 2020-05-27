import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import socketio from 'socket.io-client';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EmojiBoard from 'react-native-emoji-board'

import {checkAuth, fetchAdminToken} from '../store/actions/auth';
import {setRedirectLink} from '../store/actions/loading';
import {
  fetchUserInfo,
  fetchSenderUniqueId,
  fetchReceiverUniqueId,
  fetchChatRoom,
  fetchChatMessages,
  markChatMsgAsRead,
  receiveMessage,
} from '../store/actions/chatbox';

import NavHeader from '../components/NavHeader';
import LoadingComponent from '../components/LoadingComponent';

import i18n from "@app/locale/i18n";
import Colors from '@app/config/colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT, dynamicSize} from '../config';
import config from '../config/config';

const chatUrl = config.get('APP_CHAT_API_ENDPOINT');

const IconType = {
  material: 'material',
  fontAwesome: 'fontAwesome'
};

const EmojiCategories = [
  {
      name: 'Smileys & Emotion',
      iconType: IconType.material,
      icon: 'sticker-emoji'
  },
  {
      name: 'Animals & Nature',
      iconType: IconType.material,
      icon: 'dog'
  },
  {
      name: 'Food & Drink',
      iconType: IconType.material,
      icon: 'food'
  },
  {
      name: 'Activities',
      iconType: IconType.material,
      icon: 'soccer'
  },
  {
      name: 'Travel & Places',
      iconType: IconType.material,
      icon: 'train-car'
  },
  {
      name: 'Objects',
      iconType: IconType.material,
      icon: 'lightbulb-outline'
  },
  {
      name: 'Symbols',
      iconType: IconType.material,
      icon: 'music-note'
  }
];

class ChatBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEmojiBoard: false,
      unreadCount: 0,
      isLoading: false,
      refreshing: true,
      message: '',
      page: 1,
    };

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', ({state, action}) => {
      if (action.type === 'Navigation/BACK') {
        return;
      }

      const {routeName, params} = state;
      if(!params || !params.uniqueId) {
        navigation.goBack();
        return;
      }

      this.setState({
        showEmojiBoard: false,
        unreadCount: 0,
        isLoading: true,
        refreshing: true,
        page: 1,
      });
      
      Promise.all([
        this.props.checkAuth(),
        this.props.fetchAdminToken(),
        params.uniqueId && this.props.fetchUserInfo(params.uniqueId),
        params.uniqueId && this.props.fetchReceiverUniqueId(params.uniqueId),
      ]).then(() => {
        if (!this.props.isLogged) {
          this.setState({isLoading: false});
          this.props.setRedirectLink(routeName);
          navigation.goBack();
          navigation.navigate('Login');
        } else {
          this.props.fetchSenderUniqueId(this.props.user.id)
          .then(() => {
            this.props.fetchChatRoom(this.props.senderUniqueId, this.props.receiverUniqueId)
            .then(() => {
              Promise.all([
                this.props.fetchChatMessages(this.props.chatRoom, 1),
                this.props.markChatMsgAsRead(this.props.chatRoom, this.props.receiverUniqueId),
              ])
              .then(() => {
                let uniqueUser = this.props.chatRoom + '_' + this.props.senderUniqueId;
                this.socket.emit('room', this.props.chatRoom);
                this.socket.emit('connectUser', uniqueUser);
                setTimeout(() => {
                  if(this.listRef)this.listRef.scrollToEnd();        
                }, 200);
                this.setState({isLoading: false, refreshing: false});
              })
            })
            .catch(() => {
              this.setState({isLoading: false, refreshing: false});
            })
          })
          .catch(() => {
            this.setState({isLoading: false, refreshing: false});
          })
        }
      })
      .catch(error => {
        this.setState({isLoading: false});
        navigation.goBack();
      })
    });

    this.blurListener = navigation.addListener('didBlur', ({state, action}) => {
      let uniqueUser = this.props.chatRoom + '_' + this.props.senderUniqueId;
      this.socket.emit('disconnectUser', uniqueUser);
    });
  }

  componentDidMount() {
    this.socket = new socketio(chatUrl);
    this.socket.on('connect', function(){console.log('connect')});
    this.socket.on('disconnect', function(){console.log('disconnect')});
    this.socket.on('sendMessage', this.receiveMessage.bind(this));
  }

  receiveMessage = (data) => {
    console.log('sendMessage data ==> ', data);
    if(this.props.chatRoom === data.room_id) {
      this.props.receiveMessage(data);
      setTimeout(() => {
        if(this.listRef)this.listRef.scrollToEnd();        
      }, 200);
    }
  }

  componentWillUnmount() {
    // Remove the event listener
    delete this.socket;
    this.focusListener.remove();
    this.blurListener.remove();
  }

  insertEmoji = emoji => {
    const {message} = this.state;
    this.setState({showEmojiBoard: false, message: message + emoji?.code});
  };

  onRemove = () => {
    this.setState({showEmojiBoard: false});
  };

  sendMessage = () => {
    const {message} = this.state;
    if (!message) {
      return;
    }

    const {chatRoom, senderUniqueId, receiverUniqueId} = this.props;
    if (!chatRoom) {
      console.error("Chat room is not initiated");
      return;
    }

    //my message code start

    this.socket.emit('chatMessage',{
      senderUniqueId,
      receiverUniqueId,
      message,
      room : chatRoom
    });

    this.props.receiveMessage({
      room_id: chatRoom,
      user_id: senderUniqueId,
      message: message,
      msgDate: moment().format('YYYY-MM-DD'),
      msgTime: moment().format('LT'),
    })
    setTimeout(() => {
      if(this.listRef)this.listRef.scrollToEnd();        
    }, 200);
    this.setState({message: ''});
  }

  _handleLoadMore = () => {
    if(this.state.refreshing) return;
    this.setState({refreshing: true});
    const { page, fetchSMS, hasMore, id } = this.state;
    this.props.fetchChatMessages(this.props.chatRoom, page+1)
    .then(res => {
      this.setState({page: res, refreshing: false});
    })
    .catch(e => {
      this.setState({refreshing: false});
    })
  };

  _renderItem = ({item, index}) => {
    const {senderUniqueId, receiverUniqueId} = this.props;
    const {user_id, message, msgDate, msgTime} = item;
    const prevItem = this.props.chatMessages[index-1];
    const showAvatar = !(prevItem && prevItem.user_id == user_id)
    return (user_id == senderUniqueId ?
      <TouchableOpacity key={index} style={styles.listItemRight}>
        <View style={styles.infoRight}>
          <View style={styles.chatInfo}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Text style={styles.date}>{msgDate} {msgTime}</Text>
        </View>
        {showAvatar ? <View style={styles.caret}>
          <FontAwesomeIcon style={{top: 5}} name='caret-right' size={dynamicSize(20)} color='#eaeaea' />
          <View style={styles.avatar}>
            <FontAwesomeIcon name='user' size={dynamicSize(20)} color='gray' />
          </View>
        </View> : <View style={styles.caret} />}
      </TouchableOpacity> :
      <TouchableOpacity key={index} style={styles.listItemLeft}>
        {showAvatar ? <View style={styles.caret}>
          <View style={styles.avatar}>
            <FontAwesomeIcon name='user' size={dynamicSize(20)} color='gray' />
          </View>
          <FontAwesomeIcon style={{top: 5}} name='caret-left' size={dynamicSize(20)} color='#F99795' />
        </View> : <View style={styles.caret} />}
        <View style={styles.infoLeft}>
          <View style={[styles.chatInfo, {backgroundColor: '#F99795'}]}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Text style={styles.date}>{msgDate} {msgTime}</Text>
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
    const {unreadCount, isLoading, message, showEmojiBoard, refreshing} = this.state;
    const {navigation, chatMessages, userInfo} = this.props;
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <NavHeader
            navigation={navigation}
            title={userInfo?`${userInfo.firstname} ${userInfo.middlename?userInfo.middlename:''} ${userInfo.lastname?userInfo.lastname:''}`: "SUPPORT"}
          />
          <KeyboardAvoidingView
            style={styles.list}
            behavior="padding"
            enabled = {Platform.OS === 'ios' ? true : false}
          >
            <FlatList
              ref={ref => {
                this.listRef = ref;
              }}
              key={'Chats'}
              contentContainerStyle={styles.listContainer}
              data={chatMessages}
              renderItem={this._renderItem}
              ListEmptyComponent={this._renderEmpty}
              ListFooterComponent={<View style={{height: 100}}></View>}
              keyExtractor={(item, index) => item.entity_id ? item.entity_id.toString() : 'Chats'+index}
              onRefresh={this._handleLoadMore}
              refreshing={refreshing}
              nestedScrollEnabled={true}
              removeClippedSubviews={true}
              contentInsetAdjustmentBehavior="automatic"
            />
            <View style={styles.inputBox}>
              <TouchableOpacity style={styles.cnticon} onPress={() => this.setState({showEmojiBoard: true})}>
                <EntypoIcon name='emoji-happy' size={dynamicSize(24)} color={Colors.red} />
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={''}
                  placeholderTextColor={Colors.placeholder}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({ message: text })}
                  value={message}
                  multiline={true}
                  underlineColorAndroid="transparent"
                />
              </View>
              <TouchableOpacity style={styles.cnticon} onPress={() => {}}>
                <FontAwesomeIcon name='plus-circle' size={dynamicSize(24)} color={Colors.red} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cnticon} onPress={() => {}}>
                <FontAwesomeIcon name='camera' size={dynamicSize(24)} color={Colors.red} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sendBtn]} onPress={this.sendMessage}>
                <FontAwesomeIcon name='location-arrow' size={dynamicSize(30)} color='white' />
              </TouchableOpacity>
            </View>
            <EmojiBoard
              showBoard={showEmojiBoard}
              onClick={this.insertEmoji}
              onRemove={this.onRemove}
              emojiSize={dynamicSize(22)}
              categories={EmojiCategories}
            />
          </KeyboardAvoidingView>
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
  },
  listContainer:{
    paddingHorizontal: '5%',
    justifyContent: 'flex-end',
  },
  listItemRight: {
    marginTop: dynamicSize(25),
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  infoRight: {
    alignItems: 'flex-end',
  },
  listItemLeft: {
    marginTop: dynamicSize(25),
    width: '80%',
    flexDirection: 'row',
  },
  infoLeft: {
    alignItems: 'flex-start',
  },
  chatInfo: {
    paddingVertical: dynamicSize(5),
    paddingHorizontal: dynamicSize(20),
    borderRadius: dynamicSize(10),
    backgroundColor: '#eaeaea',
  },
  message: {
    fontSize: dynamicSize(14),
    color: '#212529',
  },
  date:{
    marginTop: dynamicSize(10),
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  caret: {
    width: dynamicSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    width: dynamicSize(36),
    height: dynamicSize(36),
    borderRadius: dynamicSize(18),
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    padding: dynamicSize(10),
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    paddingVertical: dynamicSize(3),
    paddingHorizontal: dynamicSize(15),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: dynamicSize(20),
  },
  textInput: {
    fontSize: dynamicSize(13),
    color: Colors.black,
  },
  cnticon: {
    marginVertical: dynamicSize(20),
    marginHorizontal: dynamicSize(5),
  },
  sendBtn: {
    marginVertical: dynamicSize(5),
    width: dynamicSize(50),
    height: dynamicSize(50),
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const mapStateToProps = ({ auth, user, chatbox }) => ({
  isLogged: auth.isLogged,
  lang: user.lang,
  user: auth.user,
  chatMessages: chatbox.chatMessages,
  senderUniqueId: chatbox.senderUniqueId,
  receiverUniqueId: chatbox.receiverUniqueId,
  chatRoom: chatbox.chatRoom,
  userInfo: chatbox.userInfo,
  loadMore:chatbox.loadMore,
});

const mapDispatchToProps = {
  checkAuth,
  fetchAdminToken,
  setRedirectLink,
  fetchUserInfo,
  fetchSenderUniqueId,
  fetchReceiverUniqueId,
  fetchChatRoom,
  fetchChatMessages,
  markChatMsgAsRead,
  receiveMessage,
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatBox);