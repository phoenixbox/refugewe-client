import request from 'superagent-bluebird-promise';
import { APIEndpoints } from '../../constants/app-constants';

module.exports = {
  login(access_token) {
    let authCreds = internals.extractAuthCreds(access_token);

    return request.post(APIEndpoints.LOGIN)
      .send(authCreds)
      .set('Accept', 'application/json')
  },
  logout() {
    // Hits hapi server to flush credentials
    return request.get(APIEndpoints.LOGOUT)
      .query({source: 'client'})
      .set('Accept', 'application/json')
  }
}
let internals = {
  extractAuthCreds(auth) {
    let creds = auth.split(':');

    return {
      uuid: creds[0],
      access_token: creds[1],
      grant_type: 'password'
    }
  }
}
module.exports.internals = internals;
