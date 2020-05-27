import { produce } from 'immer';
import { actions } from '../actions/notification';

const initialState = {
  unreadcount: {count: 0},
  notifyitems: []
}

export default function loading(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_NOTIFICATION:
          return produce(state, draft => {
              draft.unreadcount = payload.data.unreadcount;
              draft.notifyitems = payload.data.notifyitems;
          });
      default:
          return state;
  }
}
