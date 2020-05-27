
export let axiosApi = null;

export function setAxiosInst(instance) {
  axiosApi = instance;
}

export function setAxiosAuthToken(token) {
  if (axiosApi) {
    axiosApi.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}

