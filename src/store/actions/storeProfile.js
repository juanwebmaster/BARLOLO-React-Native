import SellerService from '@app/services/SellerService.js'

export const actions = {
  uploadProfile({ rootState }, data) {
    var info = {
      customerId: rootState.userInfo.userDetail.entity_id,
      image: data.image,
      ext: data.type
    }
    return SellerService.uploadProfile(info)
      .then(response => {
        return response
      })
      .catch(error => {
        console.log(error.response)
      })
  },

  uploadBanner({ rootState }, data) {
    var info = {
      customerId: rootState.userInfo.userDetail.entity_id,
      image: data.image,
      ext: data.type
    }
    return SellerService.uploadBanner(info)
      .then(response => {
        return response
      })
      .catch(error => {
        console.log(error.response)
      })
  },

  updateInfo({ commit }, data) {
    var info = {
      customer_id: data.entity_id,
      email: data.email,
      mobile_number: data.mobile_number,
      store_desc: data.company_description,
      store_title: data.shop_title
    }
    return SellerService.updateInfo(info)
      .then(response => {
        console.log(response)
        console.log(data)
        commit('userInfo/SET_CUSTOMER_DETAIL', data, {
          root: true
        })
      })
      .catch(error => {
        console.log(error.response)
      })
  }
}
