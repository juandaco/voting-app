const express = require('express');
const authRouter = express.Router();
const passportGithub = require('../auth/github');

authRouter.route('/github')
  .get(passportGithub.authenticate('github'));

authRouter.get('/github/callback', passportGithub.authenticate('github', { failureRedirect: '/failure' }),
  function(req, res) {
    // Successful authentication
    res.redirect('http://localhost:3000/');
  });

module.exports = authRouter;
