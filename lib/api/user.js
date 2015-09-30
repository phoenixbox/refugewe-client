var _ = require('lodash');
var config = require('config');
var request = require('superagent');
var boom = require('boom');

exports.register = function(server, options, callback) {

  server.method('saveUserFacebookAccount', function(token, profile, next) {
    var usersURL = config.SERVER_ROOT + '/v1/users';

    // POST to /v1/users
    var params = {
      token: token,
      profile: profile,
      provider: 'facebook'
    }

    request.post(usersURL)
      .send({user: params})
      .set('Accept', 'application/json')
      .end(function(res) {
        if (res.error) {
          next(boom.create(404, 'saveUserFacebookAccount', res.err))
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
