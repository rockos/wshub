var fs = require('fs');

/*
 *  DEMO Properties
 */
var DEMO = {};
DEMO.status = 0; /* 0:保守 1:自動 2:手動 */
DEMO.act = 0; /* 0:idle 1:busy 2:error */
DEMO.run = 0;
DEMO.vat = 0;
DEMO.runs = 387642;
DEMO.vats = 8612;
DEMO.num = 0;

DEMO.onlineGw = 0; /* 0:切断 1:通信 */
DEMO.generation = []; /* メータの値 */
DEMO.generation[0] = 0;
DEMO.generation[1] = 0;
DEMO.generation[2] = 0;
DEMO.generation[3] = 0;
DEMO.accelerator = []; /* スライドバーの値 */
DEMO.accelerator[0] = 30;
DEMO.accelerator[1] = 50;
DEMO.accelerator[2] = 170;

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
 * 表示データセット
 * @module showData
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function showData(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    args.posts.status = DEMO.status;
    args.posts.act = DEMO.act;
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
    /*
    var rand = Math.floor( Math.random() * DEMO.generation[3] );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[0] = DEMO.generation[1] * DEMO.generation[2] + rand;
    } else {
        DEMO.generation[0] = DEMO.generation[1] * DEMO.generation[2] - rand;
    }
    */
    DEMO.generation[0] = DEMO.generation[1] + DEMO.generation[2] + DEMO.generation[3];
    lcsSOCK.io().of('/scr/122').emit("gauge01", {"value": DEMO.generation[0]});
    setTimeout(demoGauge01,500);
}
var demoGauge02 = function(){
    var rand = Math.floor( Math.random() * 100 );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[1] = DEMO.accelerator[0]*10 + rand;
    } else {
        DEMO.generation[1] = DEMO.accelerator[0]*10 - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge02", {"value": DEMO.generation[1]});
    setTimeout(demoGauge02,300);
}
var demoGauge03 = function(){
    var rand = Math.floor( Math.random() * 200 );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[2] = DEMO.accelerator[1]*10 + rand;
    } else {
        DEMO.generation[2] = DEMO.accelerator[1]*10 - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge03", {"value": DEMO.generation[2]});
    setTimeout(demoGauge03,300);
}
var demoGauge04 = function(){
    var rand = Math.floor( Math.random() * 100 );
    var rand2 = Math.floor( Math.random() * 2 );
    if (rand2 <= 0) {
        DEMO.generation[3] = DEMO.accelerator[2]*3 + rand;
    } else {
        DEMO.generation[3] = DEMO.accelerator[2]*3 - rand;
    }
    lcsSOCK.io().of('/scr/122').emit("gauge04", {"value": DEMO.generation[3]});
    setTimeout(demoGauge04,300);
}
var sendClient = function(){
    //lcsSOCK.io().of('/scr/122').emit("gauge02", {"value": DEMO.generation[1]});
    //lcsSOCK.io().of('/scr/122').emit("gauge03", {"value": DEMO.generation[2]});
    //lcsSOCK.io().of('/scr/122').emit("gauge04", {"value": DEMO.generation[3]});
    lcsSOCK.io().of('/scr/122').emit("graph01", {
        "valueX": DEMO.generation[1]
        ,"valueY": DEMO.generation[2]
        ,"valueZ": DEMO.generation[3]
    });
    setTimeout(sendClient, 300);
}
var demoDirection01 = function(x) {
    if (typeof x == 'undefined') {
        x = 0;
    }
    if (x >= 360) {
        x = 0;
    }
    //var rand = Math.floor( Math.random() * 360 );
    var str = ["北","北東","北東","東","東","南東","南東","南","南","南西","南西","西","西","北西","北西"];
    var strIdx = 0;
    var BS = 360/16;
    //strIdx = Math.floor(rand/BS);
    strIdx = Math.floor(x/BS);
    if (strIdx >= 16) {
        strIdx = 0;
    }

    lcsSOCK.io().of('/scr/122').emit("direction01", {"value": x, "str": str[strIdx]});
    x++;
    setTimeout(function(){
        demoDirection01(x);
    }, 1000);
}
var demoMachine = function() {
    //DEMO.status = 0; /* 0:保守 1:自動 2:手動 */
    if (DEMO.status == 1) {
        if (DEMO.act == 0) {
            var rand = Math.floor( Math.random() * 10 );
            if (rand == 1) {
                DEMO.act = 1;
            }
        } else if (DEMO.act == 1) {
            var rand = Math.floor( Math.random() * 40 );
            if (rand == 1) {
                DEMO.act = 0;
                DEMO.run = 0;
                DEMO.vat = 0;
            } else if (rand == 2) {
                DEMO.act = 2;
                DEMO.num++;
                DEMO.run = 0;
                DEMO.vat = 0;
            }
        } else {
            var rand = Math.floor( Math.random() * 10 );
            if (rand == 1) {
                DEMO.act = 0;
            }
        }
        lcsSOCK.io().of('/scr/122').emit("machine01", {"status": 1, "act": DEMO.act});
    } else {
        DEMO.act = 0;
        lcsSOCK.io().of('/scr/122').emit("machine01", {"status": 0, "act": DEMO.act});
    }
    setTimeout(function(){
        demoMachine();
    }, 500);
}
var demoMachine2 = function(x) {
    if (typeof x == 'undefined') {
        x = 0;
    }
    if (DEMO.act == 1) {
        DEMO.run++;
        DEMO.runs++;
        DEMO.vat++;
        DEMO.vats++;
    }
    if (DEMO.runs >= 1000000) {
        DEMO.runs = 0;
    }
    if (DEMO.vats >= 100000) {
        DEMO.vats = 0;
    }

    lcsSOCK.io().of('/scr/122').emit("machine02", {
        "run": DEMO.run, 
        "vat": DEMO.vat, 
        "num": DEMO.num,
        "runs": DEMO.runs,
        "vats": DEMO.vats
    });
    setTimeout(function(){
        demoMachine2(x);
    }, 300);
}
/**
 *  加速度センサGWとの通信
 */
var accelerGw = function() {
    var io = require('socket.io-client');
    var url = "rockos.co.jp";
    var options = {
        //'force new connection':true,
        port:3011
    };
    //io.transports = ['xhr-polling']; //接続方式デフォルトはWebsocket
    socketGW = io.connect(url, options);
    socketGW.on('connect',function(){
        // GWとコネクション確立
        console.log('GWとコネクション確立');
        DEMO.onlineGw = 1;
    });

    socketGW.on('disconnect',function(){
        // GWとコネクション切断
        console.log('GWとコネクション切断');
        DEMO.onlineGw = 0;
    });

    socketGW.on('error',function(){
        // GWとコネクトできない
        console.log('GWとコネクトできない');
        DEMO.onlineGw = 0;
    });

    socketGW.on('accelerating_sensor',function(data){
        console.log('加速度センサからデータきた' + data);
        DEMO.generation[1] = data.KXM_A0;
        DEMO.generation[2] = data.KXM_A1;
        DEMO.generation[3] = data.KXM_A2;
        lcsSOCK.io().of('/scr/122').emit("gauge02", {"value": DEMO.generation[1]});
        lcsSOCK.io().of('/scr/122').emit("gauge03", {"value": DEMO.generation[2]});
        lcsSOCK.io().of('/scr/122').emit("gauge04", {"value": DEMO.generation[3]});
    });
}

/**
 *  加速度センサGWとの通信
 */
var ACL_PORT = 3011;
var accelerGw2 = function() {
    var ws = require('websocket.io').listen(ACL_PORT);
    ws.on('connection', function(socket){
        // GWのコネクション待ち
        DEMO.onlineGw = 1;
        socket.on('message',function(data){
            console.log('加速度センサからデータきた' + data);
            var data2 = {};
            try {
                data2 = JSON.parse(data);
                if (data2) {
                    if (data2.KXM_A0)  
                        DEMO.generation[1] = data2.KXM_A0;
                    if (data2.KXM_A1)
                        DEMO.generation[2] = data2.KXM_A1;
                    if (data2.KXM_A2)
                        DEMO.generation[3] = data2.KXM_A2;
                    lcsSOCK.io().of('/scr/122').emit("gauge02", {"value": DEMO.generation[1]});
                    lcsSOCK.io().of('/scr/122').emit("gauge03", {"value": DEMO.generation[2]});
                    lcsSOCK.io().of('/scr/122').emit("gauge04", {"value": DEMO.generation[3]});
                }
            } catch(err) {
                lcsAp.syslog("error", {"title":"parse Error","message":err});
            }
        });
    });
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
    //demoGauge01();
    demoDirection01();
    
    demoGauge02();
    demoGauge03();
    demoGauge04();
    sendClient();
    
    // 機械モニタデモ
    demoMachine();
    demoMachine2();


    // 加速度センサGW
    //accelerGw2();
    //sendClient();
}
/**
 * serial communication
 */
exports.serialMain = function() {

    var SerialPort = require("serialport").SerialPort
    var sp = new SerialPort("/dev/ttyUSB0", {
        baudrate: 9600
    });

    var SaveBuf = [10];
    var SaveCnt = 0;
    var Stx = false;

    function init() {
        SaveBuf.splice(0,3);
        SaveCnt = 0;
        Stx = false;

    }
    sp.on("open", function () {
        console.log('open');
    });
    
    /**
     *
     */
    sp.on('data', function(msg) {
        //console.log(msg);
        var buf = "";
        for (var i = 0; i < msg.length; i++) {
            if (msg[i] == 2) {
                debugger;
                init();
                Stx = true;
            } else if (msg[i] == 3) {
                debugger;
                buf = "{KXM_A0:" + SaveBuf[0];
                buf +=",KXM_A1:" + SaveBuf[1];
                buf +=",KXM_A2:" + SaveBuf[2];
                buf += "}";
                lcsSOCK.io().of('/scr/122').emit("gauge02", {"value": SaveBuf[0]});
                lcsSOCK.io().of('/scr/122').emit("gauge03", {"value": SaveBuf[1]});
                lcsSOCK.io().of('/scr/122').emit("gauge04", {"value": SaveBuf[2]});
                lcsSOCK.io().of('/scr/122').emit("graph01", {
                    "valueX":  SaveBuf[0] 
                    ,"valueY": SaveBuf[1]
                    ,"valueZ": SaveBuf[2]
                });
                console.log(buf);
                init();
                setTimeout(function() {
                    sp.write(6, function(err, results) {
                        //console.log('err ' + err);
                        // console.log('results ' + results);
                    }); 
                }, 1000); 
            } else {
                debugger;
                if (!Stx) continue;
                if (SaveCnt >= 3) continue; 
                debugger;
                SaveBuf[SaveCnt] = msg[i];
                SaveCnt++;
            }

        }
    });

    sp.on('error', function(err) {
        console.log('err ' + err);
    });
}

