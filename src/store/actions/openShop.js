import OpenShopService from '@app/services/shopCreateService.js'

export const actions = {
  sellerreg: 'sellerreg',
  storename: 'storename',
};

export const sellerRegisterNew = ({ data }) => dispatch => {
  return OpenShopService.sellerRegisters(data)
    .then(response => {
      dispatch({
        type: 'sellerreg',
        payload: {
          data: response.data,
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
  /* const token = window.localStorage.getItem('adminToken')                                                                                                                                                                 return axios                                                                                                                                                                       .post(`${baseUrl}/rest/V1/sellerapi/webservice/createSeller`, params, {                                                                                                                                                                            headers:                                                                                                                                                                                Authorization: 'Bearer ' + toke                                                                                                                                                                   .then(() => {                                                                                                                                                                           commit('REGISTER_SUCCES                                                                                                                                                                       }) */
}
export const checkstorename = ({ data }) => dispatch => {
  return OpenShopService.checknameavalibity(data)
    .then(response => {
      dispatch({
        type: 'storename',
        payload: {
          data: response.data,
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
}
