const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// Load Routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const pollsRouter = require('./routes/polls');

// Initialize Express App
const app = express();
/*
  Connect to the Database
*/
const mongoURI = 'mongodb://localhost:27017/voting';
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI);

/*
  Configure Middleware
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('0g93j@#GEap7890*k'));
app.use(
  session({
    secret: '0g93j@#GEap7890*k',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use('/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/polls', pollsRouter);

/*
  Serve the Single Page App
*/
// app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
