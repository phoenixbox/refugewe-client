import {assert} from 'chai';
import helpers from '../../../../../app/views/components/helpers.js';

describe('helpers', function() {
  describe('#vowelSound', function() {
    it('returns true for vowelSound', function() {
      var testWord = 'accountant'
      assert.isTrue(helpers.vowelSound(testWord))
    })
    it('returns false for non vowelSound', function() {
      var testWord = 'doctor'
      assert.isFalse(helpers.vowelSound(testWord))
    })
  })
})
