import ChatService from '@app/services/ChatService.js'

export const actions = {
  SET_SENDER_UNIQUE_ID: 'SET_SENDER_UNIQUE_ID',
  SET_RECEIVER_UNIQUE_ID: 'SET_RECEIVER_UNIQUE_ID',
  SET_CHAT_ROOM: 'SET_CHAT_ROOM',
  SET_CHAT_MESSAGES: 'SET_CHAT_MESSAGES',
  SET_CHAT_MESSAGES_MORE: 'SET_CHAT_MESSAGES_MORE',
  SET_NEW_MESSAGE: 'SET_NEW_MESSAGE',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_LOAD_MORE: 'SET_LOAD_MORE',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
};

export const fetchSenderUniqueId = (customerId) => dispatch => {
  return ChatService.getCustomerUniqueId(customerId)
    .then(response => {
      dispatch({
        type: 'SET_SENDER_UNIQUE_ID',
        payload: {
          data: response.data.customerUniqueId,
        }
      })
    })
    .catch(error => {
      console.log(error.response)
      dispatch({
        type: 'SET_SENDER_UNIQUE_ID',
        payload: {
          data: '',
        }
      })
    })
};
export const fetchReceiverUniqueId = (uniqueId) => ({
  type: 'SET_RECEIVER_UNIQUE_ID',
  payload: {
    data: uniqueId,
  }
});
export const fetchUnreadMessageCount = (uniqueId) => dispatch => {
  return ChatService.getUnreadMessageCount(uniqueId)
    .then(response => {
      dispatch({
        type: 'SET_UNREAD_COUNT',
        payload: {
          data: response.data.count,
        }
      })
    })
    .catch(error => {
      dispatch({
        type: 'SET_UNREAD_COUNT',
        payload: {
          data: 0,
        }
      })
      console.log(error.response)
    })
};
export const fetchUserInfo = (uniqueId) => dispatch => {
  return ChatService.getCustomerInfo(uniqueId)
    .then(response => {
      dispatch({
        type: 'SET_USER_INFO',
        payload: {
          data: response.data.data,
        }
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};
export const receiveMessage = (message) => ({
  type: 'SET_NEW_MESSAGE',
  payload: {
    data: message,
  }
});
export const fetchChatMessages = (chatRoom, page) => dispatch => {
  return ChatService.getChatMessages(chatRoom, page)
    .then(response => {
      page < 2 ? dispatch({
        type: 'SET_CHAT_MESSAGES',
        payload: {
          data: response.data.messages,
        }
      }) : dispatch({
        type: 'SET_CHAT_MESSAGES_MORE',
        payload: {
          data: response.data.messages,
        }
      })
      dispatch({
        type: 'SET_LOAD_MORE',
        payload: {
          data: response.data.loadMore,
        }
      })
      return page;
    })
    .catch(error => {
      console.log(error.response)
    })
};
export const markChatMsgAsRead = (chatRoom, receiverUniqueId) => dispatch => {
  return ChatService.markChatMsgAsRead(chatRoom, receiverUniqueId)
    .then(response => {})
    .catch(error => {
      console.log(error.response)
    })
};
export const fetchChatRoom = (senderUniqueId, receiverUniqueId) => dispatch => {
  return ChatService.getChatRoom(senderUniqueId, receiverUniqueId)
    .then(response => {
      if (response.data.status == true) {
        dispatch({
          type: 'SET_CHAT_ROOM',
          payload: {
            data: response.data.roomId,
          }
        })
      } else {
        dispatch({
          type: 'SET_CHAT_ROOM',
          payload: {
            data:  '',
          }
        })
      }
    })
    .catch(error => {
      dispatch({
        type: 'SET_CHAT_ROOM',
        payload: {
          data:  '',
        }
      })
      console.log(error.response)
    })
}

