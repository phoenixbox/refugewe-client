import React from 'react/addons';
import _ from 'lodash';

let Header = React.createClass({
  propTypes: {
    displayName: React.PropTypes.string,
    email: React.PropTypes.string
  },

  render() {
    return (
      <nav className="navbar party-navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#mayk-navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/profile"></a>
          </div>
          <div className="collapse navbar-collapse" id="mayk-navbar-collapse">
            <ul className="nav navbar-nav">
              <li><a href="/account">Profile</a></li>
              <li><a href="/documentation">Advocacy</a></li>
              <li><a href="/documentation">Registration</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
})

export default Header
