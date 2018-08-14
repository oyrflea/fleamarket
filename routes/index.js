var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/formseller', function(req, res) {
  res.render('form_seller', { title: 'sellerform_test' });
});

router.get('/apply', function(req, res) {
  res.render('apply', { title: 'application_test' });
});

router.get('/home', function(req, res) {
  res.render('home', { title: 'home_test' });
});

router.get('/formhost', function(req, res, next) {
  res.render('form_host', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login_test' });
});

router.get('/join', function(req, res, next) {
  res.render('join', { title: 'Express' });
});

router.get('/notice', function(req, res, next) {
  res.render('notice', { title: 'Express' });
});

router.get('/writenotice', function(req, res, next) {
  res.render('form_notice', { title: 'Express' });
});

router.get('/review', function(req, res, next) {
  res.render('review', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express' });
});

router.get('/mypageseller', function(req, res) {
  res.render('mypageseller', { title: 'mypageseller_test' });
});
router.get('/mypageseller_good', function(req, res) {
  res.render('mypageseller_good', { title: 'mypageseller_good_test' });
});

router.get('/mypageseller_participate', function(req, res) {
  res.render('mypageseller_participate', { title: 'mypageseller_participate_test' });
});

router.get('/mypageseller_apply', function(req, res) {
  res.render('mypageseller_apply', { title: 'mypageseller_apply_test' });
});


router.get('/market', function(req, res) {
  res.render('market', { title: 'mypageseller_test' });
});

router.get('/seller', function(req, res) {
  res.render('seller', { title: 'mypageseller_test' });
});
router.get('/board', function(req, res) {
  res.render('board', { title: 'board_test' });
});

module.exports = router;
