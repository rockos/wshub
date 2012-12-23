var fs = require('fs');

/**
 * doSync finally
 * @param {Object} err : contents of error-code.
 * @param {Object} args : method "err" throw on error screen and error log.
 * @remark Error is caught if 1st-parameter value defined.
 *         and rendering to error screen.
 */
function finSync(err_args) {
    if (err_args) {
        // エラー画面表示
        lcsUI.showError(err_args, err_args.errmsg);
    }
}

/**
 * 画面表示
 * @module dspWin
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    posts.scrNo = req.url.substr(1);
    res.render(posts.scrNo, posts);
    nextDo(null, args);
}

/**
 * デモ キャンセル 正常
 * @module 
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function delOK(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //**** デモ中 ***********************************************************
    var msg = lcsAp.getMsgI18N("0");
    args.posts.mesg = msg.text;
    args.posts.mesg = "キャンセルしました";
    args.posts.mesg_lavel_color = msg.warn;
    nextDo( null, args );
    //***********************************************************************
}

/**
 * デモ 出庫 正常
 * @module 
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function addOK(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //**** デモ中 ***********************************************************
    var msg = lcsAp.getMsgI18N("0");
    args.posts.mesg = msg.text;
    args.posts.mesg = "出庫開始しました";
    args.posts.mesg_lavel_color = msg.warn;
    nextDo( null, args );
    //***********************************************************************
}

/**
 * デモ 照会 正常
 * @module 
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function iqyOK(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //**** デモ中 ***********************************************************
    if (req.body.sel1 == 'USE001' ||
        req.body.sel1 == 'USE004' ||
        req.body.sel1 == 'USE007' ||
        req.method == 'GET') {
        var msg = lcsAp.getMsgI18N("0");
        args.posts.mesg = msg.text;
        args.posts.mesg_lavel_color = msg.warn;
    } else {
        var msg = lcsAp.getMsgI18N("0");
        //args.posts.mesg = msg.text;
        args.posts.mesg = "その会員番号の出庫予定はありません";
        args.posts.mesg_lavel_color = msg.warn;
        args.errmsg = msg;
        args.errmsg.text = "その会員番号の出庫予定はありません";
        nextDo(args);
        return;
    }

    nextDo( null, args );
    //***********************************************************************
}

/**
 * テーブルリストを取得する
 * @module postData2
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function postData2(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest003.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    args.posts.table.tab2 = ddd.tab2;
    args.posts.table.dsp["tab2"]="1";
    nextDo( null, args );
    //***********************************************************************

}

/**
 * テーブルリストを取得する
 * @module postData1
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function postData1(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest002.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    args.posts.table.tab1 = ddd.tab1;
    args.posts.table.dsp["tab1"]="1";
    nextDo( null, args );
    //***********************************************************************

}

/**
 * optionリストを取得する
 * @module optionsDsp
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
function optionsDsp(args, nextDo) {
    var req = args.req, res = args.res;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest001.json";
    args.posts.select = JSON.parse(require('fs').readFileSync(__file));
    if (req.method == 'GET') {
        args.posts.text.txt1 = "";
    } else {
        args.posts.text.txt1 = req.body.sel1;
    }
   
    nextDo( null, args );
    //***********************************************************************

}

/**
 * キャンセル押下時の処理
 * @module delPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function delPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  optionsDsp,
                  delOK,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * 出庫押下時の処理
 * @module addPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function addPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  optionsDsp,
                  addOK,
                  dspWin], /* 後処理 */
                 finSync );
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
    args.posts.step = "1";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  postData1,
                  postData2,
                  optionsDsp,
                  iqyOK,
                  dspWin], /* 後処理 */
                 finSync );
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
                  optionsDsp,
                  iqyOK,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * エラー
 * @module errDisp
 * @param  {Object}req, {Object}res, {Object}posts, {number}err
 * @date   21/sep/2012
 */
function errDisp(req, res, posts, err) {
    var args = {"req": req, "res": res, "posts": posts};
    args.errmsg = lcsAp.getMsgI18N(err);
    finSync(args);
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
            "*" : errDisp
        },
        "*" : errDisp
    };


    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame, 801);
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

