'use strict';
var fs = require('fs');
var net = require('net');
var util = require('util');
var HOST = '127.0.0.1';
var PORT = 3011;
var TAG = '/scr/910';
var __file = './ini/data/seq910-test1.json';
var _seq_txt = './ini/data/seq.txt';
var _DATABASE = 'none'; /* none or redis */
var isClient = false; /* true if connection estabished */
var RX_POSI = 0;  /* _seq_txt start position default 200 register */
var TX_POSI = (200*4); /* ditto */
var RXBUF = '';
var TXBUF = '';
var me = 'Seq910';
var plcConnect = false;
/*デモ用グローバル*/
var Demo = {"conn":0,"port":""};
var SendReg;
/*レジスタのスタート/エンド 実際には.confファイルにもつ*/
/* var RECV_START_REG = 0,
    RECV_END_REG = 199;
*/
/* for 凸版*/
var RECV_START_REG = 0,
RECV_END_REG = 199;
/*レジスタのスタート/エンド 実際には.confファイルにもつ*/
/*var SEND_START_REG = 1000,
    SEND_END_REG = 1199;
*/
/* for 凸版*/
var SEND_START_REG = 200,
SEND_END_REG = 400;

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
        lcsSOCK.io().of(TAG).volatile.emit('Heartbeat',{"D0000":D0000});
    }
    setTimeout(demoHeartbeat,300);
}

/**
 *  デモ regChange
 */

var demoRegchange = function() {
    var prevReg = JSON.parse(fs.readFileSync(__file));

    require('fs').watchFile(__file, function( curr, prev ) {
            var nowReg = JSON.parse(fs.readFileSync(__file));
            for (var key in prevReg) {
            if (prevReg[key] != nowReg[key]) {
            lcsSOCK.io().of(TAG).volatile.emit('regChange',
                {"reg":key,
                "val":nowReg[key]});
            }
            }
            prevReg = nowReg;
            });
}
/**
 *  デモデータ
 */
var demoData_recv = function(args, nextDo) {
    var recv = new Array(),
    start10,
    end10,
    mod10;
    var dmyData = JSON.parse(fs.readFileSync('./ini/data/seq910-test1.json'));

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
var demoPreX = function(args, nextDo) {
    var msg = {};
    if (plcConnect) {
        /*接続*/
        args.posts.step = "1"; /* 1:接続 */
        args.posts.text.port = Demo.port;
        msg = lcsAp.getMsgI18N(90100);
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
            lcsSOCK.io().of(TAG).emit('message_bar',
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
/*
 * バッファ内の指定レジスタの値を置換する
 * D1000
 */
function replaceReg(src, name, value) {
    var dstn = '';
    var pos = 0, head = '', tail = ''; 
    var regnum = parseInt(name.slice(1,5), 10);
    
    if (regnum > 1000) regnum -= 1000;
    
    pos = (regnum - SEND_START_REG) * 4;
    head = src.slice(0, pos);
    pos += 4;
    tail = src.slice(pos, src.length);
    dstn = head + value + tail;
    
    return dstn;
}
/**
 * 設定の処理
 * @module regsetPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function regsetPB(req, res, posts) {
    var reg = req.body.send_dreg;
    var radix = req.body.radix;
    var val = req.body.send_dreg_value;
    var regVal = ('0000' + parseInt(val, radix).toString(16)).slice(-4)
    debugger;
    TXBUF = replaceReg(TXBUF, reg, regVal);
    res.send(204);
    lcsSOCK.io().of(TAG).volatile.emit('vupdateRegOne',
                                       {
                                           "regTop":"0",
                                           "regDnum": reg,
                                           "regVal": regVal});
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
                  demoPreX, /* 前処理 */
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

                  demoPreX, /* 前処理 */
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
                  demoPreX, /* 前処理 */
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
                  demoPreX, /* 前処理 */
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
        lcsAp.syslog("error", "lcsAp.initPosts" );
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

/**
 *
 *
 */
function readDB(key, field, cb) {
    lcsRdb.hget(key, field,
            function(err, reply) {
            cb(err, reply);
            });
}
/**
 *
 *
 */
function storeDB(key, field, data, cb) {
    lcsRdb.hset(key, field, data,
            function(err, reply) {
            cb(err, reply);
            });
}
/**
 *
 *
 */
function storeFile(fd, strt, length, data) {
    var buffer = new Buffer(length);
    buffer.write(data, 0);
    return fs.writeSync(fd, buffer, strt*4, length, TX_POSI);
}
/**
 *
 *
 */
function readFile(fd, offset, length) {
    var buffer = new Buffer(length);
    var bytesRead = fs.readSync(fd, buffer, 0, length, offset);
    var input = buffer.toString('utf8', 0, bytesRead);
    return input;
    /* return fs.readSync(fd, len); */
    //fs.readSync(fd, buffer, 0, len, strt);
}
/*
 *
 *
 */
function updateAllcell(top, num, buf) {
    if (!isClient) return;
    lcsSOCK.io().of(TAG).volatile.emit('vupdateRegs',
                                       {
                                           "regTop": top,
                                           "regNum": num,
                                           "regVal": buf});
}
/**
 *
 *
 */
function update(fd, top, num, buf) {
   //storeFile(fd, strt, num*4, data); 
   debugger;
   updateAllcell(top, num, buf);
}
/**
 * format
 * recv data
 *  0123456789012345678901234567890
 *  01FF000A4420rrrrrrrrnn00
 *  r: start address of device (08x)
 *  n: number of device (02x)
 * repply data
 *  0123456789012345678901234567890
 *  8100aaaabbbbcccc...SS
 *   a,b,..: value of each device (04s)
 *   S: check sum (02x)
 */
function recvR01(stream, fd, src, cb) {
    var buf = '';
    var head = '8100';
    var devstrt = parseInt(src.slice(12, 19));
    var devnum = parseInt(src.slice(20, 22), 16);
    var repl = '';
    var repllen = devnum*4 + 4;

    if (_DATABASE === 'redis') {
        readDB('h_plc:demo', 'r01', function(err, data) {
            if (err) {
                lcsAp.syslog('error', 'plcmon readDB: '+ err);
                return;
            }
            buf = data.slice(0, devnum*4);
            //repl += head + buf + 'EE';
            /* sumチェックを外す */
            repl += head + buf;
            cb(stream, repl);
        });
    } else {
        //buf = readFile(fd, devstrt, devnum*4);
        buf = TXBUF.slice(devstrt, devnum*4);
        //repl += head + buf + 'EE';
        /* sumチェックを外す */
        repl += head + buf;
        cb(stream, repl);
    }

}
/**
 * 書き込み要求受信
 * format
 * recv data
 *  0123456789012345678901234567890
 *  03FF000A4420rrrrrrrrnn00DDDD...DDD
 *  r: start address of device (08x)
 *  n: number of device (02x)
 * repply data
 *  0123456789012345678901234567890
 *  8300SS
 *   S: check sum (02x)
 * 
 *
 */
function recvW03(stream, fd, src, cb) {
    var buf = '';
    var head = '8300';
    var devstrt = parseInt(src.slice(12, 20), 16);
    var devnum = parseInt(src.slice(20, 22), 16);
    var repl = '';
    var writelen = 0;
    var datalen = src.length;
    writelen = devnum * 4;
    if (datalen < (24 + writelen)) {
        lcsAp.syslog('error', 'plcmon invalid write length ' + writelen);
        return;
    }
    if (writelen < 0 || writelen > 400) {
        lcsAp.syslog('error', 'plcmon invalid length ' + writelen);
        return;
    }
   
    buf = src.slice(24, 24 + writelen);
    if (buf.length < writelen) {
        lcsAp.syslog('error', 'plcmon invalid length ' + writelen);
        return;
    }
    if (_DATABASE === 'redis') {
        storeDB('h_plc:demo', 'w03', buf, function(err, data) {
            if (err) {
                lcsAp.syslog('error', 'plcmon error occured: '+ err);
                return;
            }
            /* sumチェックを外す */
            //repl += head + 'EE';
            repl += head;
            cb(stream, repl);
        });
    } else { /* write to file */
      update(fd, devstrt, devnum, buf);
      /* sumチェックを外す */
      //repl += head + 'EE';
      repl += head;
      cb(stream, repl);
    }
}
/*
 *
 */
function sendTo(to, data) {

    to.write(data);
}
/**
 *
 */
function recvFrom(stream, fd, data) {
    var repl = '';
    var len = 0;
    var kind = data.slice(0, 2);

    if (kind == '01') {
        recvR01(stream, fd, data, sendTo);
    } else if (kind == '03') {
        recvW03(stream, fd, data, sendTo);
    } else if (kind == '81') {
        //recvW81(stream, fd, data);
    } else if (kind == '83') {
        ;   /* nothing to do */
    } else {
        lcsAp.syslog('error', 'plcmon invalid data:'+data);
    }
}
/**
 *
 */
function disconnectFrom(s, fd) {
    try {
        fs.closeSync(fd);
    } catch (e) {
        lcsAp.syslog('error', 'plcmon closeSync:' + e);
    }
}
/**
 *
 */
function configServer(s, conf) {
    var fd = 0;
    try {
        fd = fs.openSync(conf.spool, 'r+');
        RXBUF = readFile(fd, 0, 200*4);   /* 先頭から800byte */
        TXBUF = readFile(fd, 200*4, 200*4);   /* 800から400byte */
        return fd;
    } catch (e) {
        lcsAp.syslog('error', 'plcmon openSync' + e);
        return -1;
    }
}
/*
 * create tcp server
 *
 */
function createServer(conf) {
    var fd = 0;
    var server = net.createServer(function(stream) {
        stream.setEncoding('utf8');
        stream.on('connect', function() {
            lcsAp.syslog('info','plcmon connected');
            configServer(stream, conf);
            plcConnect = true;
        });
        stream.on('close', function() {
            lcsAp.syslog('info','plcmon closed');
            disconnectFrom(stream, fd);
            plcConnect = false;
        });
        stream.on('data', function(data) {
            log({'title': me, 'info': 'received: '+data});
            recvFrom(stream, fd, data);
        });
        stream.on('end', function() {
            lcsAp.syslog('info','plcmon disconnected');
            plcConnect = false;
            disconnectFrom(stream, fd);
        });
    });

    /*
    server.listen(conf.port, conf.host, function() {
        lcsAp.syslog('info','plcmon Server listen');
    });
    */
   /* 外部から接続できないのでhostを指定しない */
    server.listen(conf.port, function() { //'listening' listener
        lcsAp.syslog('info','plcmon Server listen');
    });
}
/*
 *
 *
 */
exports.sockMain = function(){
    lcsSOCK.io().of(TAG).on('connection', function(socket) {
        /* socket.io */
        isClient = true;
    });
    lcsSOCK.io().of(TAG).on('end', function(socket) {
        /* socket.io */
        isClient = false;
    });
    createServer({host:HOST, port:PORT, spool:_seq_txt});
}
/*
 * logging data
 */
function log(objs) {
    if (typeof objs.title == 'undefined')
        objs.title = 'plcconnect';
    if (typeof objs.info === 'string')
        util.log(util.format('%s: info:%s', objs.title, objs.info));
    if (typeof objs.error === 'string')
        util.log(util.format('%s: ERROR:%s', objs.title, objs.error));
    if (typeof objs.debug === 'string' && DEBUG)
        util.log(util.format('%s: debug:%s', objs.title, objs.debug));
}

