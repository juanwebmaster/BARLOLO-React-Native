import { produce } from 'immer';
import { actions } from '../actions/hotlist';

const initialState = {
  hotlists: [],
  products: []
}

export default function hotlists(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_HOTLISTS:
          return produce(state, draft => {
              draft.hotlists = payload.data;
          });
      case actions.SET_PRODUCTS:
          return produce(state, draft => {
              draft.products = payload.data;
          });
      default:
          return state;
  }
}
