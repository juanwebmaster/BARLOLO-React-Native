import apiClient from './userApiClient'
import adminApiClient from './adminApiClient'

export default {
    getFollowers(data) {
        return apiClient.post(`/rest/V1/custom/followerList`, { data: data })
    },

    getFollowings(data) {
        return apiClient.post(`/rest/V1/custom/followingList`, { data: data })
    },

    postFollow(customerId, sellerId) {
        return apiClient.get(
            `/rest/V1/custom/addfavourite?customerid=${customerId}&sellerid=${sellerId}`
        )
    },

    postUnfollow(customerId, sellerId) {
        return apiClient.get(
            `/rest/V1/custom/removefavourite?customerid=${customerId}&sellerid=${sellerId}`
        )
    },

    getPurchaseHistory(userId) {
        return apiClient.get(
            `/rest/V1/customers/buyer/purchasehistory/${userId}/BUYER`
        )
    },

    getSaleHistory(userId) {
        return apiClient.get(
            `/rest/V1/customers/buyer/purchasehistory/${userId}/SELLER`
        )
    },

    changeOrderStatus(data) {
        return adminApiClient.post(`/rest/V1/orders`, { entity: data })
    },

    getRecentView(customerId) {
        return apiClient.get(
            `/rest/V1/recentlyviewed/getlist?customerid=${customerId}`
        )
    },

    getMerchantInfo(data) {
        return adminApiClient.post('/rest/V1/custom/customerdetail', data)
    },

    postReview(review) {
        console.log(review)
        return apiClient.post(`/rest/V1/customers/addreview`, { data: review })
    },

    getBuyerReview(userId) {
        return apiClient.get(`/rest/V1/customers/buyer/productreviews/${userId}`)
    },

    updateBuyerReview(review) {
        return apiClient.put(`/rest/V1/customers/buyer/productreviews/update`, { data: review })
    },

    removeBuyerReview(review) {
        return apiClient.put(`/rest/V1/customers/buyer/productreviews/delete`, { data: review })
    },

    getSellerReview(userId) {
        return adminApiClient.get(`/rest/V1/custom/sellerrating?sellerId=${userId}`)
    },

    getSellerPaymentInfo(userId) {
        return adminApiClient.get(`/rest/V1/viewallpaymentinfo/${userId}`)
    },

    makeAssignedPaymentInfo(data) {
        return adminApiClient.post(`/rest/V1/defaultbank-information`, {
            data: data
        })
    },

    addPaymentInfo(data) {
        return adminApiClient.post(`/rest/V1/bank-information`, { data: data })
    },

    getBankInfos() {
        return adminApiClient.get(`/rest/V1/viewallbankinfo`)
    },

    changePaymentInfo(data) {
        return adminApiClient.post(`/rest/V1/editbank-information`, { data: data })
    },

    removePaymentInfo(data) {
        return adminApiClient.post(`/rest/V1/deletebank-information`, {
            data: data
        })
    },

    getSellerProducts(data) {
        return adminApiClient.post(`/rest/V1/custom/sellerproduct`, { data: data })
    }
}