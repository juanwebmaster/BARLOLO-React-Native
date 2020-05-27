import { produce } from 'immer';
import { actions } from '../actions/cart';

const initialState = {
  quote: null,
  carts: {},
  cartItems: [],
  order: {},
  recipientInfo: {},
  addToCartItemState: '',
  cupon: {}
}

export default function cart(state = initialState, { type, payload, error, meta }) {
  switch (type) {
      case actions.SET_QUOTE:
          return produce(state, draft => {
              draft.quote = payload.data;
          });
      case actions.ADD_CART:
          return produce(state, draft => {
              draft.carts(payload.data);
          });
      case actions.ADD_CART_LOADING:
        return produce(state, draft => {
            draft.addToCartItemState = '';
        });
      case actions.ADD_CART_SUCCESS:
        return produce(state, draft => {
            draft.addToCartItemState = 'SUCCESS';
        });
      case actions.SET_CART:
        return produce(state, draft => {
          draft.carts = payload.data;
          draft.cartItems = payload.data.items;
        });
      case actions.REMOVE_CART:
        return produce(state, draft => {
          draft.cartItems = state.cartItems.filter(item => item.item_id != payload.data);
        });
      case actions.CLEAR_CART:
        return produce(state, draft => {
          draft.carts = {};
          draft.cartItems = [];
        });
      case actions.SET_ORDER:
        return produce(state, draft => {
          draft.order = payload.data;
        });
      case actions.SET_RECIPIENT_INFO:
        return produce(state, draft => {
          draft.recipientInfo = payload.data;
        });
      case actions.SET_CUPON_CODE:
        return produce(state, draft => {
          draft.cupon = payload.data;
        });
      default:
        return state;
  }
}
