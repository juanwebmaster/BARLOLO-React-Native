import UserService from '@app/services/UserService.js'
import localStorage from '@app/store/localStorage';

export const actions = {
  SET_USER: 'SET_USER',
  SET_LANG: 'SET_LANG',
  SET_USER_UPDATE_ADDRESS: 'SET_USER_UPDATE_ADDRESS',
  SET_USER_DELETE_ADDRESS: 'SET_USER_DELETE_ADDRESS',
};

export const add = (user) => ({
  type: 'SET_USER',
  payload: {
      data: user,
  },
});

export const setLanguage = (lang) => {
  localStorage.setItem('lang', lang || 'en')
  return {
    type: 'SET_LANG',
    payload: {
        data: lang,
    },
  };
};

export const createAddress = (address) => {
  return UserService.changeAddress(address).then(() => {
    // this.$router.go(0)
  })
};

export const updateAddress = ({ address, addressToUpdate }) => dispatch => {
  return UserService.changeAddress(address)
    .then(() => {
      dispatch({
        type: 'SET_USER_UPDATE_ADDRESS',
        payload: {
            data: addressToUpdate,
        },
      });
      // const notification = {
      //   type: 'success',
      //   message: response.data.msg
      // }
      // dispatch('notification/add', notification, { root: true })
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const deleteAddress = (addressToRemove) => dispatch => {
  return UserService.removeAddress(addressToRemove.id)
    .then(() => {
      dispatch({
        type: 'SET_USER_DELETE_ADDRESS',
        payload: {
            data: addressToRemove,
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};

export const makeDefaultAddress = (address) => dispatch => {
  return UserService.changeAddress(address).catch(error => {
    console.log(error.response)
  })
};

export const getUserInfo = (phone) => dispatch => {
  return UserService.getUserInfo(phone)
    .then(response => {
      dispatch({
        type: 'SET_USER',
        payload: {
            data: response.data,
        },
      });
    })
    .catch(error => {
      console.log(error.response)
    })
};
