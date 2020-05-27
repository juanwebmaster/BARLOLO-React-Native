import apiClient from './adminApiClient'

export default {
  getShops(data) {
    return apiClient.post(`/rest/V1/custom/viewall`, { data: data })
  },

  getPickupLocation(data) {
    return apiClient.get(`/rest/V1/custom/storeaddress?sellerId=${data}`)
  },

  updatePickupLocation(data) {
    return apiClient.post(`/rest/V1/custom/storeaddressadd`, { data: data })
  },

  deletePickupLocation(data) {
    return apiClient.post(`/rest/V1/custom/storeaddressdelete`, { sellerId: data })
  },

  getShop(sellerId, limit, pageNo, field, direction, filterValue, customreId) {
    return apiClient.get(
      `/rest/V1/custom/storeDetail?sellerId=${sellerId}&limit=${limit}&pageNo=${pageNo}&field=${field}&direction="${direction}&filterValue=${filterValue}&customerId=${customreId}`
    )
  },

  addBannerImage(image,customerId,ext) {
    return apiClient.post(`/rest/V1/custom/uploadstorebanner`, {
      customerId: customerId,
      image: image,
      ext: ext
    });
  },

  addLogoImage(image,customerId,ext) {
    return apiClient.post(`/rest/V1/custom/uploadstorelogo`, {
      customerId: customerId,
      image: image,
      ext: ext
    });
  },

  getFeatureProducts(storeId, productIdList) {
    return apiClient.post(
      `/rest/V1/custom/catproduct?storeid=${storeId}&productid=${productIdList}`
    )
  },

  updateShopProfile(data){
    return apiClient.post(`/rest/V1/custom/sellerprofile`, {data: data})
  }
}
