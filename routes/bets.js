var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var bets = db.get('bets');
var val = require('../lib/validations.js');
var bcrypt = require('bcrypt');

router.get('/index', function(req, res, next) {
  var email = req.session.email;
  users.findOne({ email: email }).then(function(user) {
    bets.find({ _id: { $in: user.betIds }}).then(function(bets) {
      console.log(bets);
      res.render('bets/index', { bets: bets });
    });
  });
});

router.get('/new', function(req, res, next) {
  res.render('bets/new');
});

router.get('/invites', function(req, res, next) {
  res.render('bets/invites');
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
      { $push:
        { betIds: bet._id }
      })
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
  bets.update({ _id: req.params.id }, {
    name: req.body.bet,
    description: req.body.description
  });
  res.redirect('/bets/' + req.params.id);
});

router.post('/:id/delete', function(req, res, next) {
  bets.remove({ _id: req.params.id });
  res.redirect('/bets/index');
});






// users.update({ email: email },
//   { $push:
//     { bets: {
//         name: req.body.name,
//         description: req.body.description,
//         start: req.body.start_time,
//         end: req.body.end_time,
//         owner: email,
//         participants: [],
//         winners: [],
//         losers: []
//       }
//     }
//   });


module.exports = router;
