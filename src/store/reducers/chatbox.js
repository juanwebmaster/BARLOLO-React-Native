import { produce } from 'immer';
import { actions } from '../actions/chatbox';

const initialState = {
  senderUniqueId: '',
  receiverUniqueId: '',
  chatRoom: '',
  chatMessages: [],
  userInfo: {},
  loadMore: false,
  unreadCount: 0,
}

export default function chatbox(state = initialState, { type, payload, error, meta }) {
  switch (type) {
    case actions.SET_SENDER_UNIQUE_ID:
      return produce(state, draft => {
          draft.senderUniqueId = payload.data;
          draft.chatMessages = [];
      });
    case actions.SET_RECEIVER_UNIQUE_ID:
      return produce(state, draft => {
          draft.receiverUniqueId = payload.data;
      });
    case actions.SET_CHAT_ROOM:
      return produce(state, draft => {
          draft.chatRoom = payload.data;
      });
    case actions.SET_CHAT_MESSAGES:
      return produce(state, draft => {
          draft.chatMessages = payload.data;
      });
    case actions.SET_CHAT_MESSAGES_MORE:
      return produce(state, draft => {
          draft.chatMessages = [...payload.data, ...state.chatMessages];
      });
    case actions.SET_NEW_MESSAGE:
      return produce(state, draft => {
          draft.chatMessages = [...state.chatMessages, payload.data];
      });
    case actions.SET_USER_INFO:
      return produce(state, draft => {
          draft.userInfo = payload.data;
      });
    case actions.SET_LOAD_MORE:
      return produce(state, draft => {
          draft.loadMore = payload.data;
      });
    case actions.SET_UNREAD_COUNT:
      return produce(state, draft => {
          draft.unreadCount = payload.data;
      });
    default:
        return state;
  }
}
