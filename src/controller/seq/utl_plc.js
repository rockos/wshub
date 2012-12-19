'use strict';
var fs = require('fs');
var net = require('net');
var util = require('util');
var HOST = '127.0.0.1';
var PORT = 3011;
var TAG = '/scr/910';
var _seq_txt = ROOTDIR + '/ini/data/seq.txt';
var _DATABASE = 'none'; /* none or redis */
var isClient = false; /* true if connection estabished */
var RX_POSI = 0;  /* _seq_txt start position default 200 register */
var TX_POSI = (200*4); /* ditto */
var RXBUF = '';
var TXBUF = '';
var plcConnect = false;
/*デモ用グローバル*/
var Demo = {"conn":0,"port":""};
/*
 * create tcp server
 *
 */
exports.createServer = function(conf, cb) {
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
            recvFrom(stream, fd, data, cb);
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
/**
 *
 *
 */
function update(fd, top, num, buf, cb) {
    //storeFile(fd, strt, num*4, data); 
    debugger;
    if (typeof cb === 'function') {
        cb(top, num, buf);
    }
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
            sendTo(stream, repl);
        });
    } else {
        //buf = readFile(fd, devstrt, devnum*4);
        buf = TXBUF.slice(devstrt, devnum*4);
        //repl += head + buf + 'EE';
        /* sumチェックを外す */
        repl += head + buf;
        sendTo(stream, repl);
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
            sendTo(stream, repl);
        });
    } else { /* write to file */
      update(fd, devstrt, devnum, buf, cb);
      /* sumチェックを外す */
      //repl += head + 'EE';
      repl += head;
      sendTo(stream, repl);
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
function recvFrom(stream, fd, data, cb) {
    var repl = '';
    var len = 0;
    var kind = data.slice(0, 2);

    if (kind == '01') {
        recvR01(stream, fd, data, cb);
    } else if (kind == '03') {
        recvW03(stream, fd, data, cb);
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
        if (fd != 0) {
            fs.closeSync(fd);
        }
    } catch (e) {
        lcsAp.syslog('error', 'plcmon closeSync:' + e);
    }
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
