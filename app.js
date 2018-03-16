var express = require("express");
var app = express();
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main', extname: '.hbs'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'))

var port = process.env.PORT || process.argv[2] || 3000;
app.listen(port);

// app.set('port', 4300);
// app.listen(34811);

var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";

app.get('/',function(req,res){
  res.render('home');
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    mysql.pool.query(createString, function(err){
      if (err) {
        res.send(err);
        return;
      }
      context.results = "Table reset";
      res.send(JSON.stringify(context));
    })
  });
});

app.post('/insert', function(req,res,next) {
  var context = {};
  console.log('insert:', req.body);
  console.log(req.body.lb)
  // res.send(JSON.stringify(req.body));
  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `lbs`) VALUES (?, ?, ?, ?)",
    [req.body.name, req.body.reps, req.body.weight, req.body.lbs], function(err, result){
      if(err){
        console.log('error');
        next(err);
        return;
      }
      context.results = "Inserted id " + result.insertId;
      console.log(context);
      res.send(context);
    });
});

app.get('/get-first', function(req,res,next) {
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=1", function(err, result){
    if (err){
      next(err);
      return;
    }
    context.results = result.length ? "Getting first " + result[0].name : "No data";
    res.render('show', context);
  });
});

app.get('/get-all', function(req,res,next) {
  var context = {};
  mysql.pool.query("SELECT * FROM workouts", function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send(result);
  });
});

app.get('/update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.body.id], function(err, result){
    if (err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE todo SET name=?, done=?, due=? WHERE id=? ",
        [req.body.name || curVals.name, req.body.done || curVals.done, req.body.due || curVals.due, req.body.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home',context);
      });
    }
  });
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});
