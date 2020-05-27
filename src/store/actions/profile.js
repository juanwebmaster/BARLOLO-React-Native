import UserService from '@app/services/UserService.js'

export const actions = {
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_IMAGE_URL: 'SET_IMAGE_URL',
  MOBILE_CHECK: 'MOBILE_CHECK',
};

export const getImageUrl = () => dispatch => {
  return UserService.getImageUrl()
    .then(response => {
      dispatch({
        type: 'SET_IMAGE_URL',
        payload: {
          data: response.data.mediaurl,
        },
      })
    })
}

export const getProfile = () => dispatch => {
  return UserService.getProfile()
    .then(response => {
      dispatch({
        type: 'SET_USER_PROFILE',
        payload: {
          data: response.data,
        },
      })
    })
    .catch(error => console.log(error))
}

export const getUserInfo = (phone) => dispatch => {
  return UserService.getUserInfo(phone)
    .then(response => {
      dispatch({
        type: 'MOBILE_CHECK',
        payload: {
          data: response.data,
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
}
