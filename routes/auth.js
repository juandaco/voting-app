const express = require('express');
const authRouter = express.Router();
const passportGithub = require('../auth/github');
const path = require('path');

authRouter.get('/github', passportGithub.authenticate('github'));

authRouter.get(
  '/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/failure' }),
  function(req, res) {
    const popUpCloser = path.resolve('./auth/popup-closer.html');
    res.sendFile(popUpCloser);
  }
);

module.exports = authRouter;
