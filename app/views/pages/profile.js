import React from 'react/addons';
import Router, {Link, Navigation} from 'react-router';
import FacebookProfile from './facebook-profile';
import User from '../../models/user';
import t from 'tcomb-form';
let Form = t.form.Form;

let Profile  = React.createClass({
  mixins: [Navigation],

  propTypes: {
    user: React.PropTypes.object
  },

  save() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    // if validation fails, value will be null
    if (value) {
      // value here is an instance of Person
      console.log(value);
    }
  },

  render() {
    // <Form ref="form" type={User}/>
    // <button onClick={this.save}>Save</button>
    
    return (
      <div>
        <FacebookProfile {...this.props.facebook} />
      </div>
    );
  }
})

export default Profile;
