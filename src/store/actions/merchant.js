import MerchantService from '@app/services/MerchantService.js'

export const actions = {
  SET_FOLLOWERS: 'SET_FOLLOWERS',
  SET_FOLLOWINGS: 'SET_FOLLOWINGS',
  REMOVE_FOLLOWING: 'REMOVE_FOLLOWING',
  SET_PURCHASE_HISTORY: 'SET_PURCHASE_HISTORY',
  SET_SALE_HISTORY: 'SET_SALE_HISTORY',
  SET_RECENT_PRODUCTS: 'SET_RECENT_PRODUCTS',
  SET_MERCHANT_INFO: 'SET_MERCHANT_INFO',
  SET_BUYER_REVIEW: 'SET_BUYER_REVIEW',
  SET_SELLER_REVIEW: 'SET_SELLER_REVIEW',
  SET_SELLER_PAYMENT_INFO: 'SET_SELLER_PAYMENT_INFO',
  SET_BANK_INFOS: 'SET_BANK_INFOS',
  SET_SELLER_PRODUCTS: 'SET_SELLER_PRODUCTS',
};

// export const actions1 = {
export const fetchFollowers = (followers, data) => dispatch => {
  if (!followers.length) {
    return MerchantService.getFollowers(data)
      .then(response => {
        dispatch({
          type: 'SET_FOLLOWERS',
          payload: {
              data: response.data,
          },
        })
      })
      .catch(error => {
        console.log(error.response)
      })
  }
}

export const fetchFollowings = (followings, data) => dispatch => {
  if (!followings.length) {
    return MerchantService.getFollowings(data)
      .then(response => {
        dispatch({
          type: 'SET_FOLLOWINGS',
          payload: {
              data: response.data,
          },
        })
      })
      .catch(error => {
        console.log(error.response)
      })
  }
}
// postFollow(context, { customerId, sellerId }) {
//   return MerchantService.postFollow(customerId, sellerId)
//     .then(() => {
//       commit('REMOVE_FOLLOWING', entityId)
//     })
//     .catch(error => {
//       console.log(error.response)
//     })
// },
export const postFollow = ({customerId, sellerId}) => dispatch => {
  return MerchantService.postFollow(customerId, sellerId)
    .then(() => {
    })
    .catch(error => {
      console.log(error.response)
    })
}

export const postUnfollow = ({entityId, customerId, sellerId}) => dispatch => {
  return MerchantService.postUnfollow(customerId, sellerId)
    .then(() => {
      dispatch({
        type: 'REMOVE_FOLLOWING',
        payload: {
            data: entityId,
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
}

export const fetchPurchaseHistory = (userId) => dispatch => {
  return MerchantService.getPurchaseHistory(userId)
    .then(response => {
      if (!response.data.error) {
        dispatch({
          type: 'SET_PURCHASE_HISTORY',
          payload: {
              data: response.data,
          },
        })
      }
    })
    .catch(error => {
      console.log(error.message)
    })
};

export const fetchSaleHistory = (userId) => dispatch => {
  return MerchantService.getSaleHistory(userId)
    .then(response => {
      dispatch({
        type: 'SET_SALE_HISTORY',
        payload: {
            data: response.data,
        },
      })
    })
    .catch(error => {
      console.log(error.message)
    })
};

export const updateOrderStatus = (data) => dispatch => {
  return MerchantService.changeOrderStatus(data)
    .then(() => {
      let saleHistory = getters.getDeletedSaleHistoryById(data.entity_id)

      dispatch({
        type: 'SET_SALE_HISTORY',
        payload: {
          data: saleHistory,
        }
      })
    })
    .catch(error => {
      console.log(error.message)
    })
};

export const fetchMerchantInfo = (data) => dispatch =>  {
  return MerchantService.getMerchantInfo(data)
    .then(response => {
      console.log(response)
      dispatch({
        type: 'SET_MERCHANT_INFO',
        payload: {
          data: response.data,
        }
      })
    })
    .catch(error => {
      console.log(error)
    })
};

export const fetchRecentProducts = ({ customerId }) => dispatch => {
  return MerchantService.getRecentView(customerId)
    .then(response => {
      dispatch({
        type: 'SET_RECENT_PRODUCTS',
        payload: {
          data: response.data.items,
        }
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchBuyerReview = (userId) => dispatch => {
  return MerchantService.getBuyerReview(userId)
    .then(response => {
      dispatch({
        type: 'SET_BUYER_REVIEW',
        payload: {
          data: response.data,
        }
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchSellerReview = (userId) => dispatch => {
  return MerchantService.getSellerReview(userId)
    .then(response => {
      dispatch({
        type: 'SET_SELLER_REVIEW',
        payload: {
          data: response.data,
        }
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchSellerPaymentInfo = (userId) => dispatch => {
  return MerchantService.getSellerPaymentInfo(userId)
    .then(response => {
      dispatch({
        type: 'SET_SELLER_PAYMENT_INFO',
        payload: {
          data: response.data[0].data,
        }
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchBankInfos = () => dispatch => {
  return MerchantService.getBankInfos()
    .then(response => {
      dispatch({
        type: 'SET_BANK_INFOS',
        payload: {
          data: response.data[0].data,
        } 
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const createPaymentInfo = (data) => dispatch => {
  return MerchantService.addPaymentInfo(data)
    .then(response => {
      dispatch({
        type: 'ADD_SELLER_PAYMENT_INFO',
        payload: {
          data: response.data,
        } 
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const updatePaymentInfo = ({ data, paymentToUpdate }) => dispatch => {
  return MerchantService.changePaymentInfo(data)
    .then(() => {
      let paymentInfos = getters.getUpdatedPaymentInfos(paymentToUpdate)

      dispatch({
        type: 'SET_SELLER_PAYMENT_INFO',
        payload: {
          data: paymentInfos,
        } 
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const deletePaymentInfo = (paymentToRemove) => dispatch => {
  return MerchantService.removePaymentInfo(paymentToRemove)
    .then(() => {
      let paymentInfos = getters.getDeletedPaymentInfos(paymentToRemove)

      dispatch({
        type: 'SET_SELLER_PAYMENT_INFO',
        payload: {
          data: paymentInfos,
        } 
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const fetchSellerProducts = (data) => dispatch => {
  return MerchantService.getSellerProducts(data)
    .then(response => {
      dispatch({
        type: 'SET_SELLER_PRODUCTS',
        payload: {
          data: response.data,
        } 
      })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const getters = {
  getUpdatedPaymentInfos: state => paymentToUpdate => {
    return state.sellerPaymentInfo.map(paymentInfo => {
      if (paymentInfo.id == paymentToUpdate.id) {
        paymentInfo = paymentToUpdate
      }
      return paymentInfo
    })
  },

  getDeletedPaymentInfos: state => paymentToRemove => {
    return state.sellerPaymentInfo.filter(
      paymentInfo => paymentInfo.id != paymentToRemove.id
    )
  },

  getDeletedSaleHistoryById: state => id => {
    let modifiedConfirmStock = state.saleHistory.confirm_stock.filter(
      stock => stock.entityid != id
    )

    return { ...state.saleHistory, confirm_stock: modifiedConfirmStock }
  }
}
