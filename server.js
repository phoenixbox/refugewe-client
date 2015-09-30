var _ = require('lodash');
var Hapi = require('hapi');
var server = new Hapi.Server();
var path = require('path');
var config = require('config');
var url = require('url');

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 3500,
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

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
          reply.redirect('/profile')
        } else {
          var viewVars = internals.viewVars(request);
          reply.view('home.html', viewVars);
        }
      }
    },
    {
      method: 'GET',
      path: '/profile',
      config: {
        auth: 'session'
      },
      handler: function (request, reply) {
        var viewVars = internals.viewVars(request);
        // Template has the client JS
        reply.view('refugewe.html', viewVars);
      }
    },
    {
      method: 'GET',
      path: '/login',
      handler: function (request, reply) {
        var viewVars = internals.viewVars(request);
        reply.view('login.html', viewVars);
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
  viewVars: function(request) {
    return request.auth.credentials ? internals.pluckAuthAttrs(request.auth.credentials.profile) : {};
  },

  pluckAuthAttrs: function(profile) {
    var authAttrs = ['access_token'];

    return _.reduce(profile, function(memo, val, key) {
      if (_.contains(authAttrs, key)) {
        memo[key] = val;
      }

      return memo;
    }, {});
  }
}

module.exports.internals = internals;
