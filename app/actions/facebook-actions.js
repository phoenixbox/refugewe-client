import AppDispatcher from '../dispatchers/dispatcher';
import FacebookConstants from '../constants/facebook-constants';

module.exports = {
  init(facebook) {
    AppDispatcher.dispatch({
      type: FacebookConstants.INIT,
      facebook
    })
  }
}
