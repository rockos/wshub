var fs = require('fs');
var upmop301 = require('./upmop301.js');

/**
 * doSync finally
 * @param {Object} err : contents of error-code.
 * @param {Object} args : method "err" throw on error screen and error log.
 * @remark Error is caught if 1st-parameter value defined.
 *         and rendering to error screen.
 */
function finSync(err, args) {
    if (err == 99) {
        /* DB error */
        var msgobj = lcsAp.getMsgI18N(err);
        args.posts.mesg = msgobj.text;
        if (typeof args.posts.err === "object" ) {
            args.posts.mesg2 = args.posts.err.message;
            lcsAp.syslog("error", args.posts.err);
        } else {
            args.posts.mesg2 = "";
        }
        args.res.render('scr/error', args.posts); 
        return;
    } else if (err) {
        var msgobj = lcsAp.getMsgI18N(err);
        args.posts.mesg = msgobj.text;
        args.posts.mesg2 = "";
        args.res.render('scr/error', args.posts); 
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
    nextDo(null, args);
}

/**
 * 入力されたフォームにデータを返す用
 * @module setEcho
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function setEcho(args, nextDo) {
    var req = args.req, res = args.res;
    /* txt1 */
    nextDo(null, args);
}

/**
 * ＊＊＊テーブルリストを取得する
 * @module postData
 * @param  {Object}args, {function}nextDo
 * @date   24/jul/2012
 */
function postData(args, nextDo) {

    var req = args.req, 
        res = args.res, 
        posts = args.posts,
        step = args.posts.step,
        sql = "",
        bind = [],
        stock_rows = [];

    sql += "" +
        "select " +
        "    l.name as col1, i.item_code as col2, i.item_name as col3, s.id_stock col4, " +
        "    s.quantity as col5, DATE_FORMAT(s.initial_date,'%Y/%m/%d') as col6, s.remark as col7, " +
        "    case " +
        "    when exists(select * from t_rv_stock r where r.id_stock=s.id_stock) " +
        "    then '◎'"+
        "    else '' end as col8 " +
        "from t_stocks s, t_join j, m_locations l, m_users u, m_items i " +
        "where 1=1 " +
        "    and j.id_join = s.id_join " +
        "    and l.address = j.address and l.area = j.area " +
        "    and u.id_user = s.id_user " +
        "    and i.id_item = s.id_item " +
        "";
    if (req.body.txt3) {
        sql += " and s.id_user = ? ";
        bind = [req.body.txt3];
    } else if (req.body.sel1) {
        sql += " and s.id_user = ? ";
        bind = [req.body.sel1];
    }else{
        sql += " and s.id_user = ? ";
        bind = ["x"]; /* non search */
    }
    sql += "order by l.address ";

    lcsDb.query(sql, bind, function(err, results, fields) {
        if (err) {
            args.err = err;
            nextDo( args );
            return;
        }
        stock_rows = results;
        if (stock_rows.length) {
            args.posts.table.tab1.shift();
        }

        for (var i=0, max=stock_rows.length; i<max; i++) {
            stock_rows[i].chk1 = new Object();
            stock_rows[i].chk1.val = stock_rows[i].col4;
            stock_rows[i].chk1.exist = "1";
            if (req.body.tab1_chk) {
                if (typeof req.body.tab1_chk === "string") {
                    if (stock_rows[i].chk1.val == req.body.tab1_chk) {
                        stock_rows[i].chk1.on = "checked";
                    }
                } else {
                    for (var j=0, maxj=req.body.tab1_chk.length; j<maxj; j++) {
                        if (stock_rows[i].chk1.val == req.body.tab1_chk[j]) {
                            stock_rows[i].chk1.on = "checked";
                            break;
                        }
                    }
                }
            }
            if (step=="3" || step=="4") {
                if (stock_rows[i].chk1.on == "checked") {
                    args.posts.table.tab1.push(stock_rows[i]);
                }
            } else {
                args.posts.table.tab1.push(stock_rows[i]);
            }
        }
        nextDo( null, args );
    });
}

/**
 * ＊＊＊optionリストを取得する
 * @module optionsDsp
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
function optionsDsp(args, nextDo) {
    var req = args.req, 
        res = args.res,
        sql = "",
        bind = [];
    sql = "" +
        "select " +
        "  id_user as value, nickname as dsp2, " +
        "  CONCAT(id_user,':',nickname) as dsp, " +
        "  IF(id_user=?, 'selected', 'x') as selected " +
        "from m_users " +
        "where 1=1 " +
        "order by id_user ";
    if (req.body.sel1) {
        bind = [req.body.sel1];
    } else if (req.body.txt3) {
        bind = [req.body.txt3];
    } else {
        bind = [args.posts.frameNavi.userid];
    }

    lcsDb.query (sql, bind, function (err, results, fields) {
        if (err){
            args.err = err;
            nextDo(args);
            return;
        }
        args.posts.select.opt1 = results;
        for( var i=0, max=args.posts.select.opt1.length; ; i++ ) {
            if( args.posts.select.opt1[i].selected == "selected" ) {
                args.posts.text.txt3 = args.posts.select.opt1[i].value;
                args.posts.dsp.user = args.posts.select.opt1[i].dsp;
                break;
            }
        }
        nextDo( null, args );
    });
}

/**
 * キャンセル 実行
 * @module delExe
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function delExe(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 function(err) {
                     finSync(err, args);
                 });
}

/**
 * 出庫予約 実行
 * @module addExe
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addExe(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 function(err) {
                     finSync(err, args);
                 });
}

/**
 * キャンセル押下時の処理
 * @module delPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function delPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "4";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  postData, /* 表示データを取得する */
                  setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 function(err) {
                     finSync(err, args);
                 });
}

/**
 * 出庫予約の為の準備処理
 * @module addPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "3";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  postData, /* 表示データを取得する */
                  setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 function(err) {
                     finSync(err, args);
                 });
}

/**
 * 表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function iqyPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "2";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  postData, /* 表示データを取得する */
                  setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 function(err) {
                     finSync(err, args);
                 });
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function initSend(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0"; /* 0:initial表示 */

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  setEcho, /* 入力フィールド表示用に送信されてきた値をセットする */
                  optionsDsp, /* リストボックスデータを取得する */
                  dspWin], /* 後処理 */
                 function(err) {
                     finSync(err, args);
                 });
}

/**
 * エラー
 * @module errDisp
 * @param  {Object}req, {Object}res, {Object}posts, {number}err
 * @date   21/sep/2012
 */
function errDisp(req, res, posts, err) {
    var args = {"req": req, "res": res, "posts": posts};
    finSync(err, args);
}

/**
 * 出庫予約画面/main routine
 * @module mop.main
 * @param  {Object}req
 * @param  {Object}res
 * @param  {Object}frame
 * @date   21/jun/2012
 */
exports.main = function(req, res, frame){

    var ToF = {/* Table of function for each button */
        "GET": initSend,
        "POST":{
            "send_iqy" : iqyPB,
            "send_add" : addPB,
            "send_del" : delPB,
            "send_add_exe" : addExe,
            "send_del_exe" : delExe,
            "send_bak1" : initSend,
            "send_bak2" : iqyPB,
            "*" : errDisp
        },
        "*" : errDisp
    };

    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" );
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    for (var key1 in ToF) {
        if (key1 === req.method) {
            if (typeof ToF[key1] === "function") {
                ToF[key1](req, res, posts);
                return;
            } else if (typeof ToF[key1] === "object") {
                for (var key2 in ToF[key1]) {
                    if (req.body[key2]) {
                        if (typeof ToF[key1][key2] === "function") {
                            ToF[key1][key2](req, res, posts);
                            return;
                        }
                    }
                }
                /*規定外のボタンです*/
                if (typeof ToF[key1]["*"] === "function") {
                    ToF[key1]["*"](req, res, posts, 3);
                    return;
                }
            }
        }
    }
    /*規定外のメソッドタイプです*/
    if (typeof ToF["*"] === "function") {
        ToF["*"](req, res, posts, 2);
        return;
    }
    res.redirect('/');
    return;
};

/**
 * Validator for form data.
 * @param {Object} args argument.
 * @param {Function} callback function which shoud run at next step.
 * @return {Function} callback.
 */
var validCheck = {
    "err" : 0,
    "checkParams_add" : function(args , callback) {
        lcsUI.checkVal2(
             [
             {"form":args.data.id_user, "column":"t_reserve.id_user"}, 
             {"form":args.data.schedule, "column":"t_reserve.schedule"}, 
             {"form":args.data.remark, "column":"t_reserve.remark"} 
              ], function(errmsg) {
                 if (errmsg) {
                     args.errmsg = errmsg;
                     callback(args,args);
                     return;
                 }
                 callback(null, args);
                 return;
             });
    },
    "checkParams_del" : function(args , callback) {
        lcsUI.checkVal2(
             [
             {"form":args.data.id_user, "column":"t_reserve.id_user"}
              ], function(errmsg) {
                 if (errmsg) {
                     args.errmsg = errmsg;
                     callback(args,args);
                     return;
                 }
                 callback(null, args);
                 return;
             });
    },
    "filter" : function(args, callback) {
        /* sanitize */
        return callback(null, args);
    }
};
/**
 * データベースの整合性チェック
 * @param {Object} args argument of parent function.
 * @param {Function} callback function which should run at next step.
 */
var checkDb = {
    /**
     *  stockが存在すること
     */
    "stockExists" : function(args, callback) {
        var counter = 0;
        var stock_check = function(id_stock, callback, nextDo) {
debugger;
            var bind = [];
            /* exist check t_stocks */
            var sql = "" +
            "select count(s.id_stock) as stock_exist " +
            "from t_stocks s " +
            "where s.id_stock = ? ";
            bind = [id_stock];
            lcsDb.query(sql, bind, function(err, results) {
                    if (err) {
                        nextDo(err, "99", callback);
                        return;
                    }
                    if (!results[0].stock_exist) {
                        nextDo(null, "30101", callback);
                        return;
                    }
                    nextDo(null, null, callback);
                });
        };

        var stock_check_callback = function(err, reason, callback) {
debugger;
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args,args);
                return;
            }
            if (reason) {
                args.errmsg = lcsAp.getMsgI18N(reason);
                callback(args,args);
                return;
            }
            counter++;
            if (counter >= args.data.id_stock.length) {
                /* check OK. */
                callback(null, args);
                return;
            }
            stock_check(args.data.id_stock[counter], callback, stock_check_callback);
        };
        stock_check(args.data.id_stock[counter], callback, stock_check_callback);
    },
    /**
     *  stockが存在すること
     *  stockが未予約であること
     */
    "stockNo_reserve" : function(args, callback) {
        var counter = 0;
        var rv_stock_check = function(id_stock, callback, nextDo) {
            var bind = [];
            /* exist check t_rv_stock */
            var sql = "" +
            "select count(r.id_stock) as rv_exist " +
            "from t_stocks s " +
            "  left outer join t_rv_stock r on r.id_stock = s.id_stock " +
            "where s.id_stock = ? ";
            bind = [id_stock];
            lcsDb.query(sql, bind, function(err, results) {
                    if (err) {
                        nextDo(err, "99", callback);
                        return;
                    }
                    if (results[0].rv_exist) {
                        nextDo(null, "30102", callback);
                        return;
                    }
                    nextDo(null, null, callback);
                });
        };

        var rv_stock_check_callback = function(err, reason, callback) {
debugger;
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args,args);
                return;
            }
            if (reason) {
                args.errmsg = lcsAp.getMsgI18N(reason);
                callback(args,args);
                return;
            }
            counter++;
            if (counter >= args.data.id_stock.length) {
                /* check OK. */
                callback(null, args);
                return;
            }
            rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
        };
        rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
    },

    /**
     *  stockが存在すること
     *  stockが予約であること
     */
    "reserveExist" : function(args, callback) {
        var counter = 0;
        var rv_stock_check = function(id_stock, callback, nextDo) {
            var bind = [];
            /* exist check t_rv_stock */
            var sql = "" +
            "select count(r.id_stock) as rv_exist " +
            "from t_stocks s " +
            "  left outer join t_rv_stock r on r.id_stock = s.id_stock " +
            "where s.id_stock = ? ";
            bind = [id_stock];
            lcsDb.query(sql, bind, function(err, results) {
                    if (err) {
                        nextDo(err, "99", callback);
                        return;
                    }
                    if (!results[0].rv_exist) {
                        nextDo(null, "30103", callback);
                        return;
                    }
                    nextDo(null, null, callback);
                });
        };

        var rv_stock_check_callback = function(err, reason, callback) {
debugger;
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args,args);
                return;
            }
            if (reason) {
                args.errmsg = lcsAp.getMsgI18N(reason);
                callback(args,args);
                return;
            }
            counter++;
            if (counter >= args.data.id_stock.length) {
                /* check OK. */
                callback(null, args);
                return;
            }
            rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
        };
        rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
    },

    /**
     *  base
     */
    "blockA" : function(args, callback) {
        var sql = "",
        bind = [];
        sql = "" +
        "select 0 as data " +
        "";
        lcsDb.query(sql, bind, function(err, results) {
                if (err) {
                    args.errmsg = lcsAp.getMsgI18N(99);
                    args.dberr = err;
                    callback(args,args);
                    return;
                }
                /* check OK. */
                callback(null, args);
            });
        return;
    },

    "blockZ" : function() {
        callback(null, args);
        return;
    }
};

/**
 *  選択されたt_reserveを取得
 */
function getReserve(args, callback) {
    var counter = 0;
    var get_reserve = function(id_stock, callback, nextDo) {
        var bind = [];
        var sql = "" +
        "select id_reserve " +
        "from t_rv_stock " +
        "where id_stock = ? ";
        bind = [id_stock];
        lcsDb.query(sql, bind, function(err, results) {
                nextDo(err, results, callback);
            });
    };
    
    var get_reserve_callback = function(err, results, callback) {
debugger;
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            callback(args,args);
            return;
        }
        args.id_reserve.push(results[0].id_reserve);
        counter++;
        if (counter >= args.data.id_stock.length) {
            callback(null, args);
            return;
        }
        get_reserve(args.data.id_stock[counter], callback, get_reserve_callback);
    };
    get_reserve(args.data.id_stock[counter], callback, get_reserve_callback);
}

/**
 * 前処理
 * @param {Object} args argument of parent function.
 * @param {function} callback function should run at next step.
 */
function prepareData_del(args, callback) {
    args.id_reserve = new Array();
    lcsAp.doSync(args,
                 [
                  getReserve
                  ],
                 callback);
}

/**
 * validate form data.
 * @param {Object} args argument.
 * @param {Function} callback function which should run.
 * @date  1/nov/2012
 */
function parseData_del(args, callback) {
    lcsAp.doSync(args, 
                 [
                  validCheck.filter,
                  validCheck.checkParams_del,
                  checkDb.stockExists,
                  checkDb.reserveExist
                 ],
                 callback);
}

/**
 * 前処理
 * @param {Object} args argument of parent function.
 * @param {function} callback function should run at next step.
 */
function prepareData_add(args, callback) {
    args.seqnID = "id_reserve";
    args.id_reserve = "";
    lcsAp.doSync(args,
                 [lcsUI.getID],
                 callback);
}

/**
 * validate form data.
 * @param {Object} args argument.
 * @param {Function} callback function which should run.
 * @date  1/nov/2012
 */
function parseData_add(args, callback) {
    lcsAp.doSync(args, 
                 [
                  validCheck.filter,
                  validCheck.checkParams_add,
                  checkDb.stockExists,
                  checkDb.stockNo_reserve
                 ],
                 callback);
}

function dspSock(args, callback) {
    args.msg = lcsAp.getMsgI18N(0);
    args.sock301.sockets[args.socket.id].emit("exec_comp",{ 
            "mesg" : args.msg.text,
            "color" : args.msg.warn });
    callback(null, args);
}

function finSock(fail_args, true_args) {
    if (fail_args) {
        fail_args.sock301.sockets[fail_args.socket.id].emit("errmsg", { 
                "mesg" : fail_args.errmsg.text,
                "color" : fail_args.errmsg.warn });
        if (fail_args.dberr) {
            console.log(fail_args.dberr);
            lcsAp.syslog("error", fail_args.dberr.text);
        }
        return;
    }
    //console.log("info::sock finish");
    //console.log(true_args.id_reserve);
}

/**
 * 出庫予約 キャンセル
 * @module sck_delExe
 * @param  {Object}socket, 
 * @param  {Object}data, 
 * @param  {Object}posts
 * @date   1/nov/2012
 */
function sck_delExe(sock301, socket, data, posts) {
    var sync_pool = [],
        args = {"sock301":sock301, "socket": socket, "data": data, "posts": posts};
    debugger;
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  parseData_del, /* 入力チェック*/
                  prepareData_del, /* 前処理 */
                  upmop301.upDelExec, /* データベース削除 */
                  dspSock /* 後処理 */
                 ],
                 finSock);
}

/**
 * 出庫予約 実行
 * @module sck_addExe
 * @param  {Object}socket, 
 * @param  {Object}data, 
 * @param  {Object}posts
 * @date   1/nov/2012
 */
function sck_addExe(sock301, socket, data, posts) {
    var sync_pool = [],
        args = {"sock301":sock301, "socket": socket, "data": data, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  parseData_add, /* 入力チェック*/
                  prepareData_add, /* 前処理 */
                  upmop301.upAddExec, /* データベース登録 */
                  dspSock /* 後処理 */
                 ],
                 finSock);
}


/**
 * 出庫予約画面/socket main routine
 * @module mop.sck_main
 * @param  
 * @date   1/nov/2012
 */
exports.sck_main = function(){
    var sock301 = sck_io.of("/scr/301");
    var posts = {};
    sock301.on("connection", function(socket) {
            console.log( "connect---" + "/scr/301" );
            /*connect 正常*/
            sock301.sockets[socket.id].emit("debugz", "conn::"+socket.id+"<br>");

            /*クライアントからエミットされた*/
            socket.on("sock_add", function(data) {
                    sock301.sockets[socket.id].emit("debugz", "add::"+socket.id+"<br>");
                    sock301.sockets[socket.id].emit("debugz", data);
                    sck_addExe(sock301, socket, data, posts);
                });

            socket.on("sock_del", function(data) {
                    sock301.sockets[socket.id].emit("debugz", "del::"+socket.id+"<br>");
                    sock301.sockets[socket.id].emit("debugz", data);
                    sck_delExe(sock301, socket, data, posts);
                });

            /*クライアントからディスコネクトされた*/
            socket.on("disconnect", function(data) {
                    /* ToDo : timer切ったり、シグナルイベントの終了処理 */
                });
        });
}
