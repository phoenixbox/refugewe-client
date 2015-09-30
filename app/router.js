import React from 'react/addons';
import Router, { Route, DefaultRoute } from 'react-router';

import App from './views/app';
import Profile from './views/pages/profile';

var routes = (
  <Route handler={App}>
    <Route name="profile" handler={Profile} />
    <DefaultRoute handler={Profile} />
  </Route>
);

export default function() {
  Router.run(routes, Router.HistoryLocation, (Handler) => {
    React.render(<Handler/>, document.getElementById('refugewe'));
  });
}
