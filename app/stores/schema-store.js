import {EventEmitter} from 'events';
import _ from 'lodash';
import moment from 'moment';
import AppDispatcher from '../dispatchers/dispatcher';
import SchemaConstants from '../constants/schema-constants';
import helpers from '../utils/helpers';

let _schema = {};
let _isLoading = false;

let SchemaStore = _.assign({}, EventEmitter.prototype, {

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

  getSchema() {
    return _schema;
  },

  setSchema(data) {
    _.assign(_schema, data);
    this.emitChange();
  }
});

let internals = SchemaStore.internals = {
  init(schema) {
    _schema = schema;

    SchemaStore.setLoading(false);
  }
}

SchemaStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case SchemaConstants.SCHEMA_GET:
      internals.init(action.data);
      break;
    case SchemaConstants.SCHEMA_ERROR:
      console.log('ERR: ', action.data)
      break;
    default:
      break;
  }
});

export default SchemaStore;
module.exports.internals = internals;
