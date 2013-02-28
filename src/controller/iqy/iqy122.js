var fs = require('fs');

/*
 *  DEMO Properties
 */
var DEMO = {};
DEMO.status = 0; /* 0:保守 1:自動 2:手動 */
DEMO.generation = []; /* メータの値 */
DEMO.generation[0] = 0;
DEMO.generation[1] = 0;
DEMO.generation[2] = 0;
DEMO.generation[3] = 0;
DEMO.accelerator = []; /* スライドバーの値 */
DEMO.accelerator[0] = 0;
DEMO.accelerator[1] = 0;
DEMO.accelerator[2] = 0;

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
    posts.scrNo = str[1] + '/scr' + str[2];

    res.render(posts.scrNo, posts);
    nextDo(null, args);
}

/**
 * 表示データセット
 * @module showData
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function showData(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    args.posts.status = DEMO.status;
    args.posts.generation = DEMO.generation;
    args.posts.accelerator = DEMO.accelerator;
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
                  showData,
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
                  showData,
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
 * メーターゲージ デモ
 * @module demoGauge01 
 * @date   2013.2.25
 */
var demoGauge01 = function(){
    var rand = Math.floor( Math.random() * DEMO.generation[3] );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[0] = DEMO.generation[1] * DEMO.generation[2] + rand;
    } else {
        DEMO.generation[0] = DEMO.generation[1] * DEMO.generation[2] - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge01", {"value": DEMO.generation[0]});
    setTimeout(demoGauge01,300);
}
var demoGauge02 = function(){
    var rand = Math.floor( Math.random() * 5 );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[1] = DEMO.accelerator[0] + rand;
    } else {
        DEMO.generation[1] = DEMO.accelerator[0] - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge02", {"value": DEMO.generation[1]});
    setTimeout(demoGauge02,300);
}
var demoGauge03 = function(){
    var rand = Math.floor( Math.random() * 5 );
    if (rand > 1) {
        rand = 0;
    }
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[2] = DEMO.accelerator[1] + rand;
    } else {
        DEMO.generation[2] = DEMO.accelerator[1] - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge03", {"value": DEMO.generation[2]});
    setTimeout(demoGauge03,300);
}
var demoGauge04 = function(){
    var rand = Math.floor( Math.random() * 10 );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[3] = DEMO.accelerator[2] + rand;
    } else {
        DEMO.generation[3] = DEMO.accelerator[2] - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge04", {"value": DEMO.generation[3]});
    setTimeout(demoGauge04,300);
}

/**
 * Web socket ルート/main routine
 * @module exports.sockMain 
 * @date   2013.2.25
 */
exports.sockMain = function(){
    lcsSOCK.io().of('/scr/122').on('connection', function(socket) {
        /*connect 正常*/
        //console.log( "connect---" + "/scr/122" );
        //lcsSOCK.io().of('/scr/122').sockets[socket.id].emit("debugz", "conn::"+socket.id+"<br>");

        /*クライアントからエミットされた*/
        socket.on("massage", function(data) {
            lcsSOCK.io().of('/scr/122').sockets[socket.id].emit("debugz", "massage::"+socket.id+"<br>");
            lcsSOCK.io().of('/scr/122').sockets[socket.id].emit("debugz", data);
        });
        socket.on("accel01", function(data) {
            DEMO.accelerator[0] = data.value;
        });
        socket.on("accel02", function(data) {
            DEMO.accelerator[1] = data.value;
        });
        socket.on("accel03", function(data) {
            DEMO.accelerator[2] = data.value;
        });
        socket.on("swChange", function(data) {
            DEMO.status = data.status;
        });

        /*クライアントからディスコネクトされた*/
        socket.on("disconnect", function(data) {
            /* ToDo : timer切ったり、シグナルイベントの終了処理 */
        });
    });
    // デモ
    demoGauge01();
    demoGauge02();
    demoGauge03();
    demoGauge04();
}

