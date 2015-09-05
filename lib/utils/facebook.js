var request = require('superagent');

module.exports = {
  getEmail: function(token) {
    console.log('TOKEN: ', token)

    return request.get('https://graph.facebook.com/v2.4/me')
                  .query({fields: 'email', access_token: token})
  }
}
