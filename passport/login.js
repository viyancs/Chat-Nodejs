// passport/login.js
module.exports = function(passport,LocalStrategy,User,bCrypt){

  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email_log_in',
      passwordField: 'password_log_in',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      console.log(req);
      findOrBack = function(){
        // check in mongo if a user with email exists or not
        User.findOne({ 'email' :  req.body.email_log_in }, 
          function(err, user) {
            // In case of any error, return using the done method
            if (err)
              return done(err);
            // email does not exist, log error & redirect back
            if (!user){
              console.log('User Not Found with email '+req.body.email_log_in);
              return done(null, false, 
                    req.flash('message', 'User Not found.'));                 
            }
            // User exists but wrong password, log the error 
            if (!isValidPassword(user, password)){
              console.log('Invalid Password');
              return done(null, false, 
                  req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from 
            // done method which will be treated like success
            req.user = user;
            return done(null, user);
          }
        );
      };
      // Delay the execution of findOrBack and execute 
      // the method in the next tick of the event loop
      process.nextTick(findOrBack);
    }
    ));

  var isValidPassword = function(user, password){
      return bCrypt.compareSync(password, user.password);
  };
}