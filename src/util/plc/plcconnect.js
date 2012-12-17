#!/usr/bin/env node
'use strict';
/*
 *
 *
 */
var redis = require('redis');
var net = require('net');
var util = require('util');
var conf = './plc.conf';
var HEAD = '03FF000A4420000000001700';
//var PARAM = {'port': 3011, 'host': 'rockos'};
var PARAM = {'port': 3012, 'host': 'localhost'};
var state = 0;
var DEBUG = 0;
var rdb = redis.createClient();

var socket = new net.Socket();
setEvent(socket);

//socket = net.connect(PARAM, function () {
socket.connect(PARAM, function() {
        log({'title': 'client', 'info': 'connected'});
        state = 1; /* connect */
        beginCom(socket);
        });
/*
 * logging data
 */
function log(objs) {
    if (typeof objs.info === 'string')
        util.log(util.format('%s: info:%s', objs.title, objs.info));
    if (typeof objs.error === 'string')
        util.log(util.format('%s: ERROR:%s', objs.title, objs.error));
    if (typeof objs.debug === 'string' && DEBUG)
        util.log(util.format('%s: debug:%s', objs.title, objs.debug));
}
/*
 *
 *
 */
var param = JSON.parse(require('fs').readFileSync(conf));
/*
 *
 */
function beginCom(s) {
    readReq(s);
}
/*
 *
 */
function readReq(s) {
    if (state == 1) {
                log({'title': 'client', 'debug': 'readReq'});
        s.write('01FF000A4420000000001900');
    }
}
/*
 *
 */
function writeReq(s, head, data) {
    if (state == 1) {
                log({'title': 'client', 'debug': 'writeReq'});
        s.write(HEAD + data.slice(4, 4 * 20),
                function() {
                log({'title': 'client', 'debug': 'write comp'});
                });
    }
}
/*
 *
 */
function reconnect() {
    setTimeout(function() {
            //socket.destroy();
            log({'title': 'client', 'info': 'now reconnected'});
            try {
                socket.connect(PARAM);
            } catch (e) {
            log({'title': 'client', 'info': e});
            }
            }, 1000);
}
/*
 *
 */
function storeDb(src /* String Object */) {
    var len = 0, num = 0, reg = 0;
    var data = '';
    var val = '';
    /* validate check */
    if (typeof src === 'undefined') {
        log({'title': 'client', 'error': 'received data not string'});
        return;
    }
    len = src.length;
    if (len < 4) {
        log({'title': 'client', 'error': 'received data too short'});
        return;
    }
    if (src.slice(0, 4) != '8100')
        return; /* ignore this message */

    num = (len - 6) / 4;    /* number of register */
    if (num < 1) {
        log({'title': 'client', 'error': 'received data too short'});
        return;
    }

    val = src.slice(4, len - 6);
    rdb.hset('h_plc:cur', 'r01', val);
}
/*
 *
 */
function setEvent(s) {
    s.on('data',   /* some data received */
            function(data) {
            log({'title': 'client', 'info': data});
            if (data.slice(0, 4) == '8100') {
                storeDb(data);
            setTimeout(
                function() {
                writeReq(s, HEAD, data);
                },
                100);
            } else if (data.slice(0, 4) == '8300') {
            setTimeout(
                function() {
                readReq(s)}, 1000);
            }
            });

    s.on('end',        /* disconnection */
            function() {
            log({'title': 'client', 'info': 'disconnected'});
            state = 0; /* disconnect */
            s.end();
            });
    s.on('close',        /* socket closed */
            function() {
            log({'title': 'client', 'info': 'closed'});
            state = 0; /* disconnect */
            //s.end();
            s.destroy();
            reconnect();
            });
    s.on('timeout',        /* timeout occured */
            function() {
            log({'title': 'client', 'info': 'timeout'});
            state = 0; /* disconnect */
            s.end(); /* send fin packet */
            });
    s.on('error',        /* any error occured */
            function(err) {
            state = 0; /* disconnect */
            log({'title': 'client', 'error': 'this ' + err});
            });
}
