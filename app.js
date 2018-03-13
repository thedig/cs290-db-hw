var express = require("express");
var app = express();
// app.use(express.logger());

// var mysql = require('mysql');
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main', extname: '.hbs'});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

var port = process.env.PORT || 3000;
app.listen(port);

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
      context.results = "Table reset";
      console.log(context);
      res.render('home',context);
    })
  });
});

app.get('/insert', function(req,res,next) {
  console.log(req);
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`name`) VALUES (?)", [req.query.c], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    console.log(context);
    res.render('home',context);
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
