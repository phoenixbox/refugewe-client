import AppDispatcher from '../dispatchers/dispatcher';
import {EventEmitter} from 'events';
import FacebookConstants from '../constants/facebook-constants';
import _ from 'lodash';
import moment from 'moment';

let _isLoading = false;

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
  }
});

let internals = FacebookStore.internals = {
  init(content) {
    _contentData = content;

    FacebookStore.setLoading(false);
  }
}

FacebookStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ContentConstants.CONTENT_INIT:
      internals.init(action.data);
      break;
    case ContentConstants.CONTENT_ERR:
      console.log('ERR: ', action.err)
      break;
    default:
      break;
  }
});

export default FacebookStore;
