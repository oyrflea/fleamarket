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

router.get('/review', function(req, res, next) {
  res.render('review', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express' });
});



module.exports = router;
