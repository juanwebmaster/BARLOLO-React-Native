import ChatService from '@app/services/ChatService.js'

export const actions = {
  SET_SENDER_UNIQUE_ID: 'SET_SENDER_UNIQUE_ID',
  SET_CHATS: 'SET_CHATS',
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
      // dispatch(fetchChats(response.data.customerUniqueId))
    })
    .catch(error => {
      console.log(error.response)
    })
};


export const fetchChats = (senderUniqueId) => dispatch => {
  return ChatService.getChatList(senderUniqueId)
    .then(response => {
      console.log('fetchChats', response)
      let unreadCount = 0;
      if(response.data.list) {
        response.data.list.forEach(element => {
        if (parseInt(element.unread_messages) > 0) {
          unreadCount+=parseInt(element.unread_messages);
        }
      })}
      dispatch({
        type: 'SET_CHATS',
        payload: {
          data: response.data.list ? response.data.list : [], 
          unreadCount,
        }
      })
    })
    .catch(error => {
      console.log(error)
    })
}

