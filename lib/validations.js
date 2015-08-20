module.exports = {

  existingUser: function(e) {
    var db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    duplicate = 0;
    users.findOne({ email: e }).then(function(user) {
      if(user) { duplicate = 1; }
    })
    return duplicate;
  };

  signUpValidation: function(u, e, p, c) {
    var errorArray = [];
      if(u === '' || e === '' || p === '' || c === '') {
        errorArray.push('All fields must be filled in.')
      };
      if(p != c) {
        errorArray.push('Passwords do not match.');
      };
      if(p.length < 8) {
        errorArray.push('Password must be at least 8 characters in length.');
      };
  }

}


// signupValidation: function(u, e, p, c, duplicateError) {
//     var errorArray = [];
//     if(u === '' || e === '' || p === '' || c === '') {
//       errorArray.push('All fields must be filled in.')
//     }
//     if(p != c) {
//       errorArray.push('Passwords do not match.');
//     };
//     if(p.length < 8) {
//       errorArray.push('Password must be at least 8 characters in length.');
//     };
//     if(duplicateError > 0){
//       errorArray.push('There is already an account associated with that email address.');
//     };
//
//     return errorArray;
//   },
//
//   existingUser: function(e, callback) {
//     var db = require('monk')(process.env.MONGOLAB_URI);
//     var userCollection = db.get('users');
//     var errors = 0;
//     userCollection.findOne({ email: e }, function(err, user) {
//       if(user) {
//         error = 1;
//       } else {
//           error = 0;
//       };
//       callback(error);
//     });
//   },
// };