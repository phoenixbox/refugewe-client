import React from 'react/addons';
import classnames from 'classnames';
import _ from 'lodash';
import SessionStore from '../stores/session-store.js';
import FacebookStore from '../stores/facebook-store.js'
import SessionActions from '../actions/session-actions.js';
import Header from './components/header.js'
import {RouteHandler} from 'react-router';

let internals = {
  getSessionFromStore() {
    let user = SessionStore.getUser();
    if (_.isEmpty(user)) {
      console.log('Session Init');
      SessionActions.init();
    }

    return {
      user: user,
      facebook: FacebookStore.getFacebook()
    }
  }
}

let App = React.createClass({

  getInitialState() {
    return internals.getSessionFromStore();
  },

  componentDidMount() {
    SessionStore.addChangeListener(this._onChange);
    FacebookStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
    FacebookStore.removeChangeListener(this._onChange);
  },

  render() {
    let componentProps = _.cloneDeep(this.props);

    if (!_.isEmpty(this.state.user)) {
      _.assign(componentProps, this.state);
    }

    return (
      <div className="container">
        <Header />
        <div className="row-offcanvas row-offcanvas-left">
          <RouteHandler {...componentProps} />
        </div>
      </div>
    )
  },

  _onChange() {
    console.log('Session store updated')
    this.setState(internals.getSessionFromStore());
  }
});

export default App;
