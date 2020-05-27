import apiClient from './userApiClient'
import adminApiClient from './adminApiClient'

export default {
    changeAddress(address) {
        return adminApiClient.post(`/rest/V1/orderapi/webservice/customeraddress`, {
            data: address
        })
    },

    removeAddress(addressId) {
        return adminApiClient.delete(`/rest/V1/addresses/${addressId}`)
    },

    getProfile() {
        return apiClient.get(`/rest/V1/customers/me`)
    },

    getImageUrl() {
        return adminApiClient.get(`/rest/V1/custom/mediaurl`)
    },

    getUserInfo(phone) {
        return adminApiClient.post(`/rest/V1/custom/getusername`, phone)
    },

    addProfileImage(data) {
        return apiClient.put(`/rest/V1/customers/uploadprofilepic`, data)
    },

    updateProfile(data) {
        return apiClient.put(`/rest/V1/customers/me`, data)
    },

    changePassword(data) {
        return apiClient.put(`/rest/V1/customers/me/password`, data)
    },

    updatePassword(entityId, password, mobile) {
        return adminApiClient.post(`/rest/V1/custom/password?entity=${entityId}&pass=${password}&customermobile=${mobile}`)
    },

    checkValidate(username) {
        return adminApiClient.get(`/rest/V1/custom/validateuser?username=${username}`)
    }
}