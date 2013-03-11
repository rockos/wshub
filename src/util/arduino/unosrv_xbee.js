var HOST = '127.0.0.1';
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
 *   */
var ws = require('websocket.io').listen(PORT);
var scrio = require('socket.io').listen(3012);

ws.on('connection', function(socket){
    log({'title':'socket','info':'bound on '+PORT});
    socket.on('message', function(data){
        log({'title':'socket','info':data});
        //scrio.sockets.emit("gauge01", {"value": JSON.parse(data).Xbee}); 
    });
});

scrio.sockets.on('connection', function(socket) {
    // connected...
    log({'title':'screen socket','info':'bound on '+'3012'});
    //scrio.sockets.emit("gauge01", {"value": 500}); 
});

