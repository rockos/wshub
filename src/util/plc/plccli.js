var redis = require("redis"),
    client = redis.createClient();
var net = require('net');
var HOST = 'rockos';
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
 *  *
 *   *
 *    */
var client = net.connect({port:PORT, host:HOST}, function () {
        log({'title':'client', 'info':'connected'});
        client.write('hello\r\n');
        });
client.on('data', function(data) {
        log({'title':'client', 'info':data});
        client.end();
        });
client.on('end', function() {
        log({'title':'client', 'info':'disconnected'});

        });
