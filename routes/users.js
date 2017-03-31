const express = require('express');
const usersRouter = express.Router();
const User = require('../models/users');

usersRouter.get('/current', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.json({
      isUserAuth: true,
      username: req.user.username,
      userID: req.user._id,
    });
  } else {
    res.json({
      isUserAuth: false
    });
  }
});

usersRouter.get('/polls', function(req, res, next) {
  if (req.isAuthenticated()) {
    User.findById(
      { _id: req.user._id },
      { polls: true, _id: false },
      function(err, polls) {
        if (err) throw err;
        res.json(polls);
      }
    );
  } else {
    res.json({
      errorMessage: 'You need to login again'
    });
  }
});

usersRouter.get('/logout', function(req, res, next) {
  if (req.isAuthenticated()) {
    req.logout();
    res.json({
      logoutMessage: 'Sorry to see you go!!!'
    });
  } else {
    res.json({
      errorMessage: 'You need to login first'
    });
  }
});

module.exports = usersRouter;
