var AppDispatcher = require('../dispatchers/dispatcher.js');
var SchemaConstants = require('../constants/schema-constants.js')
var SchemaStore = require('../stores/schema-store.js')
import request from 'superagent';
import { APIEndpoints } from '../constants/app-constants';

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
    request.get(APIEndpoints.SCHEMA).end((err, res) => {
      if (res.error) {
        var errorMsgs = _getErrors(res);
        AppDispatcher.dispatch({
          actionType: SchemaConstants.SCHEMA_ERROR,
          data: errorMsgs
        });
      } else {
        AppDispatcher.dispatch({
          actionType: SchemaConstants.SCHEMA_GET,
          data: res.body
        });
      }
    });
  }
};
