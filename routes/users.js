const express = require('express');
const usersRouter = express.Router();
const User = require('../models/users');

// For Admin only
usersRouter.get('/current', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.json({
      isUserAuth: true,
      username: req.user.username
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

module.exports = usersRouter;
