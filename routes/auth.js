const express = require('express');
const authRouter = express.Router();
const passportGithub = require('../auth/github');
const passportTwitter = require('../auth/twitter');
const path = require('path');

/*
  Github
*/
authRouter.get(
  '/github',
  passportGithub.authenticate('github', { session: true })
);

authRouter.get(
  '/github/callback',
  passportGithub.authenticate('github'),
  function(req, res) {
    if (req.user) {
      const popUpCloser = path.resolve('./auth/popup-closer.html');
      res.sendFile(popUpCloser);
    } else {
      res.json({
        message: 'Not users found',
      });
    }
  }
);

/*
  Twitter
*/
authRouter.get('/twitter', passportTwitter.authenticate('twitter'));

authRouter.get(
  '/twitter/callback',
  passportTwitter.authenticate('twitter'),
  function(req, res) {
    if (req.user) {
      const popUpCloser = path.resolve('./auth/popup-closer.html');
      res.sendFile(popUpCloser);
    } else {
      res.json({
        message: 'Not users found',
      });
    }
  }
);

module.exports = authRouter;
