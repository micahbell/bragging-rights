var express = require('express'),
router = express.Router(),
db = require('monk')(process.env.MONGOLAB_URI),
users = db.get('users'),
bets = db.get('bets'),
val = require('../lib/validations.js'),
dbFunctions = require('../lib/database.js'),
bcrypt = require('bcrypt');


router.get('/index', function(req, res, next) {
  var email = req.session.email;
  users.findOne({ email: email }).then(function(user) {
    bets.find({ _id: { $in: user.betIds }}).then(function(bets) {
      res.render('bets/index', { bets: bets });
    });
  });
});

router.get('/new', function(req, res, next) {
  res.render('bets/new');
});

router.post('/create', function(req, res, next) {
  var email = req.session.email;
  bets.insert({
    name: req.body.name,
    description: req.body.description,
    start: req.body.start_time,
    end: req.body.end_time,
    owner: email,
    participants: [],
    winners: [],
    losers: []
  }).then(function(bet) {
    users.update({ email: email },
      { $push: { betIds: bet._id }});
    });
  res.redirect('/bets/index');
});

router.get('/:id', function(req, res, next) {
  bets.findOne({ _id: req.params.id }).then(function(bet) {
    res.render('bets/show', { bet: bet });
  });
});

router.get('/:id/edit', function(req, res, next) {
  bets.findOne({ _id: req.params.id }).then(function(bet) {
    res.render('bets/edit', { bet: bet });
  });
});

router.post('/:id/update', function(req, res, next)  {
  bets.update({ _id: req.params.id },
    {
      name: req.body.name,
      description: req.body.description,
      start: req.body.start_time,
      end: req.body.end_time,
      winners: [],
      losers: []
    })
  res.redirect('/bets/' + req.params.id);
});

router.get('/:id/add-people', function(req, res, next) {
  res.render('bets/add-people', { bet: req.params.id });
});

router.post('/:id/add-people', function(req, res, next) {
  var peopleObject = req.body,
  betId = bets.id(req.params.id);

  var peopleArray = dbFunctions.addPeople(peopleObject, betId);
  dbFunctions.pushParticipants(peopleArray, betId);
  res.redirect('/bets/index');
});

router.post('/:id/delete', function(req, res, next) {
  bets.remove({ _id: req.params.id });
  res.redirect('/bets/index');
});





module.exports = router;
