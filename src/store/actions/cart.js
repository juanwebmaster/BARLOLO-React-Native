import CartService from '@app/services/CartService.js'
import {fetchAdminToken} from './auth';

export const actions = {
  SET_QUOTE: 'SET_QUOTE',
  ADD_CART: 'ADD_CART',
  ADD_CART_LOADING: 'ADD_CART_LOADING',
  ADD_CART_SUCCESS: 'ADD_CART_SUCCESS',
  SET_CART: 'SET_CART',
  REMOVE_CART: 'REMOVE_CART',
  CLEAR_CART: 'CLEAR_CART',
  SET_ORDER: 'SET_ORDER',
  SET_RECIPIENT_INFO: 'SET_RECIPIENT_INFO',
  SET_CUPON_CODE: 'SET_CUPON_CODE',
};

export const fetchQuote = () => dispatch => {
  return CartService.getQuote()
    .then(response => {
      dispatch({
        type: 'SET_QUOTE',
        payload: {
            data: response.data,
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const addToCartItem = (data) => dispatch => {
  dispatch({
    type: 'ADD_CART_LOADING',
    payload: {
    },
  });
  return CartService.getQuote()
    .then(({ data: quote_id }) => {
      dispatch({
        type: 'SET_QUOTE',
        payload: {
            data: quote_id,
        },
      });
      return CartService.createCart({ ...data, quote_id })
        .then(response => {
          //commit('ADD_CART_SUCCESS')
          return response.data
        })
        .catch(error => {
          return error.response
        })
    })
    .catch(error => {
      return error.response
      console.log(error.response)
    })
};

export const createCart = (data) => dispatch => {
  console.log(data)
  return CartService.createCart(data)
    .then(response => {
      // commit('ADD_CART', response.data)
      return response.data
    })
    .catch(error => {
      console.log(error.response)
      throw error
    })
};

export const fetchCarts = (customerId) => dispatch => {
  return CartService.getCarts(customerId)
    .then(response => {
      dispatch({
        type: 'SET_CART',
        payload: {
            data: response.data,
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const deleteItem = ({ quoteId, itemId }) => dispatch => {
  dispatch(fetchAdminToken())

  return CartService.removeCart(quoteId, itemId)
    .then(() => {
      dispatch({
        type: 'REMOVE_CART',
        payload: {
            data: itemId,
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const clearCart = (customerId) => dispatch => {
  dispatch(fetchAdminToken())

  return CartService.clearCart(customerId)
    .then(() => {
      dispatch({
        type: 'CLEAR_CART',
        payload: {
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const createOrder = ({ data, recipientInfo }) => dispatch => {
  return CartService.postOrder(1, data)
    .then(response => {
      console.log(recipientInfo)
      if (response.data.success == true) {
        dispatch({
          type: 'SET_ORDER',
          payload: {
              data: response.data,
          },
        });
        dispatch({
          type: 'SET_RECIPIENT_INFO',
          payload: {
              data: recipientInfo,
          },
        });
      }
    })
    .catch(error => {
      console.log(error.message)
    })
};

export const updateCuponCode = (data) => ({
  type: 'SET_CUPON_CODE',
  payload: {
      data: data,
  },
});

