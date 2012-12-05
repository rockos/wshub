'use strict';
var fs = require('fs');

/*デモ用グローバル*/
var Demo = {"conn":0,"port":""};
var SendReg;
/*レジスタのスタート/エンド 実際には.confファイルにもつ*/
var RECV_START_REG = 0,
    RECV_END_REG = 199;
/*レジスタのスタート/エンド 実際には.confファイルにもつ*/
var SEND_START_REG = 1000,
    SEND_END_REG = 1199;

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
    res.render(posts.scrNo, posts);
    nextDo(null, args);
}

/**
 * トップへ戻る
 * @module dspEnd
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspEnd(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    res.redirect('/');
    nextDo(null, args);
}

/**
 *  デモ 送信レジスタのメモリを初期化する
 */
var demoInitsendreg = function() {
    if (typeof SendReg !== 'object') {
        SendReg = new Object();
    }
    for (var i = SEND_START_REG; i <= SEND_END_REG; i++) {
        var dreg_name = 'D' + ('0000' + i).slice(-4);
        var set_flag = 0;
        for (var key in SendReg) {
            if (key == dreg_name) {
                /* 既に設定済み */
                set_flag = 1;
                break;
            }
        }
        if (!set_flag) {
            SendReg[dreg_name] = 0;
        }
    }
}

/**
 *  デモ heartbeat
 */
var D0000 = 0;
var demoHeartbeat = function() {
    if (Demo.conn == 9) {
        D0000 = (D0000+1)%2;
        lcsSOCK.io().of('/scr/901').volatile.emit('Heartbeat',{"D0000":D0000});
    }
    setTimeout(demoHeartbeat,300);
}

/**
 *  デモ regChange
 */

var demoRegchange = function() {
    var __file = './ini/data/seq901-test1.json';
    var prevReg = JSON.parse(require('fs').readFileSync(__file));

    require('fs').watchFile(__file, function( curr, prev ) {
            var nowReg = JSON.parse(require('fs').readFileSync(__file));
            for (var key in prevReg) {
            if (prevReg[key] != nowReg[key]) {
            lcsSOCK.io().of('/scr/901').volatile.emit('regChange',
                {"reg":key,
                "val":nowReg[key]});
            }
            }
            prevReg = nowReg;
            });
}
function rxplc() {
    var curVal = '', prvVal = '';
    var regVal = '', regKey = '';
    lcsRdb.hget('h_plc:cur', 'r01', function(err, curVal) {
             if (err) {
                 lcsAp.syslog('Error: ', err);
                 return;
             }
             for (var i = 0, k = 0; i < 20; i++, k += 4) {
                 regKey = 'D' + ('0000' + i).slice(-4); 
                 regVal = curVal.slice(k, k+4);
                 //regVal = i + 1;
                 lcsSOCK.io().of('/scr/901').volatile.emit('regChange',
                                                           {"reg":regKey,
                                                               "val":regVal});
             }
             setTimeout(rxplc, 300);
            });
};
/**
 *  デモデータ
 */
var demoData_recv = function(args, nextDo) {
    var recv = new Array(),
    start10,
    end10,
    mod10;

    var dmyData = JSON.parse(require('fs').readFileSync('./ini/data/seq901-test1.json'));

    mod10 = RECV_START_REG % 10;
    start10 = (RECV_START_REG - mod10) / 10;
    mod10 = RECV_END_REG % 10;
    end10 = (RECV_END_REG - mod10) / 10;

    var reg = RECV_START_REG;
    for (var i = 0, imax = end10-start10; i <= imax; i++) {
        recv[i] = new Object();
        recv[i].Dreg10 = start10 + i;
        recv[i].Dreg1 = new Array(10);
        for (var j = 0, jmax = 10; j < jmax; j++) {
            var target = ((start10 + i) * 10) + j;
            if (target < RECV_START_REG) {
                /* 範囲外のレジスター */
                recv[i].Dreg1[j] = 0;
                continue;
            }
            if (target > RECV_END_REG) {
                /* 範囲外のレジスター */
                recv[i].Dreg1[j] = 0;
                continue;
            }
            /* デモなので適当な値を入れる */
            //recv[i].Dreg1[j] = Math.floor( Math.random() * 65534 );
            recv[i].Dreg1[j] = 0;
            for (var key in dmyData) {
                if (key.substr(1) == reg) {
                    recv[i].Dreg1[j] = parseInt(dmyData[key],16);
                }
            }
            reg++;
        }
    }
    args.posts.table.recv = recv;

    nextDo(null, args);
}

/**
 *  デモデータ
 */
var demoData_send = function(args, nextDo) {
    var send = new Array(),
    start10,
    end10,
    mod10;

    /*デモ用メモリの初期化*/
    demoInitsendreg();

    mod10 = SEND_START_REG % 10;
    start10 = (SEND_START_REG - mod10) / 10;
    mod10 = SEND_END_REG % 10;
    end10 = (SEND_END_REG - mod10) / 10;

    var reg = SEND_START_REG;
    for (var i = 0, imax = end10-start10; i <= imax; i++) {
        send[i] = new Object();
        send[i].Dreg10 = start10 + i;
        send[i].Dreg1 = new Array(10);
        for (var j = 0, jmax = 10; j < jmax; j++) {
            var target = ((start10 + i) * 10) + j;
            if (target < SEND_START_REG) {
                /* 範囲外のレジスター */
                send[i].Dreg1[j] = 0;
                continue;
            }
            if (target > SEND_END_REG) {
                /* 範囲外のレジスター */
                send[i].Dreg1[j] = 0;
                continue;
            }
            /* デモなので適当な値を入れる */
            var target_name = 'D' + ('0000' + target).slice(-4);
            for (var key in SendReg) {
                if (key == target_name) {
                    send[i].Dreg1[j] = SendReg[key];
                    break;
                }
            }
            reg++;
        }
    }
    args.posts.table.send = send;

    nextDo(null, args);
}

/**
 *  デモデータ(準備)
 */
var demoPre = function(args, nextDo) {
    var msg = {};
    if (Demo.conn == 9) {
        /*接続*/
        args.posts.step = "1"; /* 1:接続 */
        args.posts.text.port = Demo.port;
        msg = lcsAp.getMsgI18N(90100);
    } else if (Demo.conn == 1) {
        /*接続待ち*/
        args.posts.step = "1"; /* 1:接続 */
        args.posts.text.port = Demo.port;
        msg = lcsAp.getMsgI18N(90102);
    } else {
        /*未接続*/
        args.posts.step = "0"; /* 0:未接続 */
        msg = lcsAp.getMsgI18N(90101);
    }

    args.posts.mesg = msg.text;
    args.posts.mesg_lavel_color = msg.warn;

    nextDo(null, args);
}

/**
 *  デモデータ(接続)
 */
var demoConn = function(args, nextDo) {
    var timer = 1000;
    
    /* 接続待ち */
    Demo.conn = 1;
    Demo.port = args.req.body.port;
    nextDo(null, args);

    timer += Math.floor( Math.random() * 9000 );
    setTimeout(function() {
            /* 接続 */
            Demo.conn = 9;
            var msg = lcsAp.getMsgI18N(90100);
            lcsSOCK.io().of('/scr/901').emit('message_bar',
                                             {'mesg': msg.text,
                                                     'color': msg.warn});
            //lcsUI.showError(args, msg);
        },timer);
}

/**
 *  デモデータ(接続)
 */
var demoDisconn = function(args, nextDo) {
    /* 切断 */
    Demo.conn = 0;
    Demo.port = 0;
    nextDo(null, args);
}

/**
 *  デモ(レジスタ設定)
 */
var demoSetsendreg = function(args, nextDo) {
    /*radix*/
    var reg = args.req.body.send_dreg;
    var radix = args.req.body.radix;
    var val = parseInt(args.req.body.send_dreg_value,radix);

    for (var key in SendReg) {
        if (key == reg) {
            SendReg[key] = val;
            break;
        }
    }

    nextDo(null, args);
}

/**
 * 終了押下時の処理
 * @module endPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function endPB(req, res, posts) {
    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  /*TODO::終了処理*/
                  dspEnd], /* 画面を終了する */
                 finSync );
}

/**
 * 設定の処理
 * @module regsetPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function regsetPB(req, res, posts) {
    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  /*TODO::送信レジスタセット*/
                  demoSetsendreg,
                  demoPre, /* 前処理 */
                  demoData_recv,
                  demoData_send,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * 切断押下時の処理
 * @module disconnPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function disconnPB(req, res, posts) {
    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  demoDisconn, /*TODO::切断処理*/
                  demoPre, /* 前処理 */
                  demoData_recv,
                  demoData_send,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * 接続押下時の処理
 * @module connPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function connPB(req, res, posts) {
    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  demoConn, /*TODO::接続処理*/

                  demoPre, /* 前処理 */
                  demoData_recv,
                  demoData_send,
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
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  demoPre, /* 前処理 */
                  demoData_recv,
                  demoData_send,
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
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  demoPre, /* 前処理 */
                  demoData_recv, /* 表示１ */
                  demoData_send, /* 表示２ */
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
            "send_conn" : connPB,
            "send_disconn" : disconnPB,
            "send_regset" : regsetPB,
            "send_end" : endPB,
            "*" : errDisp
        },
        "*" : errDisp
    };

    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" );
        ToF["*"](req, res, posts, 98);
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

exports.sockMain = function(){
    lcsSOCK.io().of('/scr/901').on('connection', function(socket) {
            /* socket.io */
        });

    /* デモ ぐるぐる回る処理 */
    //demoHeartbeat();
    demoRegchange();
    rxplc();
}
