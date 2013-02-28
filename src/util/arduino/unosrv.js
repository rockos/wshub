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
var io = require('socket.io').listen(PORT);

io.sockets.on('connection', function(socket){
    log({'title':'socket','info':'bound on '+PORT});
    socket.on('atime', function(data){
        log({'title':'socket','info':data});
    });
});
