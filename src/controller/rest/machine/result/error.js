'use strict';
var fs = require('fs');

/**
 * doSync finally
 * @param {Object} err : contents of error-code.
 * @param {Object} args : method "err" throw on error screen and error log.
 */
function finSync(err_args) {
    if (err_args) {
        var req = err_args.req, 
            res = err_args.res, 
            posts = err_args.posts,
            errors = {};
        errors = lcsAp.getMsgI18Nrest(posts.msgno, posts.text);
        console.log(JSON.stringify(errors));
        // エラーレスポンスを返す
        res.writeHead(errors.httpstatus, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Chrome用のおまじない
        });
        res.end(JSON.stringify(errors),'utf8');
    }
}

/**
 * 画面表示
 * @module dspWin
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    if (args.type == 'csv') {
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Access-Control-Allow-Origin': '*' // Chrome用のおまじない
        });
        res.end(posts.res,'utf8');
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Chrome用のおまじない
        });
        res.end(JSON.stringify(posts.res),'utf8');
    }
    nextDo(null, args);
}

/**
 * エラー履歴 確認登録
 * @module upResulterror
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function upResulterror(args, nextDo) {
    var adt = args.adt, 
        sql = "",
        bind = [];

    sql += "" +
        "update rest_machine_result_error set " +
        "  confirm = 1, confirmComment = ?, " +
        "  confirmUser = ? " + 
        "where" +
        "  id = ? " +
        "";
    bind = [adt.confirmComment, adt.confirmUser, adt.id];

    lcsDb.query(sql, bind, function(err, results) {
        if (err) {
            args.posts.msgno = 99;
            args.posts.text = err.message;
            args.dberr = err;
            nextDo(args);
            return;
        }
        nextDo(null, args);
    });
}
/**
 *  insProof
 */
function insProof(args, callback) {
    var ary = [];
    var str = '';

    /* insert into t_proof */
    var insSql = 'insert into t_proof (initial_date, text) ' +
        'values (CURRENT_TIMESTAMP(),?)';

    for (var key in args.adt) {
        str += key + ':' + args.adt[key] + ';';
    }
    ary = [str];
    lcsDb.query(insSql, ary, function(err, results) {
        if (err) {
            args.posts.msgno = 99;
            args.posts.text = err.message;
            args.dberr = err;
            callback(args);
            return;
        }
        callback(null, args);
    });
}

function upEnd(args, nextDo) {
    args.posts.res = {};
    args.posts.res.msgno = 0;
    args.posts.res.text = "正常終了";
    nextDo(null, args);
}

/**
 * エラー履歴 確認登録
 * @module postResulterror
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function postResulterror(args, nextDo) {
    var adt = {};

    adt.id = args.keys.id;
    adt.confirmComment = args.keys.confirmComment;
    adt.confirmUser = args.keys.confirmUser;
    args.adt = adt;
    args.type = "json";
    lcsAp.correct(args, [
                         upResulterror,
                         insProof,
                         upEnd
                         ],
                  nextDo);
}
/**
 * Check Post
 * @module checkPost
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function checkPost(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    args.keys = {};
    for (var key in req.body) {
        if (key == 'id') {
            args.keys.id = req.body[key];
        }else if (key == 'confirmComment') {
            args.keys.confirmComment = req.body[key];
        }else if (key == 'confirmUser') {
            args.keys.confirmUser = req.body[key];
        }
    }
    if (typeof args.keys.id === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "ID 無し";
        nextDo(args);
        return;
    }
    if (typeof args.keys.confirmComment === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "confirmComment 無し";
        nextDo(args);
        return;
    }
    if (typeof args.keys.confirmUser === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "confirmUser 無し";
        nextDo(args);
        return;
    }

    nextDo(null, args);
}
/**
 * エラー履歴
 * @module getResulterror
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function getResulterror(args, nextDo) {
    var req = args.req, 
        res = args.res, 
        posts = args.posts,
        keys = args.keys,
        sql = "",
        bind = [];

    sql += "" +
        "select " +
        "  id, machineNo, DATE_FORMAT(date,'%Y%m%d%H%i') as date, machineName, " +
        "  code, errorText, confirm, confirmComment, " +
        "  confirmUser " + 
        "from rest_machine_result_error " +
        "where" +
        "  machineNo = ? " +
        "  and dateChar >= ? " +
        "  and dateChar <= ? " +
        "order by date " + 
        "";
    bind = [keys.machineNo, keys.fromDate, keys.toDate];

    lcsDb.query(sql, bind, function(err, results, fields) {
        if (err) {
            args.posts.msgno = 99;
            args.posts.text = err.message;
            args.dberr = err;
            nextDo(args);
            return;
        }
        if (!results.length) {
            args.posts.msgno = 102;
            args.posts.text = "machineNo=[" + args.keys.machineNo + "]";
            nextDo(args);
            return;
        }

        if (args.type == 'csv') {
            args.posts.res = "";
        } else {
            args.posts.res = {recode:[]};
        }
        for (var i = 0, imax = results.length; i < imax; i++) {
            var stock_rows = results[i];
            if (args.type == 'csv') {
                args.posts.res += stock_rows.id + ',';
                args.posts.res += stock_rows.date + ',';
                args.posts.res += stock_rows.code + ',';
                args.posts.res += '\"' + stock_rows.errorText + '\",';
                args.posts.res += (stock_rows.confirm ? 'true' : 'false') + ',';
                args.posts.res += '\"' + stock_rows.confirmComment + '\",';
                args.posts.res += '\"' + stock_rows.confirmUser + '\",';
                args.posts.res += '\n';
            } else {
                args.posts.res.recode[i] = {};
                args.posts.res.recode[i].id = stock_rows.id;
                args.posts.res.recode[i].date = stock_rows.date;
                args.posts.res.recode[i].code = stock_rows.code;
                args.posts.res.recode[i].errorText = stock_rows.errorText;
                args.posts.res.recode[i].confirm = stock_rows.confirm ? true : false;
                args.posts.res.recode[i].confirmComment = stock_rows.confirmComment;
                args.posts.res.recode[i].confirmUser = stock_rows.confirmUser;
            }
        }
        nextDo( null, args );
    });
}

/**
 * Validation Query
 * @module validQuery
 * @param  {Object}args, {function}nextDo
 * @date   14/May/2013
 */
function validQuery(args, nextDo) {
    var req = args.req, 
        res = args.res, 
        posts = args.posts,
        keys = args.keys;

    lcsUI.checkValrest([
        {"form":keys.fromDate, "column":"rest.machine.fromDate"}, 
        {"form":keys.toDate, "column":"rest.machine.toDate"} 
    ], function(err) {
        //console.log(keys.fromDate);
        if (err) {
            args.posts.msgno = err[0];
            args.posts.text = "parameter of fromDate or toDate.";
            nextDo(args);
            return;
        }
        nextDo(null, args);
        return;
    });
}
/**
 * Check Query
 * @module checkQuery
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function checkQuery(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    var urlAp = req.params.ap2.split('.');
    if (typeof urlAp[1] === 'undefined') {
        args.type = 'json';
    } else if (urlAp[1] === 'json') {
        args.type = 'json';
    } else if (urlAp[1] === 'csv') {
        args.type = 'csv';
    } else {
        args.posts.msgno = 11;
        args.posts.text = "出力形式=[" + urlAp[1] + "]";
        nextDo(args);
        return;
    }

    args.keys = {};
    for (var key in req.query) {
        if (key == 'machineNo') {
            args.keys.machineNo = req.query[key];
        }else if (key == 'fromDate') {
            args.keys.fromDate = req.query[key];
            if (args.keys.fromDate.length == 8) {
                args.keys.fromDate += '0000';
            }
        }else if (key == 'toDate') {
            args.keys.toDate = req.query[key];
            if (args.keys.toDate.length == 8) {
                args.keys.toDate += '2359';
            }
        }
    }
    if (typeof args.keys.machineNo === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "machineNo 無し";
        nextDo(args);
        return;
    }
    if (typeof args.keys.fromDate === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "fromDate 無し";
        nextDo(args);
        return;
    }
    if (typeof args.keys.toDate === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "toDate 無し";
        nextDo(args);
        return;
    }

    nextDo(null, args);
}

/**
 * データ更新
 * @module postExecute
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   14/may/2012
 */
function postExecute(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,[
                 checkPost,
                 postResulterror,
                 dspWin], /* 後処理 */
                 finSync );
}

/**
 * データ取得
 * @module queryExecute
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   14/may/2012
 */
function queryExecute(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,[
                 checkQuery,
                 validQuery,
                 getResulterror,
                 dspWin], /* 後処理 */
                 finSync );
}

/**
 * エラー
 * @module errDisp
 * @param  {Object}req, {Object}res, {Object}posts, {number}err
 * @date   21/sep/2012
 */
function errDisplay(req, res, posts, err) {
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.msgno = err;
    args.posts.text = "";
    finSync(args);
}

/**
 * main routine
 * @module main
 * @param  {Object}req
 * @param  {Object}res
 * @date   5/May/2013
 */
exports.main = function(req, res){
    var posts = {},
        methodOffunction = {/* type of method */
        "GET": queryExecute,
        "POST": postExecute,
        "*" : errDisplay
    };

    for (var key1 in methodOffunction) {
        if (key1 === req.method) {
            if (typeof methodOffunction[key1] === "function") {
                methodOffunction[key1](req, res, posts);
                return;
            }
        }
    }
    /*規定外のメソッドタイプです*/
    if (typeof methodOffunction["*"] === "function") {
        methodOffunction["*"](req, res, posts, 2);
        return;
    }
    return;
};

