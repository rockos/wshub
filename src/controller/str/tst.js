'use strict';
/* common file include */
/*
var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsDb = require(rootdir + 'lib/db/lcsdb').create('TST', rootdir+'etc/db.cf');
*/
/* local file */
var UPSTR = require('./upstr.js');

var lang = 'jp';

/*
 * Mar-25-2012
 */
function showPart(req, res) {
    var sql ='select * from part order by pcode';
    var results, fields;
    
    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                console.log('err: ' + err);
            };


            var posts = {'title':'入庫画面','scrhead':'MySQLを使った画面','comment':'JSON Data','tab':results};

            posts.userid = (req.session.userid)? req.session.userid:'undefined';
            //            lcsAp.getScrInfI18N(scrinf);
            debugger;
            //lcsAp.getMsgI18N("0", posts.mesg, posts.mesg_lavel_color);
            var msg = lcsAp.getMsgI18N("0");
            posts.mesg = msg.text;
            posts.mesg_lavel_color = msg.warn;


            res.render('scr/scr201', posts);


        });
};


/*
 *  暫定
 */
function dspWin(err, req, res, posts) {

    //Login user用
    posts.userid = (req.session.userid)?req.session.userid:'undefined';

    if (!err) err = 0;
    var msg = lcsAp.getMsgI18N(String(err));
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render('scr/scr201', posts);

}
/*
 * 後処理関数
 */
function postData(req, res, post, nextExec) {
    var sql ='select * from part order by pcode';
    var results, fields;

    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                lcsAp.log('err: ' + err);
            };

            post.title = 'check in';
            post.tab = results;

            post.userid = (req.session.userid)? req.session.userid:'undefined';

            if (!err) err = 0;
            var msg = lcsAp.getMsgI18N(String(err));
            post.mesg = msg.text;
            post.mesg_lavel_color = msg.warn;


            nextExec( null, req, res, post );
            return;
        });
};

function parseData(req, res, post, nextExec) {
    /* empty function */
    var dmy = 0;

    nextExec( null, req, res, post );

}
/*
 *
 *
 */
function addStr(req, res) {
    
    /*ex.*/
    var post = {};
    lcsAp.waterfall( req, res, post,
                     [parseData, /* 入力チェック*/
                      UPSTR._upAddStr, /* データベース登録 upstr.js */
                      postData], /* 後処理 */
                     dspWin );

}

/*
 *
 *
 */
function delStr(req, res) {

    /*ex.*/
    var post = {};
    debugger;
    lcsAp.waterfall( req, res, post,
                     [parseData, /* 入力チェック*/
                      UPSTR._upDelStr,
                      postData], /* 後処理 */
                     dspWin );

}
/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res){

    //    try {
    debugger;
    if (!lcsAp.isSession(req.session)) {
             res.redirect('/');
    }
    
    if (req.body['QRY']) {
        showPart(req, res);
    } else if (req.body['ADD']) {
        /*            var posts = JSON.parse(require('fs').readFileSync(file));
         */
        addStr(req, res);
    } else if (req.body['DEL']) {
        delStr(req, res);
    } else if (req.body['LAN']) {
        debugger;

        if (lang == 'jp') {
            /*            WebMain.configure(function () {
                    WebMain.set('views', process.env.LOCOS_DEV + '/views/en');
                });
            */
            lcsAp.setLangI18N('en');
            lang = 'en';
        } else {
            /*
            WebMain.configure(function () {
                    WebMain.set('views', process.env.LOCOS_DEV + '/views/jp');
                });
            */
            lcsAp.setLangI18N('jp');
            lang = 'jp';
        }


        showPart(req, res);

    } else {

        showPart(req, res);
    }
    /*
      } catch(e) {
        lcsAp.log(e.stack);
        res.redirect('/');
        
        } 
    */
};


/*
  fs.readFile('/data/iqy.json'', "utf-8", function (err, data) {
  time = 0;
  data = data.split('\n').forEach(function (val, i) {
  time += +val
    })
        r = parseInt((time/60))+'\n'+(time%60)

	    fs.writeFile(file, r);
    });
*/