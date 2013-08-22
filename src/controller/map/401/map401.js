'use strict';
/* common file include */
/* local file */


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
//function dspWin(err, args) {
function dspWin(args, callback) {

    //Login user用
    args.post.userid = (args.req.session.userid) ? args.req.session.userid:'undefined';

    var msg = lcsAp.getMsgI18N('0');
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
    callback(null, callback);
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
/**
 *
 */
function shoError(args, emsg) {
    args.post.mesg = emsg.text;
    args.res.render('scr/error', args.post);
};
/*
function shoError(args, emsg) {
    var msgobj = lcsAp.getMsgI18N(emsg);
    args.post.mesg = msgobj.text;
    args.res.render('scr/error', args.post);
};
*/

var validCheck = {
    err : 0,

    checkParams : function (args ,/* next function */ callback) {
        var rtn = lcsUI.checkVal(args.req, ['pcode', 'pnam', 'sqty', 'lotn']);
        if (rtn) {
            shoError(args, rtn);
            return callback(rtn, args, callback);
        }
        
        /* sanitize */
        args.req.sanitize('sqty').toInt(); 
        
        /* normal complete */
        return callback(0, args, callback);        
        
    },
    checkParams_del : function (args ,/* next function */ callback) {
        var rtn = lcsUI.checkVal(args.req, ['pcode']);
        if (rtn) {
            shoError(args, rtn);
            return callback(rtn, args, callback);
        }
        
        /* normal complete */
        return callback(0, args, callback);        
        
    },
    filter : function (args ,/* next function */ callback) {
        /* sanitize */
        //        args.req.sanitize('sqty').toInt(); 
        
        /* normal complete */
        return callback(0, args, callback);        
        
    },
    checkDb : function (args ,callback) {

        args.post.userid = (args.req.session.userid) ? args.req.session.userid:'undefined';
        var err = 0, errtext = [];
        var results, fields;

        var sql ='select * from part where pcode=?';

        lcsDb.query(sql, [args.req.body['pcode']],function(err, results, fields) {
                if (err){
                    shoError(args, '99'); /* db error */
                    callback( err, args, callback);
                    return;
                };
                callback(0, args, callback);

                return;
            });
        return;
    }
};
/* empty function */
var finParse = function(err){
    if (err) {
        return;
    }
}
/* empty function */
var fin = function(err){
    if (err) {
        return;
    }
}
/**
 *
 *
 */
function parseData_add(args, nextExec) {
    //        var pl = plist;
    //args.plist = {"pcode","p"};
    lcsAp.series(args, [validCheck.checkParams, validCheck.checkDb, validCheck.filter], finParse);

    if (args.errors) {
        nextExec(args.errors, args);
        return;
    }

    nextExec( null, args);
}
/**
 *
 *
 */
function parseData_del(args, nextExec) {

    lcsAp.series(args, [validCheck.checkParams_del, validCheck.checkDb], finParse);

    if (args.errors) {
        nextExec(args.errors, args);
        return;
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
    args.req = req;
    args.res = res;
    args.post = posts;
    args.post.frameNavi.userid =  (req.session.userid)? req.session.userid:'undefined';
    lcsAp.series(args,
               [parseData_add, /* 入力チェック*/
                UPSTR._upAddStr, /* データベース登録 upstr.js */
                postData,
                dspWin], /* 後処理 */
               fin);

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

    lcsAp.series(args,
               [parseData_del, /* 入力チェック*/
                UPSTR._upDelStr,
                postData,
                dspWin], /* 後処理 */
               fin);

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
 * sep-25-2012
 */
function _showResult(req, res, frame) {

    var posts = {};
    var file = ROOTDIR + '/src/ini/data/map401ini.json';
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;


    if (!lcsAp.isSession(req.session)) {
             res.redirect('/');
    }
    
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 

    res.render('scr/scr401', posts);


};

/**
 * main routine
 * @date 20.aug.2013
 * @param req
 * @param res
 * @param frame
 */
function _showInitial(req, res, frame){
    var posts = {};
    var file = ROOTDIR + '/src/ini/data/map401ini.json';

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;


    if (!lcsAp.isSession(req.session)) {
             res.redirect('/');
    }
    
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 


    res.render("scr/scr401", posts);
};


/**
 * Main routine of profile editor
 * date 26.sep.2012 first edition.
 *
 */
exports.main = function(req, res, frame){
   var url = require('url')
    
    var tof = {/* Table of function for each button */
        "201_QRY" : _showResult,
        "201d_RTN" : _showInitial
    };

   var param = {};
    /*
     * lcsAp.syslog('info', '懸念を表明する');
     * lcsAp.syslog('notice', '強い懸念を表明する');
     * lcsAp.syslog('error', '強い遺憾の意を示す');
     */
   debugger;
   if (req.method == 'GET') {
      param =  url.parse(req.url, true)
      if (param.query.profile) {
         _showInitial(req, res, frame);
      }
   } else {
   
       for (var key in tof) {
           if (req.body[key]) {
               //    lcsAp.syslog('error', 'error from str', {'key':key});
               if (typeof tof[key] === "function") {
                   tof[key](req, res, frame);
                   return;
               }
           }
       }
   }
    _showInitial(req, res, frame);

};
