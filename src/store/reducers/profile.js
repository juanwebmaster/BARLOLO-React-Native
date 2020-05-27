import { produce } from 'immer';
import { actions } from '../actions/profile';

const initialState = {
  mobileCheck: '',
  userProfile: {},
  imageUrl: ''
}

export default function profile(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_USER_PROFILE:
          return produce(state, draft => {
              draft.userProfile = payload.data;
          });
      case actions.SET_IMAGE_URL:
          return produce(state, draft => {
              draft.imageUrl = payload.data;
          });
      case actions.MOBILE_CHECK:
        return produce(state, draft => {
            draft.mobileCheck = payload.data;
        });
      default:
          return state;
  }
}
