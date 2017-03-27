const express = require('express');
const authRouter = express.Router();
const passportGithub = require('../auth/github');
const path = require('path');

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

module.exports = authRouter;
