const express = require('express');
const usersRouter = express.Router();

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

module.exports = usersRouter;
