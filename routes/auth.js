var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var bets = db.get('bets');
var val = require('../lib/validations.js');
var bcrypt = require('bcrypt');

router.post('/login', function(req, res, next) {
  var email = req.body.email.toLowerCase().trim(),
  password = req.body.password.trim();
  users.findOne({ email: email }).then(function(user) {
    if(!user) {
      res.render('index', { loginError: 'There is no account associated with the email address. Please create an account.', email: email });
    } else {
      var compare = bcrypt.compareSync(password, user.password);
      if(!compare) {
        res.render('index', { loginError: 'Invalid password.' });
      } else {
        req.session.user = req.body.user;
        req.session.email = req.body.email;
        res.redirect('/bets/index');
      };
    };
  });
});

router.post('/signup', function(req, res, next) {
  var user = req.body.user.trim(),
  email = req.body.email.toLowerCase().trim(),
  password = req.body.password.trim(),
  confirm = req.body.confirm.trim(),
  salt = bcrypt.genSaltSync(10),
  hash = bcrypt.hashSync(password, salt);
  val.existingUser(email, function(duplicate) {
    var validationErrors = val.signUpValidation(user, email, password, confirm, duplicate);
    if(validationErrors != 0) {
      res.render('index', { validationErrors: validationErrors, user: user, email: email });
    } else {
      users.insert({
        user: user,
        email: email,
        password: hash,
        betIds: []
      });
      req.session.user = req.body.user;
      req.session.email = req.body.email;
      res.redirect('/bets/index');
    };
  });
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});




module.exports = router;
