var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var mysql = require('mysql');
var router = express.Router();

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

router.post('/join', function (req, res) {
  var userid = req.body.userid;
  var upassword = req.body.password;
  var uname = req.body.name;
  var uphonenumber = req.body.phonenumber;
  var uemail = req.body.email;

  if (req.body.host == 'on') {
    var authority = 1;
  }
  if (req.body.seller == 'on') {
    var authority = 2;
  }
  if (req.body.user == 'on') {
    var authority = 3;
  }

  var sql = 'INSERT INTO member (userID, password, name, phoneNum, email, authority) VALUES(?,?,?,?,?,?)';
  conn.query(sql, [userid, upassword, uname, uphonenumber, uemail, authority], function (error, results, fields) {
    if (error) {
      res.status(500).send('<script type="text/javascript">alert("가입 실패! 다시 입력바랍니다."); document.location.replace("/join");</script>');
    } else {
      res.send('<script type="text/javascript">alert("가입 완료!"); document.location.replace("/login");</script>');
    }
  });
});

router.post('/login', function (req, res) {
  var Uid = req.body.Uid;
  var Upwd = req.body.Upwd;
  var sql = 'SELECT * FROM member';
  conn.query(sql, function (err, rows, fields) {
    if (err) {
      // console.log(err);
      res.status(500).send('error!!~');
    }
    else {
      for (var i = 0; i < rows.length; i++) {
        if (Uid == rows[i].userID && Upwd == rows[i].password) {
          req.session.displayAuthority = rows[i].authority;
          // console.log(req.session.displayAuthority);
          return req.session.save(function () {
            if(req.session){
              console.log(req.session);
              console.log('로그인되어있음');
           }
            res.redirect('/home');
          });
        }
      }
      res.send('<script type = "text/javascript">alert("올바른 정보가 아닙니다. 다시 입력해주세요."); document.location.replace("/login");</script>');
    }
  });
});

router.get('/logout', function (req, res) {
  if(req.session){
     console.log(req.session);
  }
  req.session.destroy();
  res.clearCookie('sid');
  res.redirect('/home');
  console.log('로그아웃');
});
router.get('/', function (req, res) {
  res.render('home');
})

router.get('/formseller', function (req, res) {
  res.render('form_seller', { title: 'sellerform_test' });
});

router.get('/apply', function (req, res) {
  res.render('apply', { title: 'application_test' });
});

router.get('/home', function (req, res) {
  // if (req.session.displayAuthority) {//로그인성공했을때
    // console.log(req.session.displayAuthority);
    // res.send('<script type="text/javascript" src="loginout.js"></script>');
    // res.send('<script type="text/javascript"> document.location.replace("/home");</script>');

  //   res.send('<script src="loginout.js"> document.location.replace("/home");</script>');
  // }
  // else {
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

// router.post('/join', function (req, res) {

// });

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

router.get('/notice/:id/delete', function (req, res) {
  var id = req.params.id;
  var sql = 'DELETE FROM notice WHERE id=?';
  conn.query(sql, [id], function (err, row, fields) {
    var sql = 'SET @count = 0';
    conn.query(sql, [id], function (err, row, fields) {
      var sql = 'UPDATE notice SET notice.`id` = @count:= @count + 1;';
      conn.query(sql, [id], function (err, row, fields) {
        var sql = 'alter table notice auto_increment=1';
        conn.query(sql, function (err, row, fields) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.redirect('/notice');
          }
        });
      });
    });
  });
});
/* 
SET @count = 0;
UPDATE `users` SET `users`.`id` = @count:= @count + 1;
ALTER TABLE `users` AUTO_INCREMENT = 1;

*/



router.get('/notice/:id/edit', function (req, res) {
  var sql = 'SELECT id, title FROM notice';
  conn.query(sql, function (err, rows, fields) {
    var id = req.params.id;
    if (id) {
      var sql = 'SELECT * FROM notice WHERE id=?';
      conn.query(sql, [id], function (err, row, fields) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('notice_edit', { rows: rows, row: row[0] });
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});

router.post('/notice/:id/edit', function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var id = req.params.id;
  var sql = 'UPDATE notice SET title=?, content=? WHERE id=?';
  conn.query(sql, [title, content, id], function (err, row, fields) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/notice/' + id);
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

router.get('/mypage', function (req, res) {
  if (req.session.displayAuthority) {
    if (req.session.displayAuthority == 1) {//로그인성공했을때
      res.render('mypagehost', { title: 'mypagehost' });
    }
    else if (req.session.displayAuthority == 2) {//로그인성공했을때
      res.render('mypageseller', { title: 'mypageseller' });
    }
    else if (req.session.displayAuthority == 3) {//로그인성공했을때
      res.render('mypageuser', { title: 'mypageuser' });;
    }
  }
  else {
    res.send('<script type = "text/javascript">alert("로그인 후 사용가능합니다.");document.location.replace("/login");</script>');
  }
});

router.get('/mypageseller', function (req, res) {
  res.render('mypageseller', { title: 'mypageseller' });
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
router.get('/mypagehost', function (req, res) {
  res.render('mypagehost', { title: 'mypagehost_test' });
});
router.get('/mypagehost_applier', function (req, res) {
  res.render('mypagehost_applier', { title: 'mypagehost_applier_test' });
});
router.get('/mypageuser', function (req, res) {
  res.render('mypageuser', { title: 'mypageuser_test' });
});
router.get('/mypageuser_good', function (req, res) {
  res.render('mypageuser_good', { title: 'mypageuser_good_test' });
});
router.get('/message', function (req, res) {
  res.render('message', { title: 'message_test' });
});
router.get('/form_board', function (req, res) {
  res.render('form_board', { title: 'form_board_test' });
});
module.exports = router;
