import axios from 'axios'
import config from '../config/config';
// import https from 'https';

let endpoint = config.get('APP_CHAT_API_ENDPOINT');

let instance = axios.create({
  baseURL: endpoint || '',
  responseType: "json",
  headers: {
    "Content-type": "application/json"
  },
  // httpsAgent: new https.Agent({  
  //   rejectUnauthorized: false
  // })
})

instance.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

instance.interceptors.response.use(function(response) {
  console.log('Response', response);
  return response;
}, function(error) {
  console.log('Error',error);
  return Promise.reject(error);
});

export default instance
