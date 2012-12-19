#!/usr/bin/env node
/*
 *
 *
 */
var redis = require('redis');
var net = require('net');
var util = require('util');
var opts = require('opts');

var specfile = './plc.conf';
var TXHEAD = '03FF000A4420000000001400';
var RXHEAD = '01FF000A4420000000001900';
var state = 0;
var rdb = redis.createClient();
var SPEC = JSON.parse(require('fs').readFileSync(specfile));
//var SPEC = {'data':'0123456789012345678901234567890'};
var socket = new net.Socket();
setEvent(socket);
opts.parse([
           {'short': 'd',
               'long': 'debug',
               'description': 'debug mode',
               'value': false,
               'required': false
           },
           {'short': 'p',
               'long': 'port',
               'description': 'socket port',
               'value': true,
               'required': false
           },
           {'short': 'h',
               'long': 'host',
               'description': 'host name',
               'value': true,
               'required': false
           }
]);
var DEBUG = opts.get('debug') || 0;
var PORT = opts.get('port') || 3012;
var HOST = opts.get('host') || 'localhost';
var PARAM = {'port': PORT, 'host': HOST};

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
    if (typeof objs.title == 'undefined')
        objs.title = 'plcconnect';
    if (typeof objs.info === 'string')
        util.log(util.format('%s: info:%s', objs.title, objs.info));
    if (typeof objs.error === 'string')
        util.log(util.format('%s: ERROR:%s', objs.title, objs.error));
    if (typeof objs.debug === 'string' && DEBUG)
        util.log(util.format('%s: debug:%s', objs.title, objs.debug));
}
/*
 *
 */
function beginCom(s) {
    readReq(s, RXHEAD);
}
/*
 *
 */
function readReq(s, data) {
    if (state == 1) {
        log({'title': 'client', 'debug': 'readReq'});
        s.write(data);
    }
}
/*
 *
 */
function writeReq(s, head, data, devnum) {
    debugger;
    if (state == 1) {
        log({'debug': 'writeReq: ' + data});
        s.write(TXHEAD + data,
                function() {
                    log({'debug': 'write comp'});
                });
    }
}
/*
 *
 */
function reconnect() {
    setTimeout(function() {
        //socket.destroy();
        log({'info': 'now reconnected'});
        try {
            socket.connect(PARAM);
        } catch (e) {
            log({'error': 'reconnect ' + e});
        }
    }, 1000);
}
/*
 *
 */
function store(dev, data) {
    if (dev === 'db') {
        stroreDb(data);
    } else {
        log({'debug': 'recv data: ' + data});
    }
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
        log({'error': 'received data not string'});
        return;
    }
    len = src.length;
    if (len < 4) {
        log({'error': 'received data too short'});
        return;
    }
    if (src.slice(0, 4) != '8100')
        return; /* ignore this message */

    num = (len - 6) / 4;    /* number of register */
    if (num < 1) {
        log({'error': 'received data too short'});
        return;
    }

    val = src.slice(4, len - 6);
    rdb.hset('h_plc:demo', 'r01', val);
}
/*
 *
 */
function setEvent(s) {
    s.on('data',   /* some data received */
         function(data) {
             log({'info': 'recved: ' + data});
             if (data.length < 4) {
                 log({'error': 'invalid data length' + data});
             }
             if (data.slice(0, 4) == '8100') {
                 debugger;
                 store('null', data);
                 setTimeout(
                     function() {
                     debugger;
                     writeReq(s, TXHEAD, SPEC.data.slice(0, 80), 20);
                 },
                 100);
             } else if (data.slice(0, 4) == '8300') {
                 setTimeout(
                     function() {
                     readReq(s, RXHEAD)}, 1000);
             }
             });

    s.on('end',        /* disconnection */
            function() {
            log({'info': 'disconnected'});
            state = 0; /* disconnect */
            s.end();
            });
    s.on('close',        /* socket closed */
            function() {
            log({'info': 'closed'});
            state = 0; /* disconnect */
            //s.end();
            s.destroy();
            reconnect();
            });
    s.on('timeout',        /* timeout occured */
            function() {
            log({'info': 'timeout'});
            state = 0; /* disconnect */
            s.end(); /* send fin packet */
            });
    s.on('error',        /* any error occured */
            function(err) {
            state = 0; /* disconnect */
            log({'error': 'error ' + err});
            });
}
