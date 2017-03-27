module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.json({
      errorMessage: 'You need to login first'
    });
  }
};
