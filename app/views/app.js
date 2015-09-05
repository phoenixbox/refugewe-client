import React from 'react/addons';
import classnames from 'classnames';
import _ from 'lodash';
import SessionStore from '../stores/session-store.js';
import SessionActions from '../actions/session-actions.js';

let internals = {
  getSessionFromStore() {
    let user = SessionStore.getUser();
    if (_.isEmpty(user)) {
      console.log('Session Init');
      SessionActions.init();
    }

    return {
      user: user,
      facebook: SessionStore.getFacebook()
    }
  }
}

let App = React.createClass({

  getInitialState() {
    return internals.getSessionFromStore();
  },

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
  },

  render: function() {
    let componentProps = _.cloneDeep(this.props);

    if (!_.isEmpty(this.state.user)) {
      _.assign(componentProps, this.state);
    }

    return (
      <RouteHandler {...componentProps} />
    )
  },

  /*
    Event handler for 'change' events coming from the StoresStore
  */
  _onChange: function() {
    console.log('Session store updated')
    this.setState(internals.getSessionFromStore());
  }
});

export default App;
