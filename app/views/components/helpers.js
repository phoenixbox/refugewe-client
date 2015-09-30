import _ from 'lodash';

module.exports = {
  vowelSound(word) {
    let firstLetter = word.charAt(0).toLowerCase()
    let vowelSounds = ['a','e','i','o','u']

    return _.contains(vowelSounds, firstLetter)
  }
}
