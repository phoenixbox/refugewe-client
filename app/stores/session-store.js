import AppDispatcher from '../dispatchers/dispatcher';
import AppConstants from '../constants/app-constants';
import _ from 'lodash';

import {EventEmitter} from 'events';
import assign from 'object-assign';

import SessionConstants from '../constants/session-constants.js';
import FacebookActions from '../actions/facebook-actions';
import FacebookStore from '../stores/facebook-store';
var CHANGE_EVENT = 'change';

// Load an access token from the session storage, you might want to implement
// a 'remember me' using localSgorage
// TODO: Where does sessionStorage come from?
var _user = {};
var _facebook = {};
var _errors = [];

var SessionStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    console.log('EMIT SESSION CHANGED');
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isLoggedIn: function() {
    return (_user && _user.access_token) ? true : false;
  },

  getAccessToken: function() {
    if (_user && _user.access_token) {
      return _user.access_token;
    } else {
      return '';
    }
  },

  getUser() {
    return _user;
  },

  getFacebook() {
    return _facebook;
  },

  getEmail: function() {
    if (_user && _user.email) {
      return _user.email;
    } else {
      return ''
    }
  },

  getErrors: function() {
    return _errors;
  }

});

SessionStore.dispatchToken = AppDispatcher.register(function(action) {
  // Store the token sent back in from the hapi redirect to the profile
  switch(action.actionType) {

    case SessionConstants.LOGIN:
      var user = internals.extractUser(action.payload)
      var facebook = internals.extractFacebook(action.payload)

      if (internals.isValid(user) && internals.isValid(facebook)) {
        _user = user;
        _facebook = facebook;
      }
      if (action.errors) {
        _errors = action.errors;
      }

      SessionStore.emitChange();
      break;
    case SessionConstants.LOGIN_ERROR:
      console.log('LOGIN ERROR: ', action.payload);
      break
    case SessionConstants.LOGOUT:
      // Flush the session related variables
      __access_token = null;
      __uuid = null;
      _user = null;
      _facebook = null;

      // Hard reset of route to decouple from ReactRouter
      window.location.href = '/';
      break;

    case SessionConstants.LOGOUT_ERROR:
      console.log('SESSION LOGOUT ERROR');
      break;
    default:
  }

  return true;
});

var internals = {
  extractUser: function(payload) {
    var userAttrs = ['access_token', 'uuid', 'token_type', 'user_id'];
    return internals.extract(userAttrs, payload);
  },

  isValid: function(object) {
    var result = true;

    for (var key in object) {
      if (object[key] == false) {
        result = false;
        break;
      }
    }

    return result;
  },

  extractFacebook: function(payload) {
    var facebookAttrs = ['facebook_username', 'facebook_email', 'facebook_display_name', 'facebook_oauth_token'];
    return internals.extract(facebookAttrs, payload);
  },

  extract: function(attrs, payload) {
    return _.reduce(payload, function(memo, val, key) {
      if(_.contains(attrs, key)) {
        memo[key] = val;
      }

      return memo;
    }, {});
  }
}

module.exports = SessionStore;
module.exports.internals = internals;
