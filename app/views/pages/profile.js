import React from 'react/addons';
import Router, {Link, Navigation} from 'react-router';

let Profile  = React.createClass({
  mixins: [Navigation],

  propTypes: {
    user: React.PropTypes.object
  },

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

export default Profile;
