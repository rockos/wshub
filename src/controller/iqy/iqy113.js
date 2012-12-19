/**
 *  空棚検索
 *  @file iqy113.js
 *  @data 19.oct.2012
 */

var fs = require('fs');

var fin = function(err){
    if (err) {
        return;
    }
}

/**
 * 画面表示
 * @module dspwin
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render(posts.scrNo, posts);
    nextDo( null, args );
}

/**
 * 画面表示
 * @module setEcho
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function setEcho(args, nextDo) {
    var req = args.req, res = args.res;

    // information bar へ出力
    if( req.body.txt1 ) {
        args.posts.text.txt1 = req.body.txt1;
        if( 1 <= req.body.txt1 && req.body.txt1 <= 6 ) {
            args.posts.activ_row = req.body.txt1;
        }
    } else {
        args.posts.text.txt1 = "1";
    }

    nextDo( null, args );
    return;
}

/**
 * ＊＊＊テーブルリストを取得する
 * @module postData
 * @param  {Object}args, {function}nextDo
 * @date   24/jul/2012
 */
function postData(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    var step = args.posts.step;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/iqytest113.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));

    /*
    var MAX_ROW=6,MAX_BAY=10,MAX_TIE=5;
    args.posts.location = new Array(MAX_ROW+1);
    for( var i=0; i<= MAX_ROW; i++ ) {
        args.posts.location[i] = new Array(MAX_TIE+1);
        for( var j=0; j<= MAX_TIE; j++ ) {
            args.posts.location[i][j] = new Array(MAX_BAY+1);
            for( var k=0; k<= MAX_BAY; k++ ) {
                args.posts.location[i][j][k] = new Object();
                args.posts.location[i][j][k].status = "x";
            }
        }
    }

    for ( var i=0, imax=ddd.loc.length; i<imax; i++ ) {
        var r = parseInt(ddd.loc[i].addr.substr(0,2),10);
        var b = parseInt(ddd.loc[i].addr.substr(2,2),10);
        var t = parseInt(ddd.loc[i].addr.substr(4,2),10);
        if( args.posts.location[r][t][b] ) {
            args.posts.location[r][t][b].locid = ddd.loc[i].addr;
            args.posts.location[r][t][b].status = ddd.loc[i].stat;
        }
    }
    */

    var MAX_ROW=6,MAX_BAY=10,MAX_TIE=5;
    args.posts.location.row = new Array(MAX_ROW+1);
    for( var i=0; i<= MAX_ROW; i++ ) {
        args.posts.location.row[i] = new Object();
        args.posts.location.row[i].tie = new Array(MAX_TIE+1);
        for( var j=0; j<= MAX_TIE; j++ ) {
            args.posts.location.row[i].tie[j] = new Object();
            args.posts.location.row[i].tie[j].bay = new Array(MAX_BAY+1);
            for( var k=0; k<= MAX_BAY; k++ ) {
                args.posts.location.row[i].tie[j].bay[k] = new Object();
                args.posts.location.row[i].tie[j].bay[k].locid = "";
                args.posts.location.row[i].tie[j].bay[k].status = "";
            }
        }
    }

    for ( var i=0, imax=ddd.loc.length; i<imax; i++ ) {
        var r = parseInt(ddd.loc[i].addr.substr(0,2),10);
        var b = parseInt(ddd.loc[i].addr.substr(2,2),10);
        var t = parseInt(ddd.loc[i].addr.substr(4,2),10);
        args.posts.location.row[r].tie[t].bay[b].locid = ddd.loc[i].addr;
        args.posts.location.row[r].tie[t].bay[b].status = ddd.loc[i].stat;
    }

    nextDo( null, args );
    //***********************************************************************

}

/**
 * 表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function iqyPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "1";

    lcsAp.series(args,
                 [setEcho,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function initSend(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.series(args,
                 [setEcho,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 空棚画面/main routine
 * @module mop.main
 * @param  {Object}req, {Object}res
 * @date   21/jun/2012
 */
exports.main = function(req, res, frame){

    var ToF = {/* Table of function for each button */
        "GET": initSend,
        "POST":{
            "send_iqy" : iqyPB
        }
    };

    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" + "113" );
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    for( var key1 in ToF ) {
        if( key1 === req.method ) {
            if( typeof ToF[key1] === "function" ) {
                ToF[key1]( req, res, posts );
                return;
            } else if( typeof ToF[key1] === "object" ) {
                for( var key2 in ToF[key1] ) {
                    if( req.body[key2] ) {
                        if( typeof ToF[key1][key2] === "function" ) {
                            ToF[key1][key2]( req, res, posts );
                            return;
                        }
                    }
                }
                /*規定外のボタンです*/
                //dspWin( 3, req, res, posts );
                res.redirect('/');
                return;
            }
        }
    }
    /*規定外のメソッドタイプです*/
    //dspWin( 2, req, res, posts );
    res.redirect('/');
    return;

}

/**
 * 空棚画面/socket.io main routine
 * @module iqy113
 * @param  
 * @date   22/oct/2012
 */
exports.sck_main = function(){
    var lcname = sck_io.of("/scr/113");
    lcname.on("connection", function(socket) {
            var __file = "./ini/data/iqytest113.json",
                prev_ddd = {};
            console.log( "connect---" + "/scr/113" );

            lcname.sockets[socket.id].volatile.emit("mesg", "conn::"+socket.id+"<br>");

            prev_ddd = JSON.parse(require('fs').readFileSync(__file));

            /*クライアントからエミットされた*/
            socket.on("sock_iqy", function(msg) {
                    //var ddd = msg;
                    //lcname.sockets[socket.id].volatile.emit("mesg", ddd.d1+"<br>");
                    //lcname.sockets[socket.id].volatile.emit("mesg", ddd.d2+"<br>");
                    //lcname.sockets[socket.id].volatile.emit("mesg", ddd.d3+"<br>");

                });

            require('fs').watchFile(__file, function( curr, prev ) {
                    var ddd = JSON.parse(require('fs').readFileSync(__file));

                    for ( var i=0, imax=ddd.loc.length; i<imax; i++ ) {
                        for( var j=0, jmax=prev_ddd.loc.length; j<jmax; j++ ) {
                            if( ddd.loc[i].addr==prev_ddd.loc[j].addr ) {
                                if( ddd.loc[i].stat != prev_ddd.loc[j].stat ) {
                                    lcname.sockets[socket.id].volatile.emit("changeTana", {"id":ddd.loc[i].addr,"stat":ddd.loc[i].stat});
                                }
                                break;
                            }
                        }
                    }
                    prev_ddd = ddd;
                });

            /*クライアントからディスコネクトされた*/
            socket.on("disconnect", function(msg) {
                    require('fs').unwatchFile(__file);
                });

        });
}
