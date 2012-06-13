/*
 * first commit 2012.6.8 aono
 */
/**
 * Module dependencies.
 */
'use strict';
var express = require('express'), routes = require('./routes'),
controller = require('./controller/controller'),
RedisStore = require('connect-redis')(express),
mapRouter = require('./mapRouter'),
routesDir = __dirname + '/controller';

// 'GET  /' : 'root:index' はこれと同じ
// var root = require('./routes/root');
// app.get('/', root.index);
// オリジナル https://gist.github.com/1354601
var routesMap = {
    'GET  /'      : 'controller:index'
  , 'GET  /str' : 'controller:getScr'
  , 'GET  /logout' : 'controller:logout'
  , 'POST /scr' : 'controller:postScr'
  , 'POST /check' : 'controller:checkUser'
};


var app = module.exports = express.createServer();
var auth;
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

// Routing
app.get('/', controller.login);
app.get('/logout', controller.logout);
app.get('/scr/:id', controller.getScr);
/* app.get('/menu', routes.index);
*/
app.get('/404', routes.notFound);


app.post('/scr/:id', controller.postScr);
app.post('/check', controller.checkUser);


/*
app.mapRouter(routesMap, routesDir);
*/
app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// mysql
var mysql = require('mysql');
var mysqlConfig = {'host':'localhost', 'user':'locos', 'password':'land0522', 'database':'pigmo'};
var mysqlClient = mysql.createClient(mysqlConfig);
global['client'] = mysqlClient;

global['auth'] = auth;
