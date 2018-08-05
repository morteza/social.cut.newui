import axios from 'axios';

import cookie from 'react-cookies';


export function createAPI() {
  API = axios.create({
    baseURL: `https://kitten.cut.social/api/v7`,
    headers: {
      Authorization: 'Bearer ' + cookie.load('cutJwtToken')
    }
  });
  return API;
}

export var API = createAPI();
