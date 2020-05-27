import { produce } from 'immer';
import { actions } from '../actions/chat';

const initialState = {
  senderUniqueId: '',
  chats: [], 
  unreadCount: 0,
}

export default function chat(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_SENDER_UNIQUE_ID:
          return produce(state, draft => {
              draft.senderUniqueId = payload.data;
          });
      case actions.SET_CHATS:
          return produce(state, draft => {
              draft.chats = payload.data;
              draft.unreadCount = payload.unreadCount;
          });
      default:
          return state;
  }
}
