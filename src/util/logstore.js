'use strict';
/*
 * 0.0.0.0で待ち受けしないと外部からの接続を受けつけない。
 * localhostや127.0.0.1ではrejectする。
 */
var HOST = '0.0.0.0';
var PORT = 3010;

var net = require('net');
var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsMo = require(rootdir + 'lib/db/lcsmo').create('logStore', rootdir+'etc/mongo.cf');

/*
 * create TCP/IP socket Server
 *
 */
var lcsnet = net.createServer(function(sock) {
    
        // クライアントから接続された
        console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
        
        // ソケットからデータ受信した時のハンドラ
        sock.on('data', function(data) {
                console.log('DATA ' + sock.remoteAddress + ': ' + data);
                sock.write('You said "' + data + '"');
                
                lcsMo.save("gndlog" /* schema */,
                           {mc_begin:'B',
                                   mc_name: sock.remoteAddress,
                                   mc_state: data,
                                   mc_date:new Date().toLocaleString().toString()
                                   }, 
                           function(err, docs) {
                               if (err) {
                                   lcsap.log(err);
                               }
                           });
            });
    
        // ソケットが切断した時のハンドラ
        sock.on('close', function(data) {
                console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
            });
        
    });
/*
 *
 */
lcsnet.listen(PORT, HOST, function(){
        console.log('Server listening on ' + HOST +':'+ PORT);
    });
