var fs = require('fs');


/**
 * 画面表示
 * @module dspWin
 * @param  {number}err, {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   30/jun/2012
 */
function dspWin(err, req, res, posts) {

    //Login user用
    posts.userid = (req.session.userid)?req.session.userid:'undefined';

    if( err ){
        lcsAp.log('winDsp error : '+err);
        /*規定外のメソッドタイプです*/
        var mmm = lcsAp.getMsgI18N(err);
        posts.mesg = mmm.text;
        posts.mesg_level_color = mmm.warn;

        res.render(posts.scrNo, posts);
        return;
    }

    res.render(posts.scrNo, posts);
}

/**
 * "dummy"
 * @module dmyDsp
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   30/jun/2012
 */
function dmyDsp(req, res, posts, callback) {

    callback( null, req, res, posts );
}

/**
 * 最新表示押下時の処理
 * @module showoDemo
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   30/jun/2012
 */
function showDemo(req, res, posts) {

    // information bar へ出力
    //posts.mesg = '';

    // text object へ出力

    // check box へ出力

    posts.socket_io_start = "1";

    lcsAp.waterfall( req, res, posts,
                     [dmyDsp], dspWin );
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   30/jun/2012
 */
function initSend(req, res, posts) {

    // information bar へ出力
    //posts.mesg = '';

    // text object へ出力

    //check box へ出力

    posts.socket_io_start = "1";
    //posts.graph104 = JSON.parse(require('fs').readFileSync("./controller/iqy/graph104.json"));

    lcsAp.waterfall( req, res, posts,
                     [dmyDsp], dspWin );
}

/**
 * 作業モニタ/main routine
 * @module iqy104.main
 * @param  {Object}req, {Object}res
 * @date   29/jun/2012
 */
exports.main = function(req, res){

    var posts = {};

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
        return;
    }

    posts = lcsAp.initialz_posts( req, posts );
    if( !posts ) {
        res.redirect('/');
        return;
    }

    if( req.method=="GET" ) {
        /*GET メソッド*/
        initSend( req, res, posts );
    }else if( req.method=="POST" ){
        /*POST メソッド*/
        if ( req.body.send_iqy ) {
            showDemo(req, res, posts);
        } else {
            /*規定外のボタンです*/
            dspWin( 3, req, res, posts );
        }
    }else{
        /*規定外のメソッドタイプです*/
        dspWin( 2, req, res, posts );
    }

};
