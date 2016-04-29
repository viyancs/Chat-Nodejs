var express = require('express');
var socket_io = require( "socket.io" );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var bCrypt = require('bcrypt-nodejs');

var dbConfig = require('./config/db/development.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

//load model
var users = require('./models/User');
var colors = require('./models/Colors');

// Configuring Passport
var app = express();
var io = socket_io();
app.io = io;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'beautifullsmileofgirl',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var initPassport = require('./passport/init')(passport,users); 
var signupPassport = require('./passport/signup')(passport,LocalStrategy,users,bCrypt,colors); 
var loginPassport = require('./passport/login')(passport,LocalStrategy,users,bCrypt); 
var routes = require('./routes/index')(passport); //routing

//socket.io
require('./socket.io/init')(io);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
