var fs = require('fs');
var upmop301 = require('./301/upmop301.js');
var iqy301 = require('./301/301iqy.js');
var cnf301 = require('./301/301cnf.js');

/**
 * doSync finally
 * @param {Object} err : contents of error-code.
 * @param {Object} args : method "err" throw on error screen and error log.
 * @remark Error is caught if 1st-parameter value defined.
 *         and rendering to error screen.
 */
function finSync(err_args) {
    if (err_args) {
        // エラー画面表示
        lcsUI.showError(err_args, err_args.errmsg);
    }
}

/**
 * 画面表示
 * @module dspWin
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render(posts.scrNo, posts);
    nextDo(null, args);
}

/**
 * キャンセル 実行
 * @module delExe
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function delExe(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "2";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  cnf301.parseData_del, /* 入力チェック*/
                  cnf301.prepareData_del, /* 前処理 */
                  upmop301.upDelExec, /* データベース削除 */

                  iqy301.setEcho,
                  iqy301.optionsDsp,
                  iqy301.postData,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * 出庫予約 実行
 * @module addExe
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addExe(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "2";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  cnf301.parseData_add, /* 入力チェック*/
                  cnf301.prepareData_add, /* 前処理 */
                  upmop301.upAddExec, /* データベース登録 */

                  iqy301.postData, /* 表示データを取得する */
                  iqy301.setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  iqy301.optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */

                 finSync );
}

/**
 * キャンセル押下時の処理
 * @module delPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function delPB(req, res, posts) {
    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "4";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  iqy301.postData, /* 表示データを取得する */
                  iqy301.setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  iqy301.optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * 出庫予約の為の準備処理
 * @module addPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addPB(req, res, posts) {
    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "3";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  iqy301.postData, /* 表示データを取得する */
                  iqy301.setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  iqy301.optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * 表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function iqyPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "2";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  iqy301.postData, /* 表示データを取得する */
                  iqy301.setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  iqy301.optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function initSend(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0"; /* 0:initial表示 */

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  iqy301.setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  iqy301.optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * エラー
 * @module errDisp
 * @param  {Object}req, {Object}res, {Object}posts, {number}err
 * @date   21/sep/2012
 */
function errDisp(req, res, posts, err) {
    var args = {"req": req, "res": res, "posts": posts};
    args.errmsg = lcsAp.getMsgI18N(err);
    finSync(args);
}

/**
 * 出庫予約画面/main routine
 * @module mop.main
 * @param  {Object}req
 * @param  {Object}res
 * @param  {Object}frame
 * @date   21/jun/2012
 */
exports.main = function(req, res, frame){

    var ToF = {/* Table of function for each button */
        "GET": initSend,
        "POST":{
            "send_iqy" : iqyPB,
            "send_add" : addPB,
            "send_del" : delPB,
            "send_add_exe" : addExe,
            "send_del_exe" : delExe,
            "send_bak1" : initSend,
            "send_bak2" : iqyPB,
            "*" : errDisp
        },
        "*" : errDisp
    };


    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" );
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    for (var key1 in ToF) {
        if (key1 === req.method) {
            if (typeof ToF[key1] === "function") {
                ToF[key1](req, res, posts);
                return;
            } else if (typeof ToF[key1] === "object") {
                for (var key2 in ToF[key1]) {
                    if (req.body[key2]) {
                        if (typeof ToF[key1][key2] === "function") {
                            ToF[key1][key2](req, res, posts);
                            return;
                        }
                    }
                }
                /*規定外のボタンです*/
                if (typeof ToF[key1]["*"] === "function") {
                    ToF[key1]["*"](req, res, posts, 3);
                    return;
                }
            }
        }
    }
    /*規定外のメソッドタイプです*/
    if (typeof ToF["*"] === "function") {
        ToF["*"](req, res, posts, 2);
        return;
    }
    res.redirect('/');
    return;
};


//exports.sck_main = function(){
//    var sock301 = sck_io.of("/scr/301");
//    //var sock301 = sck_io;
//    var posts = {};
//    sock301.on("connection", function(socket) {
//            console.log( "connect---" + "/scr/301" );
//            /*connect 正常*/
//            debugger;
//            sock301.sockets[socket.id].emit("debugz", "conn::"+socket.id+"<br>");
//            sock301.sockets[socket.id].emit("conn-ok", { "clientID" : socket.id });
//           //NG/sock301.sockets.emit("conn-ok", { "clientID" : socket.id });
//
//            /*クライアントからエミットされた*/
//            socket.on("sock_add", function(data) {
//                    sock301.sockets[socket.id].emit("debugz", "add::"+socket.id+"<br>");
//                    sock301.sockets[socket.id].emit("debugz", data);
//                    sck_addExe(sock301, socket, data, posts);
//                });
//
//            socket.on("sock_del", function(data) {
//                    sock301.sockets[socket.id].emit("debugz", "del::"+socket.id+"<br>");
//                    sock301.sockets[socket.id].emit("debugz", data);
//                    sck_delExe(sock301, socket, data, posts);
//                });
//
//            /*クライアントからディスコネクトされた*/
//            socket.on("disconnect", function(data) {
//                    /* ToDo : timer切ったり、シグナルイベントの終了処理 */
//                });
//        });
//}
