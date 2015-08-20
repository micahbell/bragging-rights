module.exports = {

  signUpValidation: function(u, e, p, c, d) {
    var errorArray = [];
    if(u === '' || e === '' || p === '' || c === '') {
      errorArray.push('All fields must be filled in.')
    };
    if(p != c) {
      errorArray.push('Passwords do not match.');
    };
    if(p.length < 2) {
      errorArray.push('Password must be at least 8 characters in length.');
    };
    if(d != 0) {
      errorArray.push('There is already an account associated with that email address.');
    };
    return errorArray;
  },

  existingUser: function(e, cb) {
    var db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    duplicate = 0;
    users.findOne({ email: e }).then(function(user) {
      if(user) { duplicate = 1; };
      cb(duplicate);
    });
  },



};
