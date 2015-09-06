var AppDispatcher = require('../dispatchers/dispatcher.js');
var SessionAPI = require('../lib/API/session.js');
var SessionConstants = require('../constants/session-constants.js')
var SessionStore = require('../stores/session-store.js')

function _getErrors(res) {
  var errorMsgs = ["Something went wrong, please try again"];
  if ((json = JSON.parse(res.text))) {
    if (json['errors']) {
      errorMsgs = json['errors'];
    } else if (json['error']) {
      errorMsgs = [json['error']];
    }
  }
  return errorMsgs;
}

module.exports = {
  init: function() {
    let access_token = SessionStore.getAccessToken() || __access_token;

    SessionAPI.login(access_token).then(function(res) {
      if (res.error) {
        var errorMsgs = _getErrors(res);
        AppDispatcher.dispatch({
          actionType: SessionConstants.LOGIN_ERROR,
          payload: errorMsgs
        });
      } else {
        /* Session Serialized
         * :access_token,
         * :token_type,
         * :user_id,
         * :facebook_username,
         * :facebook_email,
         * :facebook_display_name,
         * :facebook_token
         */

        AppDispatcher.dispatch({
          actionType: SessionConstants.LOGIN,
          payload: res.body
        });
      }
    });
  },

  logout: function() {
    SessionAPI.logout().then(function(res) {
      console.log('Logged Out');
      if (res.status === 200) {
        AppDispatcher.dispatch({
          actionType: SessionConstants.LOGOUT
        });
      } else {
        AppDispatcher.dispatch({
          actionType: SessionConstants.LOGOUT_ERROR
        });
      }
    });
  }
};
