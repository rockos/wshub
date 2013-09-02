/**
 * wshub application server
 * version : 0.1
 * date : 18.AUG.2013
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
var express = require(ROOTDIR + '/node_modules/express'),
//resource = require(ROOTDIR + '/node_modules/express-resource'),
expressValidator = require(ROOTDIR + '/node_modules/express-validator'),
RedisStore = require(ROOTDIR + '/node_modules/connect-redis')(express),
opts = require(ROOTDIR + '/node_modules/opts'),
engine = require(ROOTDIR + '/node_modules/ejs-locals');

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

var PORT = opts.get('port') || 3015;
var SESS = opts.get('sesstime')*60*1000 || 60*60*1000;

/* for express@v3 */
var app = express();


var auth;

/* wshub modules */

var lcsAp = require(ROOTDIR + '/stdlibs/ap/lcsap').create('appServer', ROOTDIR, app);
var lcsUI = require(ROOTDIR + '/stdlibs/ap/lcsui').create('appServer');
var lcsDb = require(ROOTDIR + '/stdlibs/db/rcsdb').create('appServer', './etc/db.cf');
var lcsSOCK = require(ROOTDIR + '/stdlibs/ap/lcssock').create('appServer');
/* not use untill Sqlie3
var lcsRdb = require(ROOTDIR + '/stdlibs/db/lcsrdb').create('appServer');
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
app.use(express.static(ROOTDIR + '/stdlibs/public'));
//2013.04.08 add sny_takahashi
app.use(express.static(ROOTDIR + '/src/views/share'));

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

/* routing for desktop or tablet device */
app.get('/', lcsUI.doAction);
app.get('/index', lcsUI.doAction);
app.get('/signin', lcsUI.doAction);
app.post('/signout', lcsUI.signout);
app.get('/scr/:id', lcsUI.doAction);
app.get('/scr/:id/:sub', lcsUI.doAction);
app.post('/scr/:id/:sub', lcsUI.doAction);
app.get('/404', lcsUI.notFound);
app.post('/scr/:id', lcsUI.doAction);
app.post('/check', lcsUI.doAction);

/* routing for mobile device */
app.get('/mob/:id', lcsUI.doAction);
app.post('/mob/:id', lcsUI.doAction);


// Web API REST 8-may-2013
app.get('/v1/rest/:id/:ap/:ap2?', lcsUI.restAction);
app.post('/v1/rest/:id/:ap/:ap2?', lcsUI.restAction);


/* this is for express@v3 */
var server = http.createServer(app).listen(PORT, function() {
    lcsAp.syslog('info',
                 {'wshub server(node v0.8.14) listening on port ': PORT,
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
/*
lcsSOCK.config(
             {map: ROOTDIR + '/src/ini/sockmap.json'}
);
*/
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
/*
require(ROOTDIR + '/src/controller/mgr/mgrmon').main();
require(ROOTDIR + '/src/controller/mgr/mgragv').main();
require(ROOTDIR + '/src/controller/seq/seq901').sockMain();
require(ROOTDIR + '/src/controller/seq/seq902').sockMain();
require(ROOTDIR + '/src/controller/seq/seq903').sockMain();
require(ROOTDIR + '/src/controller/seq/seq904').sockMain();
*/
lcsSOCK.emitError();

