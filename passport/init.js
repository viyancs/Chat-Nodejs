module.exports = function(passport,User){
	passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});
	 
	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}