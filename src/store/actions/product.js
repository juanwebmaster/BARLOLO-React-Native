import ProductService from '@app/services/ProductService.js'
import CartService from '@app/services/CartService.js'

export const actions = {
  SET_PRODUCT: 'SET_PRODUCT',
  SET_CART: 'SET_CART',
  SET_SKU_PRODUCT: 'SET_SKU_PRODUCT',
  SET_SKU_OF_PRODUCT: 'SET_SKU_OF_PRODUCT',
  EDIT_S: 'EDIT_S',
  SET_MERCHANT_PRODUCTS: 'SET_MERCHANT_PRODUCTS',
  SET_MERCHANT_PRODUCTS_SIMILER: 'SET_MERCHANT_PRODUCTS_SIMILER',
  SET_WISHLISTS_PRODUCT_ID: 'SET_WISHLISTS_PRODUCT_ID',
  SET_WISHLIST_PRODUCTS: 'SET_WISHLIST_PRODUCTS',
  SET_PRODUCT_ERROR: 'SET_PRODUCT_ERROR',
  RESET_PRODUCT_ERROR: 'RESET_PRODUCT_ERROR',
  SET_PRODUCT_COMMENT: 'SET_PRODUCT_COMMENT',
  SET_PRODUCT_RATING: 'SET_PRODUCT_RATING',
  SHOW_PRODUCT_COMMENT: 'SHOW_PRODUCT_COMMENT',
  ADD_PRODUCT_IMGS: 'ADD_PRODUCT_IMGS',
  ADD_PRODUCT_IMG: 'ADD_PRODUCT_IMG',
  SET_CAT_VARIATION: 'SET_CAT_VARIATION',
  ADD_PRODUCT: 'ADD_PRODUCT',
  SET_EDIT_SELLER_PRODUCT: 'SET_EDIT_SELLER_PRODUCT',
  SET_SELLER_UNIQUE_ID: 'SET_SELLER_UNIQUE_ID',
}

export const resetProductError = () => ({
  type: 'RESET_PRODUCT_ERROR',
  payload: {},
});
export const fetchCarts = (customerId) => dispatch => {
  return CartService.getCarts(customerId)
    .then(response => {
      dispatch({
        type: 'SET_CART',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchProduct = ({ storeId, productId, loginId }) => dispatch => {
  return ProductService.getProduct(storeId, productId, loginId)
    .then(response => {
      dispatch({
        type: 'SET_PRODUCT',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchProductWithSku = ({ sku, storeId }) => dispatch => {
  return ProductService.getProductWithSku(sku, storeId)
    .then(response => {
      dispatch({
        type: 'SET_SKU_PRODUCT',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response.status)
      if (error.response.status === 404) {
        dispatch({
          type: 'SET_PRODUCT_ERROR',
          payload: {
            data: `Product not found for Sku - ${sku}!`
          },
        })
      } else {
        dispatch({
          type: 'SET_PRODUCT_ERROR',
          payload: {
            data: 'something went wrong.'
          },
        })
      }
    })
};

export const fetchSkuOfProduct = ({ sku }) => dispatch => {
  return ProductService.getSkuOfProduct(sku)
    .then(response => {
      dispatch({
        type: 'SET_SKU_OF_PRODUCT',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response.status)
      if (error.response.status === 404) {
        dispatch({
          type: 'SET_PRODUCT_ERROR',
          payload: {
            data: `Product not found for Sku - ${sku}!`
          },
        })
      } else {
        dispatch({
          type: 'SET_PRODUCT_ERROR',
          payload: {
            data: 'something went wrong.'
          },
        })
      }
    })
};

export const fetchSellerProducts = (sellerId) => dispatch => {
  return ProductService.getSellerProducts(sellerId)
    .then(response => {
      dispatch({
        type: 'EDIT_S',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchMerchantProducts = ({ storeId, customerId, productIdList }) => dispatch => {
  return ProductService.getMerchantProducts(
    storeId,
    customerId,
    productIdList
  )
    .then(response => {
      dispatch({
        type: 'SET_MERCHANT_PRODUCTS',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};
export const fetchMerchantProductsSimiler = ({ customerId, productIdList }) => dispatch => {
  return ProductService.getMerchantProductsSimiler(customerId, productIdList)
    .then(response => {
      dispatch({
        type: 'SET_MERCHANT_PRODUCTS_SIMILER',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchStoreSellerProducts = ({ storeId, customerId, productIdList }) => dispatch => {
  return ProductService.getStoreSellerProducts(
    storeId,
    customerId,
    productIdList
  )
    .then(response => {
      dispatch({
        type: 'SET_MERCHANT_PRODUCTS',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchWishlists = (customerId) => dispatch => {
  return ProductService.getWishlists(customerId)
    .then(response => {
      // console.log(response.data)
      let productList = response.data.map(wishlist => ({
        product_id: wishlist.product_id,
        wishlist_item_id: wishlist.wishlist_item_id
      }))
      // console.log(productList)

      dispatch({
        type: 'SET_WISHLISTS_PRODUCT_ID',
        payload: {
          data: productList
        },
      })
      dispatch(fetchWishlistProducts({ storeId: 1, customerId, productIdList: productList }))
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchWishlistProducts = ({ storeId, customerId, productIdList }) => dispatch => {
  return ProductService.getMerchantProducts(
    storeId,
    customerId,
    productIdList
  )
    .then(response => {
      console.log(response)
      dispatch({
        type: 'SET_WISHLIST_PRODUCTS',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchProductCommentList = (productId) => dispatch => {
  return ProductService.getQuestions(productId)
    .then(response => {
      console.log(response.data)
      dispatch({
        type: 'SET_PRODUCT_COMMENT',
        payload: {
          data: response.data.data || []
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchRatingList = (productId) => dispatch => {
  return ProductService.getRatings(productId)
    .then(response => {
      dispatch({
        type: 'SET_PRODUCT_RATING',
        payload: {
          data: response.data.reviewitem || []
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const handleAddToWishList = ({ customerId, productId }) => dispatch => {
  return ProductService.addToWishlist(productId, customerId)
  .then(() => {
    dispatch(fetchWishlists(customerId));
  })
};

export const handleRemoveFromWishList = ({ customerId, wishItemId }) => dispatch => {
  return ProductService.removeFromWishlist(customerId, wishItemId)
  .then(() => {
    dispatch(fetchWishlists(customerId));
  })
};

export const showProductComment = (status) => ({
  type: 'SHOW_PRODUCT_COMMENT',
  payload: {
    data: status
  },
})
export const handleAddProductImage = ({ image, customerId, ext, singleUpload = 0 }) => dispatch => {
  return new Promise((resolve, reject) => {
    ProductService.addProductImage(image, customerId, ext)
      .then(response => {
        if (singleUpload == 0) {
          dispatch({
            type: 'ADD_PRODUCT_IMGS',
            payload: {
              data: response.data.image_path.path
            },
          })
        } else {
          dispatch({
            type: 'ADD_PRODUCT_IMG',
            payload: {
              data: response.data.image_path.path
            },
          })
        }
        resolve(response)
      })
      .catch(error => {
        console.log('product.js')
        console.log(error.response)
        reject(error)
      })
  })
};
export const handleAddProduct = ({ data }) => dispatch => {
  return ProductService.addProduct(data)
    .then(response => {
      console.log(response)
      dispatch({
        type: 'ADD_PRODUCT',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};
export const fetchCategoryVariation = ({ storeId, catId }) => dispatch => {
  return ProductService.getCategoryVariation(storeId, catId)
    .then(response => {
      dispatch({
        type: 'SET_CAT_VARIATION',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response.status)
    })
};
export const fetchEditSellerProduct = ({ productId }) => dispatch => {
  return ProductService.getEditSellerProduct(productId)
    .then(response => {
      dispatch({
        type: 'SET_EDIT_SELLER_PRODUCT',
        payload: {
          data: response.data
        },
      })
    })
    .catch(error => {
      console.log(error.response.status)
    })
};
export const fetchSellerUniqueId = (customerId) => dispatch => {
  return ProductService.getSellerUniqueIdFromProductId(customerId)
    .then(response => {
      dispatch({
        type: 'SET_SELLER_UNIQUE_ID',
        payload: {
          data: response.data.uniqueId
        },
      })
    })
    .catch(error => {
      dispatch({
        type: 'SET_SELLER_UNIQUE_ID',
        payload: {
          data: ''
        },
      })
      console.log(error.response)
    })
};
