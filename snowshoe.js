/**
 * snowshoe application server
 * version : 0.2
 * date : 17.DEC.2012
 */
'use strict';
var ROOTDIR = __dirname;

/**
 * Module dependencies.
 */
/* import node internal  modules */
var fs = require('fs'),
http = require('http');

/* import node external modules */
var express = require(ROOTDIR + '/std/node_modules/express'),
//resource = require(ROOTDIR + '/std/node_modules/express-resource'),
expressValidator = require(ROOTDIR + '/std/node_modules/express-validator'),
RedisStore = require(ROOTDIR + '/std/node_modules/connect-redis')(express),
opts = require(ROOTDIR + '/std/node_modules/opts'),
engine = require(ROOTDIR + '/std/node_modules/ejs-locals');

/* below is secure server
var privateKey = fs.readFileSync('etc/rockos.key').toString();
var certificate = fs.readFileSync('etc/rockos.crt').toString();
   var app = module.exports =
   express.createServer({key: privateKey, cert: certificate});
   */
  
/* define command line arguments */
opts.parse([
           {'short': 'p',
               'long': 'port',
               'description': 'HTTP port',
               'value': true,
               'required': false
           },
           {'short': 's',
               'long': 'sesstime',
               'description': 'session timeout (min)',
               'value': true,
               'required': false
           }
]);

var PORT = opts.get('port') || 3010;
var SESS = opts.get('sesstime')*60*1000 || 60*60*1000;

//var app = module.exports = express.createServer();
/* for express@v3 */
var app = express();


var auth;

/* snowshoe modules */

var lcsAp = require(ROOTDIR + '/std/ap/lcsap').create('appServer', ROOTDIR, app);
var lcsUI = require(ROOTDIR + '/std/ap/lcsui').create('appServer');
var lcsDb = require(ROOTDIR + '/std/db/lcsdb').create('appServer', './etc/db.cf');
var lcsSOCK = require(ROOTDIR + '/std/ap/lcssock').create('appServer');
/* not use untill Sqlie3
var lcsRdb = require(ROOTDIR + '/std/db/lcsrdb').create('appServer');
*/
/* Gloval Object */
global['lcsAp'] = lcsAp;
global['lcsUI'] = lcsUI;
global['lcsDb'] = lcsDb;
global['lcsSOCK'] = lcsSOCK;
/*
global['lcsRdb'] = lcsRdb;
*/
global['ROOTDIR'] = ROOTDIR;


// Configuration
/* for express@v3 */
//        app.engine('html', require('ejs').renderFile);
app.engine('ejs', engine);

app.set('views', ROOTDIR + '/src/views');
app.set('view engine', 'ejs');
app.locals({_layoutFile: false});
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
//sessionを扱うときはrouterの前にこれを書かなければならない
app.use(express.cookieParser());
app.use(express.session({secret: 'secret',
                        store: auth =
                            new RedisStore({db: 0}),
                //          cookie: {maxAge: 60 * 60 * 1000}}));
                            cookie: {maxAge: SESS}}));
/* cookie: {maxAge: 1 * 60 * 1000}})); 1 min */
app.use(app.router);
app.use(express.static(ROOTDIR + '/std/public'));

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

/* 画面プログラムの登録 */
lcsUI.config([
             {map: ROOTDIR + '/src/ini/map.json'},
             {frame: [
                 {jp: ROOTDIR + '/src/ini/i18n/jp/framenavi.json'},
                 {kr: ROOTDIR + '/src/ini/i18n/kr/framenavi.json'},
                 {en: ROOTDIR + '/src/ini/i18n/en/framenavi.json'},
                 {ch: ROOTDIR + '/src/ini/i18n/ch/framenavi.json'}
             ]},
             {smaph: [
                 {jp: ROOTDIR + '/src/ini/i18n/jp/framesmaph.json'},
                 {kr: ROOTDIR + '/src/ini/i18n/kr/framesmaph.json'},
                 {en: ROOTDIR + '/src/ini/i18n/en/framesmaph.json'},
                 {ch: ROOTDIR + '/src/ini/i18n/ch/framesmaph.json'}
             ]},
             {tags: [
                 {jp: [ROOTDIR + '/src/ini/i18n/jp/', 'pagetags']},
                 {kr: [ROOTDIR + '/src/ini/i18n/kr/', 'pagetags']},
                 {en: [ROOTDIR + '/src/ini/i18n/en/', 'pagetags']},
                 {ch: [ROOTDIR + '/src/ini/i18n/ch/', 'pagetags']}
             ]}
]);

/* ルーティング処理 */
app.get('/', lcsUI.login);
app.get('/logout', lcsUI.logout);
app.get('/scr/:id', lcsUI.doAction);
app.get('/404', lcsUI.notFound);
app.post('/scr/:id', lcsUI.doAction);
app.post('/check', lcsUI.checkUser);

// モバイル用
app.get('/mob/:id', lcsUI.doAction);
app.post('/mob/:id', lcsUI.doAction);

// Web API REST 2012-12-27
//app.get('/rest/:id', lcsUI.restAction);
app.get('/rest/:id?/:ap?', lcsUI.restAction);
app.post('/rest/:id?/:ap?', lcsUI.restAction);
app.put('/rest/:id?/:ap?', lcsUI.restAction);
app.del('/rest/:id?/:ap?', lcsUI.restAction);

//REST web API 2012-12-20 for express-resouce
//var rest = app.resource('rest', require(ROOTDIR + '/src/controller/rest/rest'), {id:'id'});


/* this is for express@v3 */
var server = http.createServer(app).listen(PORT, function() {
    lcsAp.syslog('info',
                 {'Snowshoe server(node v0.8.14) listening on port ': PORT,
                     'running mode': app.settings.env});
});

/*
 * 例外処理
 */
process.on('uncaughtException', function(error) {
    lcsAp.syslog('error', 'uncaughtException: ' + error);
    lcsAp.syslog('error', 'uncaughtException trace: ' + error.stack);
   console.log('error '+error.stack);
});

lcsSOCK.config(
             {map: ROOTDIR + '/src/ini/sockmap.json'}
);
/**
  socket.io create
  this is for express@v3 
 */
lcsSOCK.listen(server);


global['auth'] = auth;
// add 2012.06.30 takahashi
global['sck_io'] = lcsSOCK.io();


/*
 *  バックグラウンドで動く処理
 */
//require(.'./controller/mgr/mgrmon').main();
require(ROOTDIR + '/src/controller/mgr/mgrmon').main();
require(ROOTDIR + '/src/controller/mgr/mgragv').main();
require(ROOTDIR + '/src/controller/seq/seq901').sockMain();
require(ROOTDIR + '/src/controller/seq/seq902').sockMain();
require(ROOTDIR + '/src/controller/seq/seq903').sockMain();
require(ROOTDIR + '/src/controller/seq/seq904').sockMain();
//require(ROOTDIR + '/src/controller/seq/seq910').sockMain();
lcsSOCK.emitError();

