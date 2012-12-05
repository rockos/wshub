#!/usr/bin/env node
'use strict';
/*
 *
 */
var net = require('net');
var PARAM = {'port':3011, 'host':'rockos'};
var socket = new net.Socket();

setEvent(socket);

//socket = net.connect(PARAM, function () {
socket.connect(PARAM, function () {
        log({'title':'client', 'info':'connected'});
        /* */
        });
/*
 *
 */
function reconnect() {
    setTimeout(function() {
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
            log({'title':'client', 'info':'received: ' + data});
            });

    s.on('end',        /* disconnection */
            function() {
            log({'title':'client', 'info':'disconnected'});
            s.end();
            });
    s.on('close',        /* socket closed */
            function() {
            log({'title':'client', 'info':'closed'});
            s.destroy();
            reconnect();
            });
    s.on('timeout',        /* timeout occured */
            function() {
            log({'title':'client', 'info':'timeout'});
            s.end(); /* send fin packet */
            });
    s.on('error',        /* any error occured */
            function(err) {
            log({'title':'client', 'info': err});
            });
    
}
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

