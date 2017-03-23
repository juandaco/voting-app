require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../models/users');
const passportUserSetup = require('./passportUserSetup');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      const searchQuery = {
        githubID: profile.id
      };

      const updates = {
        username: profile.username,
        name: profile.displayName,
        githubID: profile.id
      };

      const options = {
        upsert: true
      };

      // update the user if s/he exists or add a new user
      User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
        if (err) {
          return done(err);
        } else {
          return done(null, user);
        }
      });
    }
  )
);

// serialize user into the session
passportUserSetup();

module.exports = passport;
