'use strict';

var http = require('http');

function getReserve(user, date) {
    /*
     *  サーバ情報
     */
    var options = {
        host: 'rockos.co.jp',
        port: 3008,
        path: '/rest/rtv/reserve',
        method: 'GET'
    };
    var arg = "";

    arg += "?user=" + user + "&date=" + date;
    options.path += arg;

    var req = http.request(options, function(res) {
        var body = "";
        //console.log('res STAT = ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log('HEADERS: ');
        //console.log(res.headers);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            //console.log('BODY :  ' + body);
            var ddd = JSON.parse(body);
            console.log(ddd);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

function postResult() {
    /*
     *  サーバ情報
     */
    var ppp = {};
    ppp.location = '01-01-01';
    ppp.part = 'ITEM001';
    var qqq = require('querystring').stringify(ppp);
    console.log(qqq);

    var options = {
        host: 'rockos.co.jp',
        port: 3008,
        path: '/rest/rtv/result',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': qqq.length
        }
    };

    var req = http.request(options, function(res) {
        var body = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log(res.statusCode+body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(qqq);
    req.end();
}

function test(ctr) {
    getReserve('user00'+ctr, '2013-1-11');
    setTimeout( function() {
        ctr++;
        if(ctr > 4) {
            ctr = 1;
        }
        test(ctr);
    },5000);
}
test(1);

function test2() {
    postResult();
    setTimeout( function() {
        test2();
    },3000);
}
test2();






