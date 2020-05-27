/* import apiClient from './userApiClient' */
import adminApiClient from './adminApiClient'

export default {
    sellerRegisters(data) {
        return adminApiClient.post(`/rest/V1/sellerapi/webservice/createSeller`, { data: data })
    },
    checknameavalibity(shopName) {
        return adminApiClient.post(`/marketplace/seller/usernameshopverify?shoptitle=${shopName}`)
    }
}