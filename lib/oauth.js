var _ = require('lodash');
var config = require('config');
var GITHUB_USER = 'https://api.facebook.com/user';
var facebook = require('./utils/facebook.js')
var Qs = require('qs');

//   auth: 'https://www.facebook.com/v2.3/dialog/oauth',

var facebookConfig = {
  protocol: 'oauth2',
  auth: 'https://www.facebook.com/v2.3/dialog/oauth',
  token: 'https://graph.facebook.com/v2.3/oauth/access_token',
  scope: [
    // Default - dont require review
    'public_profile',
    'user_friends',
    'email',
    // Extended - require review
    'user_about_me',
    'user_actions.news',
    'user_actions.video',
    'user_birthday',
    'user_education_history',
    'user_events',
    'user_hometown',
    'user_location',
    'user_managed_groups',
    'user_photos',
    'user_posts',
    'user_videos',
    'user_work_history',
    'read_custom_friendlists',
    'publish_pages',
    'manage_pages',
    'publish_actions',
    'rsvp_event'
  ],
  scopeSeparator: ',',
  headers: { 'User-Agent': 'hapi-bell-facebook' },
  profile: function (credentials, params, get, callback) {
    get('https://graph.facebook.com/v2.4/me', null, function (profile) {
      console.log('PROFILE RESULT: ', profile);

      credentials.profile = {
          id: profile.id,
          username: profile.login,
          displayName: profile.displayName,
          name: profile.name,
          email: profile.email,
          raw: profile.raw
      };

      return callback();
    });
  }
};

exports.register = function(server, options, next) {
  server.register([
    require('hapi-auth-cookie'),
    require('bell')
  ], function(err) {
    if (err) {
      throw err;
    }

    var isSecure = process.env.NODE_ENV === 'production';

    server.auth.strategy('session', 'cookie', {
      cookie: 'refugeWe',
      password: config.COOKIE_PASSWORD,
      redirectTo: '/auth/facebook',
      isSecure: isSecure,
      ttl: 31540000000
    });

    server.auth.strategy('facebook', 'bell', {
      provider: facebookConfig,
      password: config.FACEBOOK_COOKIE_PASSWORD,
      isSecure: false,
      clientId: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET
    });

    server.route([
      {
        method: ['GET', 'POST'],
        path: '/auth/facebook',
        config: {
          auth: {
            strategy: 'facebook'
          },
          handler: function(request, reply) {
            if (!request.auth.isAuthenticated) {
              return reply('Authentication failed due to: ' + request.auth.error.message);
            } else {
              console.log('FACEBOOK AUTH SUCCESSFUL!');
            }
            request.auth.session.set(request.auth.credentials);

            console.log('FACEBOOK CREDS: ', request.auth.credentials);
            var token = request.auth.credentials.token;
            var facebookAccount = request.auth.credentials.profile;

            facebook.getEmail(token).end(function(err, resp) {
              if (err) {
                console.log('FB EMAIL FETCH: ', err);
                // Trigger a redirect to ask for permissions again
              } else {
                var profile = _.assign(facebookAccount, {email: resp.text.email });
                server.methods.saveUserFacebookAccount(token, profile, function(err, user) {
                  /* Body Shape
                    access_token: '',
                    uuid: ''
                  */
                  if (err) {
                    return reply('Error saving facebook to API');
                  }
                  _.extend(request.auth.credentials.profile, user);

                  reply.redirect('/profile');
                });
              }
            })
          }
        }
      },
      {
        method: 'GET',
        path: '/logout',
        handler: function(request, reply) {
          request.auth.session.clear();

          if (request.query.source === 'client') {
            reply('ok')
          } else {
            reply.redirect('/');
          }
        }
      }
    ]);

    next();
  });
};

exports.register.attributes = {
  name: 'oauth',
  version: '0.0.1'
};
