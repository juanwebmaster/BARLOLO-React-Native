import ApiService from '@app/services/ApiService.js'

export const actions = {
  SET_HOTLISTS: 'Hotlist/SET_HOTLISTS',
  SET_PRODUCTS: 'Hotlist/SET_PRODUCTS',
};

export const fetchHotlists = (storeId) => dispatch => {
  return ApiService.getHotLists(storeId)
    .then(response => {
      dispatch({
        type: actions.SET_HOTLISTS,
        payload: {
          data: response.data,
        },
      });
    })
    .catch(error => {
      console.log(error)
    })
}

export const fetchProducts = () => dispatch => {
  return ApiService.getRecentProducts()
    .then(response => {
      dispatch({
        type: actions.SET_PRODUCTS,
        payload: {
          data: response.data,
        },
      });
    })
    .catch(error => {
      console.log(error)
    })
}
