/**
 * snowshoe application server
 * version : 0.2
 * date : 3.sep.2012
 */

/**
 * Module dependencies.
 */
'use strict';
var express = require('express'),
expressValidator = require('express-validator'),
rootDir = __dirname,
RedisStore = require('connect-redis')(express),
opts = require('opts'),
fs = require('fs'),
engine = require('ejs-locals'),
http = require('http');

/* */
var privateKey = fs.readFileSync('etc/rockos.key').toString();
var certificate = fs.readFileSync('etc/rockos.crt').toString();

/* below is secure server
   var app = module.exports =
   express.createServer({key: privateKey, cert: certificate});
   */

//var app = module.exports = express.createServer();
/* for express@v3 */
var app = express();


var auth;

/* snowshoe modules */

var lcsAp = require('./lib/ap/lcsap').create('appServer', rootDir, app);
var lcsUI = require('./lib/ap/lcsui').create('appServer');
var lcsDb = require('./lib/db/lcsdb').create('appServer', './etc/db.cf');

/* Gloval Object */
global['lcsAp'] = lcsAp;
global['lcsUI'] = lcsUI;
global['lcsDb'] = lcsDb;


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

// Configuration
/* for express@v3 */
//        app.engine('html', require('ejs').renderFile);
app.engine('ejs', engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.locals({_layoutFile: false});
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
//sessionを扱うときはrouterの前にこれを書かなければならない
app.use(express.cookieParser());
app.use(express.session({secret: 'secret',
                        store: auth =
                            new RedisStore({db: 0}), /* default db number 0 */
                //          cookie: {maxAge: 60 * 60 * 1000}}));
                            cookie: {maxAge: SESS}}));
/* cookie: {maxAge: 1 * 60 * 1000}})); 1 min */
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

/* 画面プログラムの登録 */
lcsUI.config([
             {map: './ini/map.json'},
             {frame: [
                 {jp: './ini/scr/jp/framenavi.json'},
                 {kr: './ini/scr/kr/framenavi.json'},
                 {en: './ini/scr/en/framenavi.json'},
                 {ch: './ini/scr/ch/framenavi.json'}
             ]},
             {tags: [
                 {jp: './ini/scr/jp/pagetags.json'},
                 {kr: './ini/scr/kr/pagetags.json'},
                 {en: './ini/scr/en/pagetags.json'},
                 {ch: './ini/scr/ch/pagetags.json'}
             ]}
]);

/* ルーティング処理 */
app.get('/', lcsUI.login);
app.get('/logout', lcsUI.logout);
app.get('/scr/:id', lcsUI.doAction);
app.get('/404', lcsUI.notFound);
app.post('/scr/:id', lcsUI.doAction);
app.post('/check', lcsUI.checkUser);



/* this is for express@v3 */
var server = http.createServer(app).listen(PORT, function() {
    lcsAp.syslog('info',
                 {'Somali server(node v0.8.11) listening on port ': PORT,
                     'running mode': app.settings.env});
});

/*
 * 例外処理
 */
process.on('uncaughtException', function(error) {
    lcsAp.syslog('error', 'uncaughtException: ' + error);
    lcsAp.syslog('error', 'uncaughtException trace: ' + error.stack);
});


/* this is for express@v3 */
var socketio = require('socket.io').listen(server);
socketio.configure('production', function() {
        socketio.set('log level', 1);
    });
socketio.configure('development', function() {
        socketio.set('log level', 2);
    });
socketio.configure('degub', function() {
        socketio.set('log level', 2);
    });


global['auth'] = auth;
// add 2012.06.30 takahashi
global['sck_io'] = socketio;


/*
 *  バックグラウンドで動く処理
 *  add 2012.06.30 takahashi
 *  ＊mapに乗せられるかな？
 */
require('./controller/mgr/mgrmon').main();
require('./controller/mgr/mgragv').main();
require('./controller/iqy/iqy113').sck_main();

