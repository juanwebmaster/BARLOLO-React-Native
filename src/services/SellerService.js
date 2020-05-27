import apiClient from './adminApiClient'

export default {
  uploadProfile(data) {
    return apiClient.post('/rest/V1/custom/uploadstorelogo', data)
  },

  uploadBanner(data) {
    return apiClient.post('/rest/V1/custom/uploadstorebanner', data)
  },

  updateInfo(data) {
    return apiClient.post('/rest/V1/custom/sellerprofile', { data: data })
  }
}
