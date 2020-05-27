import ApiService from '@app/services/ApiService.js'

export const actions = {
  SET_NOTIFICATION: 'SET_NOTIFICATION',
};

export const fetchNotification = (userId) => dispatch => {
  return ApiService.getNotification(userId)
    .then(response => {
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          data: response.data,
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
}
