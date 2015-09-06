import {assert} from 'chai';
import _ from 'lodash';
import helpers from '../../../../app/utils/helpers.js';

describe('#helpers', () => {
  describe('#extract', () => {
    it('extracts the correct keys', () => {
      let target = {
        a: 1,
        b: 2
      }
      let input = _.assign(_.cloneDeep(target), {c:3})
      let allowedKeys = ['a', 'b'];
      let result = helpers.extract(allowedKeys, input);

      assert.deepEqual(result, target)
    });
  });

  describe('#extractReMap', () => {
    it('extracts & remaps correct keys', () => {
      let target = {
        d: 1,
        e: 2
      }
      let input = {
        a: 1,
        b: 2,
        c: 3
      }
      let keyMap = {
        a: 'd',
        b: 'e'
      }
      let result = helpers.extractReMap(keyMap, input);

      assert.deepEqual(result, target)
    });
  });
});
