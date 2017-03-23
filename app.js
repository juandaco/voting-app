const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);


// Load Routes
const usersRouter = require('./routes/users');
const pollsRouter = require('./routes/polls');
const authRouter = require('./routes/auth');

// Initialize Express App
const app = express();
/*
  Connect to the Database
*/
const mongoURI = 'mongodb://localhost:27017/voting';
mongoose.connect(mongoURI);

/*
  Configure Middleware
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '0g93j@ll//asdfo$%!~#&*aU,xjk)(',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

// Allow Cross Origin Requests
const corsConfig = require('./corsConfig');
app.use(corsConfig);

// Use Routes
app.use('/api/users', usersRouter);
app.use('/api/polls', pollsRouter);
app.use('/auth', authRouter);

// app.get('/', function(req, res) {
//   let html = `<ul>\
//       <li><a href='/auth/github'>GitHub</a></li>\
//       <li><a href='/logout'>logout</a></li>\
//     </ul>`;

//   if (req.isAuthenticated()) {
//     html += '<p>authenticated as user:</p>';
//     html += '<pre>' + JSON.stringify(req.user, null, 4) + '</pre>';
//   }

//   res.send(html);
// });

app.get('/logout', function(req, res) {
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

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
