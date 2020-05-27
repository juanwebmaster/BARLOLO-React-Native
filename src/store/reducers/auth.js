import { produce } from 'immer';
import { actions } from '../actions/auth';

import localStorage from '@app/store/localStorage';
import adminApiClient from '../../services/adminApiClient';
import userApiClient from '../../services/userApiClient';

const initialState = {
    adminToken: null,
    userToken: null,
    user: {},
    isLogged: false,
    isAdminLogged: false,
    isForced: false,
    registerSuccess: false,
    mobile: null
}

export default function auth(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case actions.SET_ADMIN_TOKEN:
            adminApiClient.defaults.headers['Authorization'] = `Bearer ${payload.data}`;
            return produce(state, draft => {
                draft.adminToken = payload.data;
            });
        case actions.SET_ADMIN_LOGGED:
            return produce(state, draft => {
                draft.isAdminLogged = payload.data;
            });
        case actions.SET_USER_TOKEN:
            userApiClient.defaults.headers['Authorization'] = `Bearer ${payload.data}`;
            return produce(state, draft => {
                draft.userToken = payload.data;
            });
        case actions.SET_IS_LOGGED:
            return produce(state, draft => {
                draft.isLogged = payload.data;
            });
        case actions.SET_AUTH:
            return produce(state, draft => {
                draft.isLogged = true;
                draft.user = payload.data;
            });
        case actions.HANDLE_UNAUTHORIZED:
            userApiClient.defaults.headers['Authorization'] = ``;
            localStorage.removeItem('userToken');
            localStorage.removeItem('userExpirationTime');
            return produce(state, draft => {
                draft.isLogged = false;
                draft.user = {};
            });
        case actions.PURGE_AUTH:
            userApiClient.defaults.headers['Authorization'] = ``;
            localStorage.removeItem('userToken');
            return produce(state, draft => {
                draft.isLogged = false;
                draft.user = {};
            });
        case actions.SET_IS_FORCED:
            return produce(state, draft => {
                draft.isForced = payload.data;
            });  
        case actions.REGISTER_SUCCESS:
            return produce(state, draft => {
                draft.registerSuccess = true;
            }); 
        case actions.SET_PHONE_NUMBER:
            return produce(state, draft => {
                draft.mobile = payload.data;
            }); 
        default:
            return state;
    }
}