var _ = require('lodash');
var Hapi = require('hapi');
var server = new Hapi.Server();
var path = require('path');
var config = require('config');
var url = require('url');

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3700,
  routes: { cors: true }
});

server.views({
  engines: {
    html: require('swig')
  },
  path: path.join(__dirname, 'views'),
  isCached: process.env.NODE_ENV === 'production',
  compileOptions: {
    isPretty: true
  }
});

var plugins = [
  {
    register: require('good'),
    options: {
      opsInterval: 1000,
      reporters: [
        {
          reporter: require('good-console'),
          args: [{ log: '*', response: '*', error: '*' }]
        }
      ]
    }
  },
  require('./lib/oauth'),
  require('./lib/facebook'),
  require('./lib/api/user'),
]

server.register(plugins
  , function(err) {
  if (err) {
    throw err;
  }

  function serveApp(request, reply) {
    reply.view('layout.html', {
      token: request.auth.credentials.token
    })
  }

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        var viewVars = internals.viewVars(false, request);

        reply.view('home.html', viewVars);
      }
    },
    /**
     * Redirect to profile after oauth login so that React router picks up
     */
    {
      method: 'GET',
      path: '/profile',
      config: {
        auth: 'session'
      },
      handler: function (request, reply) {
        var viewVars = internals.viewVars(true, request);
        console.log('VIEW VARS: ', viewVars);

        reply.view('refugewe.html', viewVars);
      }
    },
    {
        method: 'GET',
        path: '/{p*}',
        handler: {
          directory: {
            path: 'public'
          }
        }
      }
  ]);

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  })
})

module.exports.server = server;


var internals = {
  viewVars: function(authed, request) {
    var authAttrs = request.auth.credentials ? internals.pluckAuthAttrs(request.auth.credentials.profile) : {};

    return _.extend({
      authed: authed
    }, authAttrs)
  },

  pluckAuthAttrs: function(profile) {
    var authAttrs = ['access_token', 'uuid'];

    return _.reduce(profile, function(memo, val, key) {
      if (_.contains(authAttrs, key)) {
        memo[key] = val;
      }

      return memo;
    }, {});
  }
}

module.exports.internals = internals;
