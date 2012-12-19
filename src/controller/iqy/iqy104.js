var fs = require('fs');


/**
 * 画面表示
 * @module dspWin
 * @param  {number}err, {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   30/jun/2012
 */
var dspWin = function (args, callback) {

    //Login user用
    args.posts.userid = (args.req.session.userid)?args.req.session.userid:'undefined';

    var msg = lcsAp.getMsgI18N('0');
    args.posts.mesg = msg.text;
    args.posts.mesg_lavel_color = msg.warn;

    args.res.render(args.posts.scrNo, args.posts);
    callback(null, callback);
}

/**
 * "dummy"
 * @module dmyDsp
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   30/jun/2012
 */
function dmyDsp(args, callback) {
    callback( null, args );
}

/**
 * 最新表示押下時の処理
 * @module showoDemo
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   30/jun/2012
 */
function showDemo(req, res, posts) {
    var args = {"req":req, "res":res, "posts": posts };
    var sync_pool = [];

    posts.socket_io_start = "1";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync( args,
                  [dmyDsp, 
                   dspWin ]);
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   30/jun/2012
 */
function initSend(req, res, posts) {
    var args = {"req":req, "res":res, "posts": posts };
    var sync_pool = [];

    posts.socket_io_start = "1";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync( args,
                  [dmyDsp, 
                   dspWin ]);
}

/**
 * 作業モニタ/main routine
 * @module iqy104.main
 * @param  {Object}req, {Object}res
 * @date   29/jun/2012
 */
exports.main = function(req, res, frame){

    var posts = {};
    try {
        posts = lcsAp.initPosts( req, frame );
    } catch (e) {
        lcsAp.syslog('error', {'lcsAp.initPosts': frame});
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
        return;
    }

    if( req.method=="GET" ) {
        /*GET メソッド*/
        initSend( req, res, posts );
    }else if( req.method=="POST" ){
        /*POST メソッド*/
        if ( req.body.send_iqy ) {
            showDemo(req, res, posts);
        } else {
            /*規定外のボタンです*/
            dspWin( 3, req, res, posts );
        }
    }else{
        /*規定外のメソッドタイプです*/
        dspWin( 2, req, res, posts );
    }

};
