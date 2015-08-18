var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var bets = db.get('bets');

router.get('/index', function(req, res, next) {
  bets.find({}).then(function(bets) {
    res.render('bets/index', { bets: bets });
  })
})

router.get('/new', function(req, res, next) {
  res.render('bets/new');
});

router.post('/create', function(req, res, next) {
  bets.insert({ name: req.body.bet, description: req.body.description });
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









module.exports = router;
