import { produce } from 'immer';
import { actions } from '../actions/location';

const initialState = {
  location: {}
}

export default function location(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_LOCATION:
          return produce(state, draft => {
              draft.location = payload.data;
          });
      default:
          return state;
  }
}