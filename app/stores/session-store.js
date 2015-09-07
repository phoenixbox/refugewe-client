import _ from 'lodash';
import {EventEmitter} from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatchers/dispatcher';
import AppConstants from '../constants/app-constants';
import helpers from '../utils/helpers.js'
import SessionConstants from '../constants/session-constants.js';
import FacebookActions from '../actions/facebook-actions';
import FacebookStore from '../stores/facebook-store';

let _user = {};
let _errors = [];
let _isLoading = false;
const CHANGE_EVENT = 'change';
const USER_ATTRS = ["access_token", "token_type", "uuid", "email"];

let SessionStore = assign({}, EventEmitter.prototype, {

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
  switch(action.actionType) {
    /** Session Login Schema
     * ${access_token} String
     * ${token_type} String
     * ${uuid} String
     * ${email} String
     * ${facebook_username} String
     * ${facebook_display_name} String
     * ${facebook_token} String
     */
    case SessionConstants.LOGIN:
      let user = internals.extractUser(action.payload)
      FacebookStore.setFacebook(action.payload)

      if (helpers.isValid(user)) {
        _user = user;
      }
      if (action.errors) {
        _errors.push(action.errors);
      }

      SessionStore.emitChange();
      break;
    case SessionConstants.LOGIN_ERROR:
      console.log('LOGIN ERROR: ', action.payload);
      break
    case SessionConstants.LOGOUT:
      /*
       * Flush the session related variables
       */
      // Hard reset of route to decouple from ReactRouter
      __access_token = null;
      window.location.href = '/';
      break;

    case SessionConstants.LOGOUT_ERROR:
      console.log('SESSION LOGOUT ERROR');
      break;
    default:
  }

  return true;
});

let internals = {
  extractUser: function(payload) {
    return helpers.extract(USER_ATTRS, payload);
  }
}

module.exports = SessionStore;
module.exports.internals = internals;
