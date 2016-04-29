var express = require('express');
var router = express.Router();

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/chat',
    failureRedirect: '/',
    failureFlash : true 
  }));

  /* GET chat page. */
  router.get('/chat', isAuthenticated,function(req, res) {
    // Display the Login page with any flash message, if any
    console.log(req.user);
    res.render('chat', { message: req.flash('message'),username:req.user.username,color:req.user.colorProfile });
  });
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('index',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/chat',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // As with any middleware it is quintessential to call next()
  // if the user is authenticated
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }
 
  return router;
}
