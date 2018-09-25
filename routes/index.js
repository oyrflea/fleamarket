var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var mysql = require('mysql');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jh1502",
  database: 'fleas'
});
conn.connect();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(session({
  secret: '123456789!@#$%^&*(',
  resave: false,
  saveUninitialized: true
}));



passport.use(new LocalStrategy(
  {
    usernameField: 'id',
    passwordField: 'pwd'
  },
  function (username, password, done) {
    console.log('LocalStrategy', username, password);
    if (username === authdata.id) {
      console.lod(1);
      if (password === authdata.password) {
        console.lod(2);
        return done(null, user);
        //두번째 인자를 false가 아닌 값을 주면 true로 인식
      } else {
        console.lod(3);
        return done(null, false,
          {
            message: 'Incorrect password.'
          });
      }
    } else {
      console.lod(4);
      return done(null, false,
        {
          message: 'Incorrect username.'
        });
    }
  }
));

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
  }));


router.get('/formseller', function (req, res) {
  res.render('form_seller', { title: 'sellerform_test' });
});

router.get('/apply', function (req, res) {
  res.render('apply', { title: 'application_test' });
});

router.get('/home', function (req, res) {
  res.render('home', { title: 'home_test' });
});

router.get('/formhost', function (req, res) {
  res.render('form_host', { title: 'Express' });
});

router.get('/login', function (req, res) {
  res.render('login', { title: 'login_test' });
});

router.get('/join', function (req, res) {
  res.render('join', { title: 'Express' });
});

router.post('/join',function(req,res){
  
});

router.get('/notice', function (req, res) {
  var sql = 'SELECT * FROM notice';
  conn.query(sql, function (err, rows, fields) {
    res.render('notice', { title: 'Express', rows: rows });
  });
});

router.get('/notice/add', function (req, res) {
  var sql = 'SELECT id, title FROM notice';
  conn.query(sql, function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('form_notice', { rows: rows });
  });
});

router.post('/notice/add', function (req, res) {
  var title = req.body.title;
  var content = req.body.content;
  var writer = 'ang';
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!
  var yyyy = date.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }
  date = yyyy + '. ' + mm + '. ' + dd + '. ';
  var sql = 'INSERT INTO notice (title, content, writer, date) VALUES(?, ?, ?, ?)';
  conn.query(sql, [title, content, writer, date], function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/notice/' + rows.insertId);
    }
  });
});

router.get('/notice/:id', function (req, res) {
  var sql = 'SELECT * FROM notice';

  conn.query(sql, function (err, rows, fields) {
    var id = req.params.id;
    var sql = 'SELECT * FROM notice WHERE id=?';
    conn.query(sql, [id], function (err, row, fields) {
      if (err) {
        console.log(err);
      } else {
        // console.log(row[0]);
        res.render('noticeitem', { rows: rows, row: row[0] });
      }
    });
  });
});


router.get('/noticeitem', function (req, res, next) {
  res.render('noticeitem', { title: 'Express' });
});

router.get('/review', function (req, res, next) {
  res.render('review', { title: 'Express' });
});

router.get('/writereview', function (req, res, next) {
  res.render('form_review', { title: 'Express' });
});

router.get('/reviewitem', function (req, res, next) {
  res.render('reviewitem', { title: 'Express' });
});

router.get('/test', function (req, res, next) {
  res.render('test', { title: 'Express' });
});

router.get('/mypageseller', function (req, res) {
  res.render('mypageseller', { title: 'mypageseller_test' });
});
router.get('/mypageseller_good', function (req, res) {
  res.render('mypageseller_good', { title: 'mypageseller_good_test' });
});

router.get('/mypageseller_participate', function (req, res) {
  res.render('mypageseller_participate', { title: 'mypageseller_participate_test' });
});

router.get('/mypageseller_apply', function (req, res) {
  res.render('mypageseller_apply', { title: 'mypageseller_apply_test' });
});


router.get('/market', function (req, res) {
  res.render('market', { title: 'mypageseller_test' });
});

router.get('/seller', function (req, res) {
  res.render('seller', { title: 'mypageseller_test' });
});
router.get('/board', function (req, res) {
  res.render('board', { title: 'board_test' });
});
router.get('/setting', function (req, res) {
  res.render('setting', { title: 'setting_test' });
});
router.get('/mypagehost', function(req, res) {
  res.render('mypagehost', { title: 'mypagehost_test' });
});
router.get('/mypagehost_applier', function(req, res) {
  res.render('mypagehost_applier', { title: 'mypagehost_applier_test' });
});
router.get('/mypageuser', function(req, res) {
  res.render('mypageuser', { title: 'mypageuser_test' });
});
router.get('/mypageuser_good', function(req, res) {
  res.render('mypageuser_good', { title: 'mypageuser_good_test' });
});
router.get('/message', function(req, res) {
  res.render('message', { title: 'message_test' });
});
router.get('/form_board', function(req, res) {
  res.render('form_board', { title: 'form_board_test' });
});
module.exports = router;
