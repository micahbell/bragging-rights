module.exports = {

  addPeople: function(peopleObject, betId) {
    // console.log('************BET ID', betId);
    var db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    peopleArray = [];
    for(var p in peopleObject) {
      peopleArray.push(peopleObject[p]);
    };

    peopleArray.forEach(function(email) {
      users.update({ email: email },
        { $push:
          { betIds: betId }
        })
    });
  },








}; // Close Module.exports
