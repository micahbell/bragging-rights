module.exports = {

  addPeople: function(peopleObject, betId) {
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
    return peopleArray;
  },

  pushParticipants: function(peopleArray, betId) {
    var db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    bets = db.get('bets');

    peopleArray.forEach(function(email) {
      users.findOne({ email: email }).then(function(user) {
        bets.findOne({ _id: betId }).then(function(bet) {
          console.log('------------------', bet);
          console.log('******************************');
          console.log(user.user);
          bet.participants.push(user.user);
          console.log(bet.participants);
          console.log('BET AFTER', bet);
        })
      })
    })
  },








}; // Close Module.exports
