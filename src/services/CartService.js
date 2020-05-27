import apiClient from './userApiClient'
import adminApiClient from './adminApiClient'

export default {
  getQuote() {
    return apiClient.post(`/rest/V1/carts/mine`)
  },

  createCart(data) {
    return apiClient.post(`/rest/V1/carts/mine/items`, { cartItem: data })
  },

  getCarts(customerId) {
    return apiClient.get(`/rest/V1/custom/cartdetail?customerid=${customerId}`)
  },

  removeCart(quoteId, itemId) {
    return adminApiClient.delete(`/rest/V1/carts/${quoteId}/items/${itemId}`)
  },

  clearCart(customerId) {
    return adminApiClient.delete(
      `/rest/V1/custom/clearCart?customerid=${customerId}`
    )
  },

  applyCoupon(quoteId, couponCode) {
    return adminApiClient.put(`/rest/V1/carts/${quoteId}/coupons/${couponCode}`)
  },

  removeCoupon(quoteId) {
    return adminApiClient.delete(`/rest/V1/carts/${quoteId}/coupons`)
  },

  postOrder(storeid, data) {
    return adminApiClient.post(`/rest/V1/orderapi/webservice/createOrder`, {
      data: data,
      storeid: storeid
    })
  }
}
