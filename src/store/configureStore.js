import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import reducers from './reducers';
import {setAxiosAuthToken, setAxiosInst} from './networkUtils';
import { getAuthToken } from './localStorage';
import config from '../config/config';
import { setInstanceStore } from './store';

const isDebuggingInChrome = true;

// const client = axios.create({
//   baseURL: config.get('APP_API_ENDPOINT'),
//   responseType: 'json',
//   headers: {
//     Accept: 'application/json',
//     'Cache-Control': 'no-cache',
//     'Content-type': 'application/json',
//     'MediCCM-Mobile': true,
//   },
// });

// setAxiosInst(client);

const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

// async function initAuthHeader() {
//   const _token = await getAuthToken();
//   if (_token !== null) {setAxiosAuthToken(_token);}
//   console.log('AuthToken', _token);
// }

// initAuthHeader();

// client.interceptors.request.use(request => {
//   console.log('Starting Request', request);
//   return request;
// });

// client.interceptors.response.use(function(response) {
//   console.log('Response', response);
//   return response;
// }, function(error) {
//   console.log('Error',error.response.status);
//   return Promise.reject(error);
// });

async function configureStore(onComplete) {
  const store = createStore(
    reducers,
    applyMiddleware(thunk, logger)
    // applyMiddleware(thunk, axiosMiddleware(client), logger)
  );
  persistStore(store, null, () => onComplete());

  setInstanceStore(store);

  if (isDebuggingInChrome) {
    window.store = store;
  }

  return store;
}

module.exports = configureStore;
