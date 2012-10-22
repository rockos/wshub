/**
 *  空棚検索
 *  @file iqy113.js
 *  @data 19.oct.2012
 */

var fs = require('fs');

var fin = function(err){
    if (err) {
        return;
    }
}

/**
 * 画面表示
 * @module dspwin
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render(posts.scrNo, posts);
    nextDo( null, args );
}

/**
 * 画面表示
 * @module setEcho
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function setEcho(args, nextDo) {
    var req = args.req, res = args.res;

    // information bar へ出力
    args.posts.mesg = "";

    nextDo( null, args );
    return;
}

/**
 * ＊＊＊テーブルリストを取得する
 * @module postData
 * @param  {Object}args, {function}nextDo
 * @date   24/jul/2012
 */
function postData(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    var step = args.posts.step;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest002.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));    
    nextDo( null, args );
    //***********************************************************************

}

/**
 * 表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function iqyPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "1";

    lcsAp.series(args,
                 [setEcho,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function initSend(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.series(args,
                 [setEcho,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 空棚画面/main routine
 * @module mop.main
 * @param  {Object}req, {Object}res
 * @date   21/jun/2012
 */
exports.main = function(req, res, frame){

    var ToF = {/* Table of function for each button */
        "GET": initSend,
        "POST":{
            "send_iqy" : iqyPB
        }
    };

    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" + "113" );
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    for( var key1 in ToF ) {
        if( key1 === req.method ) {
            if( typeof ToF[key1] === "function" ) {
                ToF[key1]( req, res, posts );
                return;
            } else if( typeof ToF[key1] === "object" ) {
                for( var key2 in ToF[key1] ) {
                    if( req.body[key2] ) {
                        if( typeof ToF[key1][key2] === "function" ) {
                            ToF[key1][key2]( req, res, posts );
                            return;
                        }
                    }
                }
                /*規定外のボタンです*/
                //dspWin( 3, req, res, posts );
                res.redirect('/');
                return;
            }
        }
    }
    /*規定外のメソッドタイプです*/
    //dspWin( 2, req, res, posts );
    res.redirect('/');
    return;

}

/**
 * 空棚画面/socket.io main routine
 * @module iqy113
 * @param  
 * @date   22/oct/2012
 */
exports.sck_main = function(){
    var lcname = sck_io.of("/scr/113");
    lcname.on("connection", function(socket) {
            console.log( "connect---" + "/scr/113" );
            debugger;
            lcname.sockets[socket.id].volatile.emit("mesg", "conn::"+socket.id+"<br>");

            /*クライアントからエミットされた*/
            socket.on("sock_iqy", function(msg) {
                    var ddd = msg;
                    lcname.sockets[socket.id].volatile.emit("mesg", ddd.d1+"<br>");
                    lcname.sockets[socket.id].volatile.emit("mesg", ddd.d2+"<br>");
                    lcname.sockets[socket.id].volatile.emit("mesg", ddd.d3+"<br>");

                });

            /*クライアントからディスコネクトされた*/
            socket.on("disconnect", function(msg) {

                });

        });
}
