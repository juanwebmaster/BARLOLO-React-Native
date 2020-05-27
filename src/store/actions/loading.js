export const actions = {
  SET_LOADING_STATUS: 'SET_LOADING_STATUS',
  TOGGLE_HEADER: 'TOGGLE_HEADER',
  HIDE_SEARCH_BAR: 'HIDE_SEARCH_BAR',
  SET_TITLE: 'SET_TITLE',
  SET_REDIRECT_LINK: 'SET_REDIRECT_LINK',
};

export const updateLoadingStatus = (status) => ({
  type: 'HANDLE_UNAUTHORIZED',
  payload: {
    data: status,
  },
});
export const toggleHeader = (action) => ({
  type: 'TOGGLE_HEADER',
  payload: {
    data: action,
  },
});
export const toggleSearchBar = (action) => ({
  type: 'HIDE_SEARCH_BAR',
  payload: {
    data: action,
  },
});
export const setTitle = (action) => ({
  type: 'SET_TITLE',
  payload: {
    data: action,
  },
});
export const setRedirectLink = (link) => ({
  type: 'SET_REDIRECT_LINK',
  payload: {
    data: link,
  },
});
