import { combineReducers } from 'redux';

import loading from './loading';
import home from './home';
import product from './product';
import chat from './chat';
import chatbox from './chatbox';
import auth from './auth';
import user from './user';
import merchant from './merchant';
import notification from './notification';
import cart from './cart';
import category from './category';
import shop from './shop';
import hotlist from './hotlist';
import profile from './profile';
import location from './location';

// import { actions } from '@app/store/actions/login';

const appReducer = combineReducers({
  auth,
  user,
  loading,
  home,
  product,
  cart,
  chat,
  chatbox,
  notification,
  merchant,
  category,
  shop,
  hotlist,
  profile,
  location,
});

const rootReducer = (state, action) => {
  // if (action.type === actions.USER_LOGOUT) {
  //   state = undefined;
  // }

  return appReducer(state, action);
};

export default rootReducer;
