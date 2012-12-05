#!/usr/bin/env node
'use strict';
/*
 *
 *
 */
//var redis = require("redis"),
//    rd = redis.createClient();
var net = require('net');
var conf = './plc.conf';
var HEAD = '03FF000A4420000000001700';
var PARAM = {'port':3011, 'host':'rockos'};
var state = 0;

var socket = new net.Socket();
setEvent(socket);

//socket = net.connect(PARAM, function () {
socket.connect(PARAM, function () {
        log({'title':'client', 'info':'connected'});
        state = 1; /* connect */
        readReq(socket);
        });
/*
 * logging data
 */
function log(objs) {
    var d = new Date,
        fmtDate = '',
        month;
    var msg = {};
    month = d.getMonth() + 1;

    fmtDate = d.getFullYear() + '/' + month + '/' + d.getDate() +
        ' ' + d.getHours() + ':' + d.getMinutes() + ':' +
        d.getSeconds() + ':' + d.getMilliseconds();

    console.log(fmtDate + ' ' + objs.title+':'+objs.info);
}
/*
 *
 *
 */
var param = JSON.parse(require('fs').readFileSync(conf));
//var socket = net.createConnection(PARAM);
/*
 *
 */
function readReq(s) {
    if (state == 1) {
                log({'title':'client', 'info':'readReq'});
        s.write('01FF000A4420000000001900');
    }
}
/*
 *
 */
function writeReq(s, head, data) {
    if (state == 1) {
                log({'title':'client', 'info':'writeReq'});
        s.write(HEAD + data.slice(4, 4*20),
                function(){
                log({'title':'client', 'info':'write comp'});
                });
    }
}
/*
 *
 */
function reconnect() {
    setTimeout(function() {
            //socket.destroy();
            log({'title':'client', 'info':'now reconnected'});
            try {
                socket.connect(PARAM);
            } catch(e) {
            log({'title':'client', 'info':e});

            }
            }, 1000);
}

function setEvent(s) {
    s.on('data',   /* some data received */
            function(data) {
            log({'title':'client', 'info':data});
            if (data.slice(0, 4) == '8100') {
            setTimeout(
                function() {
                writeReq(s, HEAD, data);
                }, 
                500);
            } else if (data.slice(0, 4) == '8300') {
            setTimeout(
                function() {
                readReq(s)}, 1000);
            }
            });

    s.on('end',        /* disconnection */
            function() {
            log({'title':'client', 'info':'disconnected'});
            state = 0; /* disconnect */
            s.end();
            });
    s.on('close',        /* socket closed */
            function() {
            log({'title':'client', 'info':'closed'});
            state = 0; /* disconnect */
            //s.end();
            s.destroy();
            reconnect();
            });
    s.on('timeout',        /* timeout occured */
            function() {
            log({'title':'client', 'info':'timeout'});
            state = 0; /* disconnect */
            s.end(); /* send fin packet */
            });
    s.on('error',        /* any error occured */
            function(err) {
            state = 0; /* disconnect */
            log({'title':'client', 'info': err});
            });
    
}
