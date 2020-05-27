import ApiService from '@app/services/ApiService.js'

export const actions = {
  SET_LOCATION: 'SET_LOCATION',
};

export const fetchLocation = ({ countryCode, regionId, cityId }) => dispatch => {
  return ApiService.getLocation(countryCode, regionId, cityId)
    .then(response => {
      dispatch({
        type: 'SET_LOCATION',
        payload: {
          data: response.data,
        },
      })
    })
    .catch(error => {
      console.log(error.response)
    })
}

export const clearLocation = () => ({
  type: 'SET_LOCATION',
  payload: {
    data: {},
  },
})
