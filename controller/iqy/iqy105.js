
var rootdir = process.env.ROCKOS_ROOT;
//var lcsAp = require(rootdir + 'lib/ap/lcsap').create('IQY105');

var mongoose = require('mongoose');

var _schema_gndlog = new mongoose.Schema({

        //法人／会員／ゲスト
        jiss_name: String,
        //入庫/出庫
        jiss_state: String,
        // 2009.01---2012.12
        jiss_date: Date

    });
var lcsMog = require(rootdir +'lib/db/lcsmog').create('appServer',rootdir +'etc/mongo.cf', _schema_gndlog, "jisslogs" );

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
 * optionsFyear
 * @module optionsFyear
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   16/jul/2012
 */
function optionsFyear(req, res, posts, callback) {

    var limit = 3, //何年前から表示するか
        d = new Date,
        y,
        m,
        y_opt = {},
        m_opt = {};

    for( var i=limit,j=0; i>=0; i--,j++ ) {
        y_opt = {};
        y = d.getFullYear() - i;
        y_opt.key = y + "";
        y_opt.value = y + "";
        if( req.body.fyear ) {
            if( req.body.fyear == y ) {
                y_opt.selected = "selected";
            } else {
                y_opt.selected = "";
            }
        } else {
            if( i == 1 ) {
                //initSendのときは１年前をデフォルトに取る
                y_opt.selected = "selected";
            } else {
                y_opt.selected = "";
            }
        }
        posts.options.fyear.push(y_opt);
    }

    for( var i=1; i<=12; i++ ) {
        m_opt = {};
        m = d.getMonth()+1;
        m_opt.key = i + "";
        m_opt.value = i + "";
        if( req.body.fmonth ) {
            if( req.body.fmonth == i ) {
                m_opt.selected = "selected";
            } else {
                m_opt.selected = "";
            }
        } else {
            if( i == m ) {
                m_opt.selected = "selected";
            } else {
                m_opt.selected = "";
            }
        }
        posts.options.fmonth.push(m_opt);
    }

    callback( null, req, res, posts );
}

/**
 * optionsTyear
 * @module optionsTyear
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   16/jul/2012
 */
function optionsTyear(req, res, posts, callback) {

    var limit = 3, //何年前から表示するか
        d = new Date,
        y,
        m,
        y_opt = {},
        m_opt = {};

    for( var i=limit,j=0; i>=0; i--,j++ ) {
        y_opt = {};
        y = d.getFullYear() - i;
        y_opt.key = y + "";
        y_opt.value = y + "";
        if( req.body.tyear ) {
            if( req.body.tyear == y ) {
                y_opt.selected = "selected";
            } else {
                y_opt.selected = "";
            }
        } else {
            if( i == 0 ) {
                y_opt.selected = "selected";
            } else {
                y_opt.selected = "";
            }
        }
        posts.options.tyear.push(y_opt);
    }

    for( var i=1; i<=12; i++ ) {
        m_opt = {};
        m = d.getMonth()+1;
        m_opt.key = i + "";
        m_opt.value = i + "";
        if( req.body.tmonth ) {
            if( req.body.tmonth == i ) {
                m_opt.selected = "selected";
            } else {
                m_opt.selected = "";
            }
        } else {
            if( i == m ) {
                m_opt.selected = "selected";
            } else {
                m_opt.selected = "";
            }
        }
        posts.options.tmonth.push(m_opt);
    }

    callback( null, req, res, posts );
}

/**
 * dataJiss
 * @module dataJiss
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   16/jul/2012
 */
function dataJiss(req, res, posts, callback) {

    //posts.jiss_counter = 0;
    var nd = new Date,
        y,
        m,
        fd,
        td,
        xd,
        fff,
        ttt;
    y = req.body.fyear;
    m = req.body.fmonth;
    fd = new Date(y,m-1,nd.getDay());
    xd = new Date(y,m-1+posts.jiss_counter,nd.getDay());
    y = req.body.tyear;
    m = req.body.tmonth;
    td = new Date(y,m-1,nd.getDay());

    if( xd.getFullYear() >= td.getFullYear() && xd.getMonth() > td.getMonth() ) {
        callback( null, req, res, posts );
        return;
    }
    if( xd.getFullYear() > td.getFullYear() ) {
        callback( null, req, res, posts );
        return;
    }
    if( posts.jiss_counter > 100 ) {
        callback( 5, req, res, posts );
        return;
    }

    y = xd.getFullYear();
    m = xd.getMonth()+1;

    fff = new Date( y, m-1, 1 );
    ttt = new Date( y, m, 1 );
/*
//法人／会員／ゲスト
jiss_name: String,
//入庫/出庫
jiss_state: String,
// 2009.01---2012.12
jiss_date: Date
*/
    if( m==1 ) {
        posts.categories[posts.jiss_counter] = y + "/" + m;;
    }else{
        posts.categories[posts.jiss_counter] = m;
    }

    // 法人
    lcsMog.findCount( 
        {
            jiss_date : { $gte : fff ,$lt : ttt },
            jiss_name : "法人"            
        }, function( err, docs ) {
            if ( err ) {
                lcsAp.log( err );
                callback( 4, req, res, posts );
                return;
            }
            posts.jisscount1[posts.jiss_counter] = docs;

            // 個人
            lcsMog.findCount( 
                {
                    jiss_date : { $gte : fff ,$lt : ttt },
                    jiss_name : "個人"            
                }, function( err, docs ) {
                    if ( err ) {
                        lcsAp.log( err );
                        callback( 4, req, res, posts );
                        return;
                    }
                    posts.jisscount2[posts.jiss_counter] = docs;

                    // ゲスト
                    lcsMog.findCount( 
                        {
                            jiss_date : { $gte : fff, $lt : ttt },
                            jiss_name : "ビジター"            
                        }, function( err, docs ) {
                            if ( err ) {
                                lcsAp.log( err );
                                callback( 4, req, res, posts );
                                return;
                            }
                            posts.jisscount3[posts.jiss_counter] = docs;
                            posts.jiss_counter++;


                            //再帰してDataGETを繰り返す
                            dataJiss(req, res, posts, callback);
                        });
                });
        });
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
    posts.graph_type = req.body.chk1;

    // check box へ出力

    // radio box へ出力
    posts.checkbox.chk1[req.body.chk1] = "checked";

    posts.jiss_counter = 0;

    lcsAp.waterfall( req, res, posts,
                     [
                      dmyDsp,
                      optionsFyear,
                      optionsTyear,
                      dataJiss
                     ], dspWin );
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

    // check box へ出力

    // radio box へ出力
    posts.checkbox.chk1['line'] = "checked";

    posts.jiss_counter = 0;

    lcsAp.waterfall( req, res, posts,
                     [
                      dmyDsp,
                      optionsFyear,
                      optionsTyear
                     ], dspWin );

}

/**
 * 実績グラフ/main routine
 * @module iqy105.main
 * @param  {Object}req, {Object}res
 * @date   16/jul/2012
 */
exports.main = function(req, res, frame){

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
    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

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
