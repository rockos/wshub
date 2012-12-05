#!/usr/bin/env node
var redis = require("redis"),
    client = redis.createClient();
var net = require('net');
var HOST = 'localhost';
var PORT = 3011;

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
/**
 *
 *
 */
function readDB(name, num, cb) {
    client.get('PLC-SRC',
            function(err, reply) {
            cb(err, reply);
            });
}
/**
 * format
 * src
 *  0123456789012345678901234567890
 *  01FF000A4420rrrrrrrrnn00
 *  r: start address of device (08x)
 *  n: number of device (02x)
 * repl
 *  0123456789012345678901234567890
 *  8100aaaabbbbcccc...SS
 *   a,b,..: value of each device (04s)
 *   S: check sum (02x)
 */
function formatData(stream, src, cb) {
    var buf = '';
    var head = '8100';
    var devstrt = parseInt(src.slice(12, 20));
    var devnum = parseInt(src.slice(20, 22), 16);
    repl = '';
    repllen = devnum*4 + 4;
    readDB(devstrt, devnum, function(err, data) {
            if (err) {
            console.log('plcmon error occured: '+ err);
            }
            buf = data.slice(0, devnum*4);
            repl += head + buf + 'EE';
            // log({'title':'readDb','data':repl});
            cb(stream, repl);
            });
}
function sendTo(to, data) {
    to.write(data);
    log({'title':'send', 'info':data});
}
/**
 *
 */
function recvFrom(stream, data) {
    var repl = '';
    var len = 0;

    log({'title':'recv', 'info':data});
    if (data.slice(0, 2) == '01') {
    formatData(stream, data, sendTo);
    } else {
        sendTo(stream, '8300');
    }
}
/**
 *
 */
var server = net.createServer(function(stream) {
    log({'title':'server', 'info':'connected'});
        stream.on('data', function(data) {
            recvFrom(stream, data);
            });
        stream.on('end', function() {
            log({'title':'server', 'info':'disconnected'});
            });
        });

server.listen(PORT, HOST, function() { //'listening' listener
        console.log('server bound');
        });
