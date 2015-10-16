import {RAILSRoot, HAPIRoot} from '../config.js';

module.exports = {
  APIEndpoints: {
    LOGIN: RAILSRoot + "/v1/login",
    LOGOUT: HAPIRoot + "/logout",
    SCHEMA: RAILSRoot + "/v1/schemas"
  }
};
