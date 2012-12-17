'use strict';
/* common file include */
var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsDb = require(rootdir + 'lib/db/lcsdb').create('TST', rootdir+'etc/db.cf');

/* local file */
var UPSTR = require('./upstr.js');


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
            /* for debug
               console.log('results=> ',results);
               console.log('results[0].pcode=> ',results[0].pcode);
               console.log('dsp.dcrheade=> ',dsp.scrhead);
               console.log('dsp.tab[0]=> ',dsp.tab[0]);
               
            */

            posts.userid = (req.session.userid)? req.session.userid:'undefined';
            posts.mesg = 'ここは警告表示行';
            
            res.render('scr/scr201', posts);


        });
};

/*
 * Mar-28-2012
 */
function insPart(adt, callback) {

    /* insert into PART */
    var insSql ='insert into part (pcode,sqty,lotn,mem1,mem2,mem3,pnam) ';
	insSql += 'values (?,?,?,?,?,?,?)';
    var ary = [];
    ary = [adt.pcode, adt.sqty, adt.lotn, adt.mem1, adt.mem2, adt.mem3, adt.pnam];
    lcsDb.cmnd(insSql, ary, adt, callback);
}
/*
 * jul-9-2012
 */
function insUlog(adt, callback) {

    /* insert into ULOG */
    var insSql ='insert into ulog (userid,pcode,oper,udat) ';
	insSql += 'values (?,?,?,?)';
    var ary = [];
    ary = [adt.usrid, adt.pcode, adt.oper, adt.udat];

    lcsDb.cmnd(insSql, ary ,adt, callback);
}


/*
 *  暫定
 */
function dspWin(err, req, res, posts) {

    //Login user用
    posts.userid = (req.session.userid)?req.session.userid:'undefined';
    posts.mesg = '処理終了';
    posts.mesg_level_color = 'operationPanel_warning';

    if( err ){
        lcsAp.log('winDsp error : '+err);
        switch(err){
        case 2:
            /*規定外のメソッドタイプです*/
            posts.mesg = '規定外のメソッドタイプです';
            posts.mesg_level_color = 'operationPanel_fatal';
            break;
        case 3:
            /*規定外のボタンです*/
            posts.mesg = '規定外のボタンです';
            posts.mesg_level_color = 'operationPanel_fatal';
            break;
        case 4:
            /*DB Error*/
            posts.mesg = 'データベースエラー';
            posts.mesg_level_color = 'operationPanel_fatal';
            break;
        default:
            posts.mesg = 'その他エラー';
            posts.mesg_level_color = 'operationPanel_warning';
        }

        res.render('scr/scr201', posts);
        return;
    }

    res.render('scr/scr201', posts);

}

function showPart2(req, res, post, nextExec) {
    var sql ='select * from part order by pcode';
    var results, fields;

    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                console.log('err: ' + err);
            };

            /*
              var xx={'title':'入庫画面','scrhead':'MySQLを使った画面','comment':'JSON Data','tab':results};
            */
            post.title = 'チェックイン';
            post.tab = results;
            /* for debug
               console.log('results=> ',results);
               console.log('results[0].pcode=> ',results[0].pcode);
               console.log('dsp.dcrheade=> ',dsp.scrhead);
               console.log('dsp.tab[0]=> ',dsp.tab[0]);
               
            */

            post.userid = (req.session.userid)? req.session.userid:'undefined';
            post.mesg = 'ここは警告表示行';

            //dspWinでやる
            //res.render('scr/scr201', posts);
            nextExec( null, req, res, post );
            return;
        });
};
/*
 *
 *
 */
function upAddStr(req, res, post, nextExec) {

    var upfuncs = new Array(2);
    var updata = {};


    /* set audit data */
    updata.usrid = (req.session.userid)?req.session.userid:'undefined';
    updata.oper = 'ADD';
    updata.udat = '2012/7/8 12:34:56';
    updata.pcode = req.body.pcode;
    updata.sqty = req.body.sqty;
    updata.lotn = req.body.lotn;
    upfuncs[0] = insUlog;
    upfuncs[1] = insPart;

    /* update */
    lcsDb.update(upfuncs, updata, function(err)/*これがopt*/{
            if( err ) {
                nextExec( err, req, res, post);
                return;
            }else{
                nextExec( null, req, res, post);
                return;
            }
        });


}

/*
 *
 *
 */
function addStr(req, res) {
    
    /*ex.*/
    var post = {};
    lcsAp.waterfall( req, res, post,
                     [upAddStr,
                      showPart2],
                     dspWin );

}

/*
 * jul-9-2012
 */
function delPart(adt, callback) {

    /* delete Part */
    var delSql ='delete from part where pcode=?';
    var ary = [adt.pcode];

    lcsDb.cmnd(delSql, ary , adt, callback);
}

/*
 *
 *
 */
function upDelStr(req, res, post, nextExec) {

    var upfuncs = new Array(1);
    var updata = {};


    /* set audit data */
    updata.usrid = (req.session.userid)?req.session.userid:'undefined';
    updata.oper = 'ADD';
    updata.udat = '2012/7/8 12:34:56';
    updata.pcode = req.body.pcode;
    updata.sqty = req.body.sqty;
    updata.lotn = req.body.lotn;
    upfuncs[0] = delPart;


    /* update */
    lcsDb.update(upfuncs, updata, function(err)/*これがopt*/{
            if( err ) {
                nextExec( err, req, res, post);
                return;
            }else{
                nextExec( null, req, res, post);
                return;
            }
        });


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
                     [UPSTR._upDelStr,
                      showPart2],
                     dspWin );

}
/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res){

    //    try {
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