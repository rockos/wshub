/**
 * snowshoe base library
 *
 */
var fs = require('fs');
var async = require('async');

var env = process.env.NODE_ENV || "development"
    , winston = require('winston');


/**
 * 共通ライブラリ
 *
 * @module lcsAp
 * @version 0.0.1
 * @param {String} name of caller
 * @param {string} home directory
 * @param {Object} Express server object
 */
function lcsAp(nm, dir, app) {


	/* 必要に応じて内部で使用するオブジェクトを定義する */
	var _instance
        ,_name = 'none'
        ,_logname = ''
        ,_dir = ''
        ,_app = app /* set Express server object */
        ,_cur_lang = 'jp'
        ,_args  = arguments || {};


    _instance = this;
	_name = nm || 'UnKnown';
    _dir = dir || '/home/locos/demo/snowshoe';
    _logname = _dir + '/var/log/syslog.log';
    //_logname = 'syslog.log';

    /* for lcsap.syslog */
    winston.setLevels(winston.config.syslog.levels);
    /* development環境以外では標準出力にログを出力しないようにします。
     *   例えばstagingやproductionの場合は標準出力に出しません。
     */
    if (env !== 'development') {
        winston.remove(winston.transports.Console);
    }
    /* ログをファイルに書き出すためにFile transportを追加します。 */
    winston.add(winston.transports.File, {
            /* 書きだすファイル名です。*/
            filename: _logname

                /* ログを出力する最低のログレベルです */
                , level: 'info'
                /* タイムスタンプを追加します */
                , timestamp: true
                /* JSON形式で出力する場合はtrue。文字列で出力するならfalse。 */
                , json: true
                /* ファイルの最大サイズ（バイト）。
                 * これを上回ると新しいファイルが作成されます。 
                 */
                ,maxsize: 2048
                /*
                 *残しておくファイルの数の最大値。
                 *この数を上回った場合は、古いファイルから削除されていきます。
                 *ログローテート相当の処理が可能です。
                 */
                , maxFiles: 10
                });


    process.env.ROCKOS_ROOT = _dir + '/';
    /**
     * セッション中かどうかを返す
     *
     * @method isSession
     * @param {Object} ses
     * @return {Boolean} セッション中ならtrue
     */
    lcsAp.prototype.isSession = function (ses) {
        if (ses.userid) {
            return true;
        } else {
            return false;
        }
    };

    /*
     * メッセージロギング
     *
     * @method log
     * @param {Object} msg
     */
    lcsAp.prototype.log = function () {
        var d = new Date
        ,fmtDate = ''
        ,msg = ''
        ,dmsg = ''
        ,fd
        ,month;

        month = d.getMonth()+1;

        fmtDate = d.getFullYear()+'/'+month+'/'+d.getDate()+ ' '
        fmtDate += d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+':'+d.getMilliseconds();
        if (arguments.length < 1) return;

        if (typeof exports == 'object') {
            for (var key in arguments) {
                if (typeof arguments[key] == 'object') {
                    var adt = arguments[key];
                    for (var k in adt) {
                        msg += k +':' + adt[k] + ';';
                    }
                } else {
                    msg += key +':' + arguments[key] + ';';
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                msg += arguments[i];
            }
        }

        dmsg += fmtDate + ' [' + msg + ']';

        /* open & append */
        fd = fs.openSync(_dir+'/var/log/logap', 'a');
        fs.writeSync(fd, dmsg+'\n', dmsg.length+1, 'utf-8');
        fs.closeSync(fd);
    };

    /*
     * データベース更新ログ
     *
     * @method logdb
     * @param {Object} adt
     */
    lcsAp.prototype.logdb = function (adt) {
        var d = new Date
        ,fmtDate = ''
        ,msg = ''
        ,dmsg = ''
        ,fd
        ,month;

        month = d.getMonth()+1;

        fmtDate = d.getFullYear()+'/'+month+'/'+d.getDate()+ ' '
        fmtDate += d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+':'+d.getMilliseconds();
        if (arguments.length < 1) return;

        if (typeof exports == 'object') {
            for (var key in arguments) {
                if (typeof arguments[key] == 'object') {
                    var adt = arguments[key];
                    for (var k in adt) {
                        msg += k +':' + adt[k] + ';';
                    }
                } else {
                    msg += key +':' + arguments[key] + ';';
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                msg += arguments[i];
            }
        }

        dmsg += fmtDate + ' [' + msg + ']';

        /* open & append */
        fd = fs.openSync(_dir+'/var/log/logdb', 'a');
        fs.writeSync(fd, dmsg+'\n', dmsg.length+1, 'utf-8');
        fs.closeSync(fd);
    };

    /**
     * メッセージロギング(/var/log/)
     *
     * @method log
     * @param {String} Severity
     * @param {Object} message
     * usage
     *      lcsAp.syslog('info', '懸念を表明する');
     *      lcsAp.syslog('notice', '強い懸念を表明する');
     *      lcsAp.syslog('error', '強い遺憾の意を示す');
     *      lcsAP.syslog('error', {'key':value});
     *
     */
    lcsAp.prototype.syslog = function () {

        winston.log.apply(this, arguments);
    };

    /**
     * Render用 同期処理
     *
     * @method waterfall
     * @param {Object}req, {Object}res, {Object}posts, 
     *        {[function]}funcs, {function}dsp 
     */
    lcsAp.prototype.waterfall = function ( req, res, posts, funcs, dsp ) {

        var exec_lists = [];

        for( var i=0, max=funcs.length; i < max; i++ ) {
            if( i === 0 ) {
                exec_lists[i] = async.apply(funcs[i],req,res,posts);
            } else {
                exec_lists[i] = funcs[i];
            }
        }
        async.waterfall( exec_lists, dsp );
    };

    /**
     * serialize
     *
     * @method series
     * @param {Object}req, {Object}res, {Object}posts, 
     *        {[function]}funcs, {function}dsp 
     */
    lcsAp.prototype.series = function (args, funcs, fin) {

        var exec_lists = [];

        for( var i=0, max = funcs.length; i < max; i++ ) {
                exec_lists[i] = async.apply(funcs[i], args);
            /*
            if( i === 0 ) {
                exec_lists[i] = async.apply(funcs[i], args);
            } else {
                exec_lists[i] = funcs[i];
            }
            */
        }
        async.series( exec_lists, fin);

        //        async.series(funcs, fin);
    };

    /**
     * 汎用 同期処理
     *
     * @method sync
     * @param {Object}obj, 
     *        {[function]}funcs, {function}fin 
     */
    lcsAp.prototype.sync = function (args , funcs, fin) {

        var exec_lists = [];

        for( var i=0, max=funcs.length; i < max; i++ ) {
            if( i === 0 ) {
                exec_lists[i] = async.apply(funcs[i], args);
            } else {
                exec_lists[i] = funcs[i];
            }
        }
        async.waterfall( exec_lists, fin);
    };

    /**
     * render用 JSON変数の定義
     *   JSON形式のファイルを読み込む
     * @method initialz_posts
     * @params {Object} req
     * @params {Object} posts
     */
    lcsAp.prototype.initialz_posts = function() {

        var str=[],
            posts_define_file="",
            req = arguments[0], 
            posts = arguments[1],
            scrno = "";

        str = req.url.replace(/\.+/,'').split('/');

        if( arguments.length > 2 ) {
            scrno = arguments[2];

        } else {
            scrno = str[2];
        }

        posts_define_file = "./controller/def/" + str[1] + scrno + ".json";

        posts = JSON.parse(require('fs').readFileSync(posts_define_file));

        if( !posts ) {
            lcsAp.log('not found : ', posts_define_file);
            return null;
        }
        return posts;
    };

    /**
     * i18n対応メッセージ取得
     *   JSON形式のファイルを読み込む
     * @method getMsgI18N
     * @params {String} message number 
     * @return {Object} text , warn
     */
    lcsAp.prototype.getMsgI18N = function(msgn) {
        var text, warn;
        var fnams = {"jp":"etc/imsg_jp.json",
                     "en":"etc/imsg_en.json",
                     "kr":"etc/imsg_kr.json",
                     "ch":"etc/imsg_ch.json"};

        var contents = JSON.parse(require('fs').readFileSync(process.env.ROCKOS_ROOT + fnams[_cur_lang]));

        if (!contents) {
            lcsAp.log('not found : ', fnams[_cur_lang]);
            return null;
        }
        text = contents[msgn].text;
        if (contents[msgn].kind == 'F') {
            warn = 'operationPanel_fatal';
        } else {
            warn = 'operationPanel_warning';
        }
        return {"text":text,"warn":warn};
    };

    /**
     * i18N対応
     *   表示言語を変更する。
     * @method getMsgI18N
     * @params {String} lang 'jp','en','kr'... 
     */
    lcsAp.prototype.setLangI18N = function(lang) {

        if (lang === 'jp') {
            _app.configure(function () {
                    //                    _app.set('views', process.env.LOCOS_DEV + '/views/jp');
                    _app.set('views', _dir + '/views/jp');
                });
            _cur_lang = 'jp';
        } else if (lang === 'en') {
            _app.configure(function () {
                    _app.set('views', _dir + '/views/en');
                });
            _cur_lang = 'en';
        } else if (lang === 'kr') {
            _app.configure(function () {
                    _app.set('views', _dir + '/views/kr');
                });
            _cur_lang = 'kr';
        } else if (lang == 'ch') {
            _app.configure(function () {
                    _app.set('views', _dir + '/views/ch');
                });
            _cur_lang = 'ch';
        }

    };

    /**
     * ０埋めする
     * 
     * @method zpadNum
     * @params {String} str: target strings 
     * @params {Number} len: length after padding 
     * @return {String} pad: target is filled to "0 padding" strings
     */
    lcsAp.prototype.zpadNum = function(str,len) {
        var pad = String(str);
        for( var i=0; i<len; i++ ){
            pad = "0" + pad;
        }
        return pad.slice(-1*len);
    };

    /*
     * 2回目以降はインスタンスだけ返す
     */
    lcsAp = function (nm, dir, app) {
        _name = nm || "rockos";
        return _instance;
    };


}; /* End of Constructor */

/**
 * lcsAp.create(val1, val2)
 * creates an instance
 */
lcsAp.create = function(nm, dir, app) {
	return new lcsAp(nm, dir, app);
};


/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) module.exports = lcsAp;
