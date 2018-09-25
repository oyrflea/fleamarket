var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var mysql = require('mysql');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var MySQLStore = require('express-mysql-session')(session);//session mysql 스토어를 위해 사용
var bkfd2Password = require("pbkdf2-password");//pbkdf2-password 모듈 사용
var hasher = bkfd2Password();

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "wldms1404",
  database: 'fleas'
});
conn.connect();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(session({
  secret: '123456789!@#$%^&*(',
  resave: false,
  saveUninitialized: true
}));

router.use(passport.initialize());//passport 초기화
router.use(passport.session());//passport 인증 작업시 필요 이것은 세션을 사용하기 위한 윗 router.use(session)뒤에 써야한다


router.get('/logout', function (req, res) {
  req.logout();//passportjs에 있는 기능
  req.session.save(function () {//세션작업이 끝난상태에서 안전하게 home페이지로 이동
    req.session.destroy();
    res.redirect('/login');
  });
});

router.get('/login', function (req, res) {
  //console.log(req.user);
  //passportjs의 세션을 이용하는게 바람직함
  if (req.user && req.user.id) {//req객체에 user가 생성되었고 값이 있으면 로그인 성공
    res.render('home', { title: 'home', id: req.user.name } );
  } else {//값이 없으면 로그인에 실패 혹은 로그인 안한사람
    res.render('login', { title: 'login' });
  }
});

router.post('/join', function (req, res) {
  hasher({ password: req.body.password }, function (err, pass, hash) {
    var user = {
      id: req.body.id,
      name: req.body.name,
      password: hash,//hash로 대체함
      email: req.body.email,
      phone: req.body.phonenumber
    };
    if (req.body.Seller == 'on')
    { var Seller = 1;
      var Host = 0;
      var User = 0;
     }
    if (req.body.Host == 'on')
    { var Seller = 0;
      var Host = 1;
      var User = 0;
     }
     if (req.body.User == 'on')
    { var Seller = 0;
      var Host = 0;
      var User = 1;
     }

    var sql = 'INSERT INTO users SET ?';
    db.query(sql, user, function (err, results) {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        //회원가입후 바로 로그인 하기 위한 코드임
        req.login(user, function (err) {//회원가입이 되고 바로 동시에 로그인 하기 위함
          req.session.save(function () {
            res.redirect('/login');
            res.send('<script type="text/javascript">alert("가입 완료!"); document.location.replace("/login");</script>');
          });
        });
      }
    });//두번째에 user를 주면 알아서 user_id = ~~ 등으로 들어감
  });
});

// passport.use(new LocalStrategy(
//   {
//     usernameField: 'id',
//     passwordField: 'pwd'
//   },
//   function (username, password, done) {
//     console.log('LocalStrategy', username, password);
//     if (username === authdata.id) {
//       console.lod(1);
//       if (password === authdata.password) {
//         console.lod(2);
//         return done(null, user);
//         //두번째 인자를 false가 아닌 값을 주면 true로 인식
//       } else {
//         console.lod(3);
//         return done(null, false,
//           {
//             message: 'Incorrect password.'
//           });
//       }
//     } else {
//       console.lod(4);
//       return done(null, false,
//         {
//           message: 'Incorrect username.'
//         });
//     }
//   }
// ));

//done(null, user)가 호출되면 이게 호출됨 여기의 user는 아래 콜백의 user임
passport.serializeUser(function (user, done) {
  // console.log('serializeUser', user);
  // console.log('@@@@@@@@@@@@@@@@@@@@');
  done(null, user.id);//고유의 id값을 넘겨줘야함 유저를 찾는데 사용함 이 데이터는 세션에 저장됨
});

passport.deserializeUser(function (id, done) {
  // console.log('deserializeUser', id);
  var sql = 'SELECT * FROM users WHERE id=?';
  db.query(sql, [id], function (err, results) {
    if (err) {
      console.log(err);
      done('There is no user');
    } else {
      // console.log(results);
      done(null, results[0]);
    }
  });
});


//미들웨어부분
passport.use(new LocalStrategy(
  function (username, password, done) {//여기서 실제 사용자가 맞는지 인증하는 부분을 수행
    var uname = username;//POST방식으로 보낸 값을 가져옴
    var pwd = password;
    var sql = 'SELECT * FROM users WHERE id=?';
    db.query(sql, [uname], function (err, results) {
      // console.log(results);
      if (err) {
        return done('There is no user');
      }//if문
      var user = results[0];//쿼리된 값 1개를 가져와서
      return hasher({ password: pwd}, function (err, pass, hash) {
        if (hash === user.password) {//저장된 해쉬값과 만든 해쉬값이 같으면 인증 성공
          //console.log('localstrategy', user);
          done(null, user);//로그인 성공을 의미 serializeUser 호출 윗 파라미터의 done이 아니다
        } else {
          done(null, false);//로그인 실패를 의미 message항목은 failureFlash가 true일때만 씀
        }//if문 종료
      });//hasher 종료
    });//query문 종료
  }));//use문 종료

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: false
  }));

  
router.post('/login', function (req, res) {
  var sql = 'SELECT * FROM users WHERE id=?';
  db.query(sql, [req.body.ID], function (err, results) {
    if (err) {
      console.log(err);
      done('There is no user');
    } else {
      // console.log(results);
      done(null, results[0]);
    }
  });
});

router.get('/login/:id', function (req, res) {
  var sql = 'SELECT * FROM users WHERE id=?';
  db.query(sql, [req.params.id], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500);
    }
    else {
      if (result.length == 0) {
        res.send(true);
      }
      else {
        res.send(false);
        res.send('<script type = "text/javascript">alert("올바른 정보가 아닙니다.");</script>');
      }
    }
  });
});


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

router.get('/writenotice', function (req, res) {
  res.render('form_notice', { title: 'Express' });
});

router.post('/writenotice', function (req, res) {
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
      res.redirect('/notice');
    }
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
  if (req.session.seller==1) {//로그인성공했을때
    res.redirect('/mypageseller');
  } else {
    res.render('login', { title: 'mypageseller_test' });
  res.send('<script type = "text/javascript">alert("로그인 입력 바랍니다.");</script>');
  }
  
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
