module.exports = {

  addPeople: function(peopleObject, betId) {
    var db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    peopleArray = [];
    for(var p in peopleObject) {
      peopleArray.push(peopleObject[p]);
    };
    //Keep user from entering id twice
    peopleArray.forEach(function(email) {
      users.update({ email: email },
        { $push: { betIds: betId }});
    });
    peopleArray.pop(); //Mystery empty string added to end
    return peopleArray;
  },

  pushParticipants: function(peopleArray, betId) {
    var db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    bets = db.get('bets');
    peopleArray.forEach(function(email) {
      users.findOne({ email: email }).then(function(user) {
        bets.update({ _id: betId },
          { $push: { participants: user.user }});
      });
    });
  },








}; // Close Module.exports
