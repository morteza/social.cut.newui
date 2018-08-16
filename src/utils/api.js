import axios from 'axios';

import cookie from 'react-cookies';


export function createAPI() {
  API = axios.create({
    baseURL: `https://kitten.cut.social/api/v7`,
    headers: {
      Authorization: 'Bearer ' + cookie.load('cutJwtToken')
    }
  });

  API.getIp = () => {
    return axios.get('https://jsonip.com/');
  };

  API.getExperimentContent = (code) => {
    return API.get(`/experiments/${code}/content`);
  }
  return API;
}

export var API = createAPI();
