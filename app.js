require('dotenv').config();
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

/*
  Load Routes
*/
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const pollsRouter = require('./routes/polls');

/*
  Initialize Express App
*/
const app = express();

/*
  Connect to the Database
*/
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/voting';
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI);

/*
  Configure Middleware
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
  Serve the Single Page App in Production only
*/
if (process.env.NODE_ENV === 'production') {
  // app.use(favicon(path.join(__dirname, 'client/build', 'favicon.ico')));
  app.use(express.static('./client/build'));
}

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

const port = process.env.PORT || 3001;
app.listen(port, function listening() {
  console.log('Listening on %d', port);
});
