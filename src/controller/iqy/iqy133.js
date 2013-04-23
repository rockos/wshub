var fs = require('fs');

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

    var str = req.url.replace(/\.+/,'').split('/');
    if (str[1] == 'mob') {
        posts.scrNo = str[1] + '/mob' + str[2];
    } else {
        posts.scrNo = str[1] + '/scr' + str[2];
    }
    res.render(posts.scrNo, posts);
    nextDo(null, args);
}

/**
 * 削除押下時の処理
 * @module delPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   
 */
function delPB(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  // TODO 必要な処理をここに書いて下さい
                  dspWin],  // 正常時、画面レンダリング
                 finSync ); // 異常時、画面レンダリング
}

/**
 * 追加押下時の処理
 * @module addPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date
 */
function addPB(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  // TODO 必要な処理をここに書いて下さい
                  dspWin],  // 正常時、画面レンダリング
                 finSync ); // 異常時、画面レンダリング
}

/**
 * 表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date
 */
function iqyPB(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  // TODO 必要な処理をここに書いて下さい
                  dspWin],  // 正常時、画面レンダリング
                 finSync ); // 異常時、画面レンダリング
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date  
 */
function initSend(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  // TODO 必要な処理をここに書いて下さい
                  dspWin],  // 正常時、画面レンダリング
                 finSync ); // 異常時、画面レンダリング
}

/**
 * エラー
 * @module errDisp
 * @param  {Object}req, {Object}res, {Object}posts, {number}err
 * @date   
 */
function errDisp(req, res, posts, err) {
    var args = {"req": req, "res": res, "posts": posts};
    args.errmsg = lcsAp.getMsgI18N(err);
    finSync(args);
}

/**
 * 画面ルート/main routine
 * @module 
 * @param  {Object}req
 * @param  {Object}res
 * @param  {Object}frame
 * @date   
 */
exports.main = function(req, res, frame){
    var posts = {},
        ToF = {/* Table of function for each button */
            "GET": initSend,
            "POST":{
                "send_iqy" : iqyPB,
                "send_add" : addPB,
                "send_del" : delPB,
                "*" : errDisp
            },
            "*" : errDisp
        };

    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" );
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
        return;
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

/**
 * Web socket ルート/main routine
 * @module 
 * @param  {Object}req
 * @param  {Object}res
 * @param  {Object}frame
 * @date   
 */
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
