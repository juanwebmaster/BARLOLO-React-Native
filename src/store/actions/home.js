import ApiService from '@app/services/ApiService.js'
import CartService from '@app/services/CartService.js'

export const actions = {
  SET_BANNER_IMAGES: 'SET_BANNER_IMAGES',
  SET_CART: 'SET_CART',
  SET_SELLER_BADGES: 'SET_SELLER_BADGES',
  SET_RECOMMENDED_STORES: 'SET_RECOMMENDED_STORES',
  SET_HEADER_CATEGORIES: 'SET_HEADER_CATEGORIES',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_HOTLISTS: 'SET_HOTLISTS',
  SET_SALE_PRODUCT: 'SET_SALE_PRODUCT',
  SET_SALE_PRODUCT_MORE: 'SET_SALE_PRODUCT_MORE',
  SET_NEWPRODUCTS: 'SET_NEWPRODUCTS',
  SET_NEWPRODUCTS_MORE: 'SET_NEWPRODUCTS_MORE',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
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
export const fetchHomeBanners = (bannerImages) => dispatch => {
  if (!bannerImages.length) {
    return ApiService.getHomeBanner()
      .then(response => {
        dispatch({
          type: 'SET_BANNER_IMAGES',
          payload: {
              data: response.data,
          },
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
};

export const fetchSellerBadges = (myStoreId, sellerBadges) => dispatch => {
  if (!sellerBadges.length) {
    return ApiService.getSellerBadges(myStoreId)
      .then(response => {
        dispatch({
          type: 'SET_SELLER_BADGES',
          payload: {
              data: response.data,
          },
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
};

export const fetchRecommendedStores = (lang, recommendedStores) => dispatch => {
  if (!recommendedStores.length) {
    return ApiService.getRecommendedStores(lang)
      .then(response => {
        dispatch({
          type: 'SET_RECOMMENDED_STORES',
          payload: {
              data: response.data,
          },
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
};
export const fetchHeaderCategories = (storeid, headerCategories) => dispatch => {
  if (!Object.keys(headerCategories).length) {
    return ApiService.getHeaderCategories(storeid)
    .then(response => {
      dispatch({
        type: 'SET_HEADER_CATEGORIES',
        payload: {
            data: response.data ? response.data : [],
        },
      });
    })
  }
};

export const fetchCategories = (lang, categories) => dispatch => {
  if (!Object.keys(categories).length) {
    return ApiService.getCategories(lang)
      .then(response => {
        dispatch({
          type: 'SET_CATEGORIES',
          payload: {
              data: response.data,
          },
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
};

export const fetchHotlists = (storeId, hotlists) => dispatch => {
  if (!hotlists.length) {
    return ApiService.getHotLists(storeId)
      .then(response => {
        dispatch({
          type: 'SET_HOTLISTS',
          payload: {
              data: response.data,
          },
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
};
export const fetchSaleProductLists = ({ storeId, customerId, pageSize, pageNo }) => dispatch => {
  return ApiService.getSaleProductLists(storeId, customerId, pageSize, pageNo)
    .then(response => {
      dispatch({
        type: pageNo < 2 ? 'SET_SALE_PRODUCT' : 'SET_SALE_PRODUCT_MORE',
        payload: {
            data: response.data,
            pageNo, 
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchProducts = ({ storeId, customerId, pageSize, pageNo, cancelSource }) => dispatch => {
  return ApiService.getRecentProducts(
    storeId,
    customerId,
    pageSize,
    pageNo,
    cancelSource
  )
    .then(response => {
      dispatch({
        type: pageNo < 2 ? 'SET_NEWPRODUCTS' : 'SET_NEWPRODUCTS_MORE',
        payload: {
            data: response.data,
            pageNo,
        },
      });
      return pageNo
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchSearchResults = ({ keyWord, onlyproduct, categoryId, cancelSource }) => dispatch => {
  dispatch({
    type: 'SET_SEARCH_RESULTS',
    payload: {
        data: {},
    },
  });
  return new Promise((resolve, reject) => {
    ApiService.getSearchResults(
      keyWord,
      onlyproduct,
      categoryId,
      cancelSource
    )
      .then(response => {
        dispatch({
          type: 'SET_SEARCH_RESULTS',
          payload: {
              data: response.data,
          },
        });
        resolve(response);
      })
      .catch(error => {
        if (error.message === 'Start new search, stop active search') {
          // this.$store.dispatch('loading/updateLoadingStatus', true)
        }
        reject(error);
      })
  })
};
export const clearSearchResults = () => ({
  type: 'SET_SEARCH_RESULTS',
  payload: {
    data: {}
  }
})
