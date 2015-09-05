var _ = require('lodash');
var request = require('request');
var config = require('config');
var request = require('superagent-bluebird-promise');

exports.register = function(server, options, callback) {

  server.method('saveUserFacebookAccount', function(token, account, next) {
    var usersURL = config.SERVER_ROOT + '/v1/users';

    // POST to /v1/users
    var params = {
      token: token,
      profile: account,
      provider: 'facebook'
    }

    request.post(usersURL)
      .send({user: params})
      .set('Accept', 'application/json')
      .then(function(res) {
        if (res.error) {
          next(true, null);
        } else {
          next(null, res.body);
        }
      });
  });

  callback();
};

exports.register.attributes = {
  name: 'api-user',
  version: '0.0.1'
};


/* Facebook Response Shape
*  provider: 'facebook',
*  token: '123',
*  profile: {
*    id: '123456',
*    username: undefined,
*    displayName: 'Shane Rogers',
*    name: { first: undefined, last: undefined, middle: undefined },
*    email: undefined,
*    raw: {
*      name: 'Shane Rogers',
*      id: '123456'
*    }
*  }
*  curl localhost:3002/v1/login --data "email=user@example.com=user&user[password]=password"
*  {
*   "token_type": "Bearer",
*   "user_id": 1,
*   "access_token": "1:MPSMSopcQQWr-LnVUySs"
*  }
*  User.create!({:email => "srogers@quickleft.com", :uuid => "", :password => "11111111", :username => 'phoenixbox', :password_confirmation => "11111111" })
*/
