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
 * 機械ステータス
 * @module getStatus
 * @param  {Object}args, {function}nextDo
 * @date   8/May/2013
 */
function getStatus(args, nextDo) {
    var req = args.req, 
        res = args.res, 
        posts = args.posts,
        sql = "",
        bind = [];

    sql += "" +
        "select " +
        "  machineName, machineNo, switch, mode, elePow, " +
        "  revNum, tempMc, pressMc, errorText, errorCode " +
        "from rest_machine " +
        "where " +
        "  machineNo = ? " +
        "";
    bind = [args.keys.machineNo];
    sql += "order by machineNo ";

    lcsDb.query(sql, bind, function(err, results, fields) {
        if (err) {
            args.posts.msgno = 99;
            args.posts.text = err.message;
            args.dberr = err;
            nextDo(args);
            return;
        }
        var stock_rows = results;
        if (!stock_rows.length) {
            args.posts.msgno = 101;
            args.posts.text = "machineNo=[" + args.keys.machineNo + "]";
            nextDo(args);
            return;
        }
        if (args.type == 'csv') {
            args.posts.res = "";
            args.posts.res += (stock_rows[0].switch ? 'true' : 'false') + ",";
            args.posts.res += stock_rows[0].mode + ",";
            args.posts.res += stock_rows[0].elePow + ",";
            args.posts.res += stock_rows[0].revNum + ",";
            args.posts.res += stock_rows[0].tempMc + ",";
            args.posts.res += stock_rows[0].pressMc + ",";
            args.posts.res += "\"" + stock_rows[0].errorText + "\"\n";
            nextDo( null, args );
        } else {
            args.posts.res = {};
            args.posts.res.switch = stock_rows[0].switch ? true : false;
            args.posts.res.mode = stock_rows[0].mode;
            args.posts.res.elePow = stock_rows[0].elePow;
            args.posts.res.revNum = stock_rows[0].revNum;
            args.posts.res.tempMc = stock_rows[0].tempMc;
            args.posts.res.pressMc = stock_rows[0].pressMc;
            args.posts.res.errorText = stock_rows[0].errorText;
            nextDo( null, args );
        }
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

    var urlAp = req.params.ap.split('.');
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
        }
    }
    if (typeof args.keys.machineNo === 'undefined') {
        args.posts.msgno = 12;
        args.posts.text = "machineNo 無し";
        nextDo(args);
        return;
    }

    nextDo(null, args);
}

/**
 * データ取得
 * @module getQuery
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function queryExecute(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,[
                 checkQuery,
                 getStatus,
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

