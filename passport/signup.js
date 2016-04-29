module.exports = function(passport,LocalStrategy,User,bCrypt,colors){
  passport.use('signup', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, email, password, done) {
      findOrCreateUser = function(){
        // find a user in Mongo with provided email
        User.findOne({'email':req.body.email},function(err, user) {
          console.log(req.body.email);
          // In case of any error return
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
          // already exists
          if (user) {
            console.log('User already exists');
            return done(null, false, 
               req.flash('message','User Already Exists'));
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.email = req.body.email;
            newUser.password = createHash(password);
            newUser.username = req.body.username;

            var clr = colors.find({name: { $ne: null }}).sort({_id:1}).limit(1);
            clr.exec(function(err, row) {
               console.log(row[0].hex);
               newUser.colorProfile = row[0].hex;

                // save the user
                newUser.save(function(err) {
                  if (err){
                    console.log('Error in Saving user: '+err);  
                    throw err;  
                  }
                  console.log('User Registration succesful');   
                  //update color
                  colors.update({ _id: row[0]._id }, { $set: { name: null }}, function(){}); 
                  req.user = newUser;
                  return done(null, newUser);
                });
            });
            
            
            
          }
        });
      };
       
      // Delay the execution of findOrCreateUser and execute 
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    }));
  
  // Generates hash using bCrypt
  var createHash = function(password){
   return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }
}