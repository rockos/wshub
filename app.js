/**
 * first commit 2012.6.8 aono
 */
/**
 * Module dependencies.
 */
'use strict';
var express = require('express'),
    routes = require('./routes'),
    RedisStore = require('connect-redis')(express),
    mapRouter = require('./mapRouter'),
    routesDir = __dirname + '/controller';



var app = module.exports = express.createServer();
var auth;

var lcsUI = require('./lib/ap/lcsui').create('lcsUI');

// Configuration
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //sessionを扱うときはrouterの前にこれを書かなければならない
  app.use(express.cookieParser());
  app.use(express.session({secret: "secret",
		  store: auth = new RedisStore(),
		  cookie: {maxAge: 60 * 60 * 1000}}));
  /*		  cookie: {maxAge: 1 * 60 * 1000}})); 1 min */
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/* 画面プログラムの登録 */
lcsUI.config('./controller/map.json');

// Routing
app.get('/', lcsUI.login);
app.get('/logout', lcsUI.logout);
app.get('/scr/:id', lcsUI.doAction);
app.get('/404', lcsUI.notFound);
app.post('/scr/:id', lcsUI.doAction);
app.post('/check', lcsUI.checkUser);


app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// mysql
var mysql = require('mysql');
var mysqlConfig = {'host':'localhost', 'user':'locos', 'password':'land0522', 'database':'pigmo'};
var mysqlClient = mysql.createClient(mysqlConfig);

/*
 * lcsUIで管理する。
 */
global['client'] = mysqlClient;
global['auth'] = auth;
