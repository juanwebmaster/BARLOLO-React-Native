import { produce } from 'immer';
import { actions } from '../actions/loading';

const initialState = {
  loadingStatus: false,
  hideHeader: false,
  hideSearchBar: false,
  title: '',
  redirectLink: null,
}

export default function loading(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_LOADING_STATUS:
          return produce(state, draft => {
              draft.loadingStatus = payload.data;
          });
      case actions.TOGGLE_HEADER:
          return produce(state, draft => {
              draft.hideHeader = payload.data;
          });
      case actions.HIDE_SEARCH_BAR:
        return produce(state, draft => {
            draft.hideSearchBar = payload.data;
        });
      case actions.SET_TITLE:
        return produce(state, draft => {
            draft.title = payload.data;
        });
      case actions.SET_REDIRECT_LINK:
        return produce(state, draft => {
            draft.redirectLink = payload.data;
        });
      default:
          return state;
  }
}
