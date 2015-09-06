import _ from 'lodash';

export default {
  extract(keys, data){
    return _.reduce(data, (memo, val, key) => {
      if(_.contains(keys, key)) {
        memo[key] = val;
      }

      return memo;
    }, {});
  },

  extractReMap(keyPairs, data) {
    let baseKeys = _.keys(keyPairs)

    return _.reduce(data, (memo, val, key) => {
      if (_.contains(baseKeys, key)) {
        let mappedKey = keyPairs[key];

        memo[mappedKey] = val;
      }

      return memo
    }, {})
  },

  isValid(object) {
    let result = true;

    for (let key in object) {
      if (object[key] == false) {
        result = false;
        break;
      }
    }

    return result;
  }
}
