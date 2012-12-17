'use strict';
/* common file include */
/*
var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsDb = require(rootdir + 'lib/db/lcsdb').create('TST', rootdir+'etc/db.cf');
*/
/* local file */
var UPSTR = require('./upstr.js');



var validator = require('validator').Validator;
validator.prototype.error = function(msg) {
    return this._errors.push(msg);
}
validator.prototype.getErrors = function(msg) {
    return this._errors;
}

var mParse = new validator();




/*
 * Mar-25-2012
 */
function showPart(req, res, posts) {
    var sql ='select * from part order by pcode';
    var results, fields;
    
    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                console.log('err: ' + err);
            };


            posts.tab = results;
            for( var i=0,max=posts.tab.length; i<max; i++ ) {
                posts.tab[i].radiodata = 
                    posts.tab[i].pcode + "," +
                    posts.tab[i].sqty + "," +
                    posts.tab[i].pnam + "," +
                    posts.tab[i].lotn + "," +
                    posts.tab[i].mem1 + "," +
                    posts.tab[i].mem2 + "," +
                    posts.tab[i].mem3;
            }

            posts.frameNavi.userid = (req.session.userid)? req.session.userid:'undefined';
            //            lcsAp.getScrInfI18N(scrinf);


            var msg = lcsAp.getMsgI18N("0");
            posts.mesg = msg.text;
            posts.mesg_lavel_color = msg.warn;

            /*
            [posts.mesg, posts.mesg_lavel_color] = lcsAp.getMsgI18N(String(err));
            */
            posts.dspcstm = new Array;
            posts.dspcstm["corp"] = "hidden";
            posts.dspcstm["priv"] = "hidden";
            posts.dspcstm["vist"] = "hidden";
            if( req.method=="POST" ) {
                switch( req.body.dspcstm ) {
                case "corp":
                    posts.dspcstm["corp"] = "";
                    posts.dspcstm_val = "corp";
                    break;
                case "priv":
                    posts.dspcstm["priv"] = "";
                    posts.dspcstm_val = "priv";
                    break;
                case "vist":
                    posts.dspcstm["vist"] = "";
                    posts.dspcstm_val = "vist";
                    break;
                case "default":
                    posts.dspcstm["corp"] = "";
                    posts.dspcstm_val = "corp";
                    break;
                }
            } else {
                var str = req.url.replace(/\.+/,'').split('/');
                switch( str[2] ) {
                case "201":
                    posts.dspcstm["corp"] = "";
                    posts.dspcstm_val = "corp";
                    break;
                case "202":
                    posts.dspcstm["priv"] = "";
                    posts.dspcstm_val = "priv";
                    break;
                case "203":
                    posts.dspcstm["vist"] = "";
                    posts.dspcstm_val = "vist";
                    break;
                default:
                    posts.dspcstm["corp"] = "";
                    posts.dspcstm_val = "corp";
                    break;
                }
            }

            res.render('scr/scr201', posts);


        });
};


/*
 *  暫定
 */
function dspWin(err, args) {

    //Login user用
    args.post.userid = (args.req.session.userid) ? args.req.session.userid:'undefined';

    if (!err) err = 0;

    var msg = lcsAp.getMsgI18N(String(err));
    args.post.mesg = msg.text;
    args.post.mesg_lavel_color = msg.warn;
    /*
    [args.post.mesg, args.post.mesg_lavel_color] = lcsAp.getMsgI18N(String(err));
    */

    args.post.dspcstm = new Array;
    args.post.dspcstm["corp"] = "hidden";
    args.post.dspcstm["priv"] = "hidden";
    args.post.dspcstm["vist"] = "hidden";
    switch( args.req.body.dspcstm ) {
    case "corp":
        args.post.dspcstm["corp"] = "";
        args.post.dspcstm_val = "corp";
        break;
    case "priv":
        args.post.dspcstm["priv"] = "";
        args.post.dspcstm_val = "priv";
        break;
    case "vist":
        args.post.dspcstm["vist"] = "";
        args.post.dspcstm_val = "vist";
        break;
    default:
        args.post.dspcstm["corp"] = "";
        args.post.dspcstm_val = "corp";
        break;
    }

    args.res.render('scr/scr201', args.post);

}
/*
 * 後処理関数
 */
function postData(args, nextExec) {
    var sql ='select * from part order by pcode';
    var results, fields;

    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                lcsAp.log('err: ' + err);
            };

            args.post.title = 'check in';
            args.post.tab = results;

            for( var i=0,max=args.post.tab.length; i<max; i++ ) {
                args.post.tab[i].radiodata = 
                    args.post.tab[i].pcode + "," +
                    args.post.tab[i].sqty + "," +
                    args.post.tab[i].pnam + "," +
                    args.post.tab[i].lotn + "," +
                    args.post.tab[i].mem1 + "," +
                    args.post.tab[i].mem2 + "," +
                    args.post.tab[i].mem3;
            }


            //            args.post.userid = args.req.session.userid;

            if (!err) err = 0;

            var msg = lcsAp.getMsgI18N(String(err));
            args.post.mesg = msg.text;
            args.post.mesg_lavel_color = msg.warn;

            /*
            [args.post.mesg, args.post.mesg_lavel_color] = lcsAp.getMsgI18N(String(err));
            */
            nextExec( null, args);
            return;
        });
};

function parseData(args, nextExec) {

    var err = 0, errtext ='', msgobj={};

    /* empty function */
    debugger;

    mParse.check(args.req.body['pcode']).len(5);
    errtext = mParse.getErrors();  

    if (errtext) {
        msgobj = lcsAp.getMsgI18N('101');
        args.post.mesg = msgobj.text;
        args.res.render('scr/error', args.post);
        nextExec( emsg, args);        
    }

    nextExec( null, args);

}
/*
 *
 *
 */
function addStr(req, res, posts) {
    
    /*ex.*/
    var post = {};
    var args = {};
    /*
    lcsAp.waterfall( req, res, post,
                     [parseData, // 入力チェック
                      UPSTR._upAddStr, // データベース登録 upstr.js
                      postData], // 後処理
                     dspWin );
    */

    args.req = req;
    args.res = res;
    args.post = posts;
    args.post.frameNavi.userid =  (req.session.userid)? req.session.userid:'undefined';
    lcsAp.sync(args,
               [parseData, /* 入力チェック*/
                UPSTR._upAddStr, /* データベース登録 upstr.js */
                postData], /* 後処理 */
               dspWin );
}

/*
 * delete inventry
 *
 */
function delStr(req, res, posts) {

    var args = {};
    args.req = req;
    args.res = res;
    args.post = posts;
    args.post.frameNavi.userid =  (req.session.userid)? req.session.userid:'undefined';

    lcsAp.sync(args,
               [parseData, /* 入力チェック*/
                UPSTR._upDelStr,
                postData], /* 後処理 */
               dspWin );

}
/*
 * modification of inventry
 *
 */
function modStr(req, res, posts) {

    var args = {};

    args.req = req;
    args.res = res;
    args.post = posts;
    args.post.frameNavi.userid =  (req.session.userid)? req.session.userid:'undefined';

    lcsAp.sync(args,
               [parseData, /* 入力チェック*/
                UPSTR._upModStr,
                postData], /* 後処理 */
               dspWin );

}
/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res, frame){

    var posts = {};
    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
    //    try {

    if (!lcsAp.isSession(req.session)) {
             res.redirect('/');
    }
    
    if (req.body['QRY']) {
        showPart(req, res, posts);
    } else if (req.body['ADD']) {
        /*            var posts = JSON.parse(require('fs').readFileSync(file));
         */
        addStr(req, res, posts);
    } else if (req.body['DEL']) {
        delStr(req, res, posts);

    } else if (req.body['MOD']) {
    debugger;
        modStr(req, res, posts);

    } else {

        showPart(req, res, posts);
    }
    /*
      } catch(e) {
        lcsAp.log(e.stack);
        res.redirect('/');
        
        } 
    */
};


