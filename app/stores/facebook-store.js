import {EventEmitter} from 'events';
import _ from 'lodash';
import moment from 'moment';
import AppDispatcher from '../dispatchers/dispatcher';
import FacebookConstants from '../constants/facebook-constants';
import helpers from '../utils/helpers';

let _facebook = {};
let _errors = [];
let _isLoading = false;
const FB_ATTR_MAP = {
  facebook_username: 'username',
  facebook_display_name: 'display_name',
  facebook_token: 'token'
}

let FacebookStore = _.assign({}, EventEmitter.prototype, {

  emitChange() {
    this.emit('change');
  },

  addChangeListener(callback) {
    this.on('change', callback);
  },

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  },

  isLoading() {
    return _isLoading;
  },

  setLoading(state) {
    _isLoading = state;

    this.emitChange();
  },

  getFacebook() {
    return _facebook;
  },

  setFacebook(data) {
    let fbData = internals.extractFacebook(data);

    _.assign(_facebook, fbData);
    this.emitChange();
  }
});

let internals = FacebookStore.internals = {
  init(content) {
    _contentData = content;

    FacebookStore.setLoading(false);
  },
  extractFacebook(payload) {
    return helpers.extractReMap(FB_ATTR_MAP, payload);
  }
}

FacebookStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case FacebookConstants.FB_INIT:
      internals.init(action.data);
      break;
    case FacebookConstants.FB_ERR:
      console.log('ERR: ', action.err)
      break;
    default:
      break;
  }
});

export default FacebookStore;
module.exports.internals = internals;
