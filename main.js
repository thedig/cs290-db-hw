var express = require("express");
var app = express();
app.use(express.logger());

// var mysql = require('mysql');
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main', extname: '.hbs'});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

var port = process.env.PORT || 3000;
app.listen(port);
