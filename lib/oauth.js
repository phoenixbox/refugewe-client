var _ = require('lodash');
var config = require('config');
var GITHUB_USER = 'https://api.facebook.com/user';
var Qs = require('qs');
var boom = require('boom');
var async = require('async');

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
      cookie: 'refugewe',
      password: config.COOKIE_PASSWORD,
      redirectTo: '/login',
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
          tags: ['facebook'],
          description: 'Facebook OAuth',
          handler: function(request, reply) {
            if (!request.auth.isAuthenticated) {
              return reply('Authentication failed due to: ' + request.auth.error.message);
            } else {
              console.log('FACEBOOK CREDS: ', request.auth.credentials);
            }
            request.auth.session.set(request.auth.credentials);
            var token = request.auth.credentials.token;
            var facebookProfile = request.auth.credentials.profile;

            async.waterfall([
              function(callback) {
                server.methods.getFacebookEmail(token, callback);
              },
              function(email, callback) {
                _.assign(facebookProfile, {email: email});

                server.methods.exchangeForLLT(token, callback);
              },
              function(ttl, callback) {
                // Replace short lived tokens with long lived token
                _.assign(request.auth.credentials.token, {token: ttl.token});
                // Enhance the account with ttl info
                _.assign(facebookProfile, ttl);

                server.methods.saveUserFacebookAccount(token, facebookProfile, callback);
              }
            ], function(err, user) {
              if (err) {
                // If required: trigger ask again for permissions
                reply(boom.create(404, 'Facebook Error', err));
              } else {
                console.log('WOOT USER!: ', user);
                _.extend(request.auth.credentials.profile, user);

                reply.redirect('/profile');
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

          reply.redirect('/');
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
