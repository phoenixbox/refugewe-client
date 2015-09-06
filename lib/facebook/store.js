var request = require('superagent');
var _ = require('lodash');
var config = require('config');
var async = require('async');
var boom = require('boom');
var moment = require('moment');

exports.register = function(server, options, next) {

  server.method('getFacebookEmail', function(token, next) {
    request.get('https://graph.facebook.com/v2.4/me')
            .query({fields: 'email', access_token: token})
            .end(function(err, res) {
              if (err) {
                next(boom.create(404, 'Unabel to get email', err))
              } else {
                var fbJson = JSON.parse(res.text);
                console.log('GET EMAIL RESPONSE: ', fbJson)

                next(null, fbJson.email)
              }
            })
  })

  /** LLT Exchange Endpoint - we need a LLT to make scheduled requests on behalf of the user
    * https://graph.facebook.com/v2.3/oauth/access_token?
    *  grant_type=fb_exchange_token&
    *  client_id={app-id}&
    *  client_secret={app-secret}&
    *  fb_exchange_token={short-lived-token}

    * Long Live Token Response
    * ${access_token} - string - new 60 day token
    * ${token_type} - string - 'bearer'
    * ${expires_in} - number - seconds until expiry
    */
  server.method('exchangeForLLT', function(token, next) {
    request.get('https://graph.facebook.com/v2.3/oauth/access_token')
            .query({
              grant_type: 'fb_exchange_token',
              client_id: config.FACEBOOK_APP_ID,
              client_secret: config.FACEBOOK_CLIENT_SECRET,
              fb_exchange_token: token
            })
            .end(function(err, res) {
              if (err) {
                next(boom.create(404, 'Unable to get LLT', err))
              } else {
                var fbJson = internals.formatTTLResponse(JSON.parse(res.text));
                console.log('TTL RESPONSE: ', fbJson)

                next(null, fbJson)
              }
            })
  })

  next();
};

exports.register.attributes = {
  name: 'facebook-store',
  version: '0.0.1',
  description: 'Facebook server methods'
};

var internals = {
  formatTTLResponse: function(ttl) {
    var expiration = moment().utc().add(ttl.expires_in,'seconds').unix();

    return {
      token: ttl.access_token,
      token_type: ttl.token_type,
      expiration: expiration
    }
  }
}
module.exports.internals = internals;
