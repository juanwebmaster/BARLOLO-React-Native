import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

import config from '../config/config';

let endpoint = config.get('APP_API_ENDPOINT');
AsyncStorage.setItem('myStoreId','3');

let instance = axios.create({
    baseURL: endpoint || '',
    responseType: "json",
    headers: {
      "Content-type": "application/json"
    }
})
// instance.interceptors.request.use(config => {
//     // const token = window.localStorage.getItem('adminToken')
//     const token = store.state.auth.adminToken
//     config.headers.Authorization = `Bearer ${token}`
//     console.log('config ==> ', config);
//     return config
// })

instance.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

instance.interceptors.response.use(function(response) {
  console.log('Response', response);
  return response;
}, function(error) {
  console.log('Error',error.response.status);
  return Promise.reject(error);
});

export default instance
