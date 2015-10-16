import React from 'react/addons';
import Router, {Link, Navigation} from 'react-router';

let FacebookProfile  = React.createClass({

  propTypes: {
    username: React.PropTypes.string,
    display_name: React.PropTypes.string,
    photo_url: React.PropTypes.string
  },

  profilePhoto() {
    if (this.props.photo_url) {
      return <img src={`${this.props.photo_url}`} />
    } else {
      return ''
    }
  },

  render() {
    return (
      <div>
        <ul>
          <li>{this.props.username}</li>
          <li>{this.props.display_name}</li>
          <li>{this.profilePhoto()}</li>
        </ul>
      </div>
    );
  }
})

export default FacebookProfile;
