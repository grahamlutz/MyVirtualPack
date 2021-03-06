var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/*
 * User routes
 */

 /* GET all users /user */
 router.get('/', function(req, res, next) {
   User.find(function(err, gear) {
     if (err) return next(err);
     res.json(gear);
   })
 });

 /* User page */
 // /user/:id

/* POST Create User */
router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Please fill out all fields"});
  }

  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) return next(err);

    return res.json({token: user.generateJWT()})
  });
});

/* POST login page */
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }
    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
