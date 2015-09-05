// Native
import React from 'react/addons';
let ReactPropTypes = React.PropTypes;
import Router, {Link, Navigation} from 'react-router';

let Profile  = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  mixins: [Navigation],

  signOut() {
    SessionActions.logout();
  },

  render() {
    return (
      <div className="profile col-sm-12">
        <h3>User Profile</h3>
      </div>
    );
  }
})

module.exports = Profile;
