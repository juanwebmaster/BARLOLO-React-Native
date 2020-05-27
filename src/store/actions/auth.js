import axios from 'axios'

import localStorage from '@app/store/localStorage';

import {add} from './user';
import config from '../../config/config';

import {fetchWishlists} from './product';
import {fetchSenderUniqueId} from './chat';

let baseUrl = config.get('APP_API_ENDPOINT');

export const actions = {
    SET_ADMIN_TOKEN: 'SET_ADMIN_TOKEN',
    SET_ADMIN_LOGGED: 'SET_ADMIN_LOGGED',
    SET_USER_TOKEN: 'SET_USER_TOKEN',
    SET_IS_LOGGED: 'SET_IS_LOGGED',
  
    SET_AUTH: 'SET_AUTH',
    HANDLE_UNAUTHORIZED: 'HANDLE_UNAUTHORIZED',
    PURGE_AUTH: 'PURGE_AUTH',
  
    SET_IS_FORCED: 'SET_IS_FORCED',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    SET_PHONE_NUMBER: 'SET_PHONE_NUMBER',
};

export const adminLogin = () => dispatch => {
    return axios
    .post(`${baseUrl}/rest/V1/integration/admin/token`, {
        username: 'endroiduser',
        password: 'barlolo123'
    })
    .then(response => {
        dispatch({
            type: 'SET_ADMIN_TOKEN',
            payload: {
                data: response.data,
            },
        });
        dispatch({
            type: 'SET_ADMIN_LOGGED',
            payload: {
                data: true,
            },
        });
        const now = new Date()
        const expirationTime = now.getTime() + 4 * 60 * 60 * 1000
        localStorage.setItem('adminToken', response.data)
        localStorage.setItem('adminExpirationTime', expirationTime.toString())
    });
};

export const customerLogin = (params) => dispatch => {
    return axios
    .post(`${baseUrl}/rest/V1/integration/customer/token`, params)
    .then(response => {
        dispatch({
            type: 'SET_USER_TOKEN',
            payload: {
                data: response.data,
            },
        });
        dispatch({
            type: 'SET_IS_LOGGED',
            payload: {
                data: true,
            },
        });

        const now = new Date()
        const expirationTime = now.getTime() + 2 * 60 * 60 * 1000
        localStorage.setItem('userToken', response.data)
        localStorage.setItem('userExpirationTime', expirationTime.toString())
    });
};

export const customerRegister = (params) => async dispatch => {
    const token = await localStorage.getItem('adminToken')
    return axios.post(
        `${baseUrl}/rest/V1/sellerapi/webservice/createSeller`,
        params, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
    )
    /*  .then(response => {
        commit('REGISTER_SUCCESS')
        }) */
};

/* sellerRegister({ commit }, params) {
    
    const token = window.localStorage.getItem('adminToken')
    return axios
        .post(`${baseUrl}/rest/V1/sellerapi/webservice/createSeller`, params, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(() => {
            commit('REGISTER_SUCCESS')
        })
}, */

export const customerLogout = () => ({
    type: 'HANDLE_UNAUTHORIZED',
    payload: {
    },
});

export const fetchAdminToken = () => async dispatch => {
    const token = await localStorage.getItem('adminToken')
    if (!token) {
        return dispatch(adminLogin())
    }

    const now = new Date()
    const expirationTime = await localStorage.getItem('adminExpirationTime')
    if (now.getTime() >= expirationTime) {
        return dispatch(adminLogin())
    }

    dispatch({
        type: 'SET_ADMIN_TOKEN',
        payload: {
            data: token,
        },
    })
};

export const fetchUser = (token) => (dispatch) => {
    // if (!Object.keys(state.user).length || state.isForced) {
        return axios
            .get(`${baseUrl}/rest/V1/customers/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                dispatch({
                    type: 'SET_AUTH',
                    payload: {
                        data: response.data
                    },
                })
                    // get wishlist
                dispatch(fetchWishlists(response.data.id))
                dispatch(add(response.data));
                dispatch(fetchSenderUniqueId(response.data.id))
            })
            .catch(() => {
                dispatch({
                    type: 'HANDLE_UNAUTHORIZED',
                    payload: {
                    },
                })
            })
    // }
};

export const updateIsForced = (isForced) => ({
    type: 'SET_IS_FORCED',
    payload: {
        data: isForced,
    },
});

export const setPhoneNumber = (mobile) => ({
    type: 'SET_PHONE_NUMBER',
    payload: {
        data: mobile,
    },
});

export const checkAuth = () => async dispatch => {
    const token = await localStorage.getItem('userToken')
    const now = new Date()
    const expirationTime = await localStorage.getItem('userExpirationTime')

    if (token && now.getTime() <= expirationTime) {
        dispatch({
            type: 'SET_USER_TOKEN',
            payload: {
                data: token,
            },
        })
        return dispatch(fetchUser(token))
    } else {
        dispatch({
            type: 'PURGE_AUTH',
            payload: {
            },
        })
    }
}