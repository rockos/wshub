'use strict';

var http = require('http');

function getReserve() {
    var options = {
        host: 'rockos.co.jp',
        port: 3008,
        path: '/rest/rtv/reserve',
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        var body = "";
        console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log('HEADERS: ');
        console.log(res.headers);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log('BODY :  ' + body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

getReserve();


