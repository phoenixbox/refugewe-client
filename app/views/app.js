import React from 'react/addons';
import classnames from 'classnames';
import _ from 'lodash';
import SessionStore from '../stores/session-store.js';
import SchemaStore from '../stores/schema-store.js';
import FacebookStore from '../stores/facebook-store.js'
import SessionActions from '../actions/session-actions.js';
import SchemaActions from '../actions/schema-actions.js';
import Header from './components/header.js'
import {RouteHandler} from 'react-router';

let internals = {
  getStateFromStore() {
    let user = SessionStore.getUser();
    if (_.isEmpty(user)) {
      console.log('Session Init');
      SessionActions.init();
      SchemaActions.init();
    }

    return {
      user: user,
      facebook: FacebookStore.getFacebook(),
      schema: SchemaStore.getSchema()
    }
  }
}

let App = React.createClass({

  getInitialState() {
    return internals.getStateFromStore();
  },

  componentDidMount() {
    SessionStore.addChangeListener(this._onChange);
    SchemaStore.addChangeListener(this._onChange);
    FacebookStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
    SchemaStore.removeChangeListener(this._onChange);
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
    this.setState(internals.getStateFromStore());
  }
});

export default App;
