'use strict';
/* common file include */

/* local file */

/*
 *  暫定
 */
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
/*
 * sep-25-2012
 */
function _showResult(req, res, frame) {

    var posts = {};
    var file = ROOTDIR + '/src/ini/data/indexini.json';
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

    res.render('scr/index', posts);


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
    var file = ROOTDIR + '/src/ini/data/indexini.json';

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
/*

    if (!lcsAp.isSession(req.session)) {
             res.redirect('/');
    }
  */  
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 


    res.render("scr/index", posts);
};


/**
 * Main routine of profile editor
 * date 26.sep.2012 first edition.
 *
 */
exports.main = function(req, res, frame){
    
    var tof = {/* Table of function for each button */
        "201a_RTN" : _showInitial,

        /* message for delete */
        "201d_RTN" : _showInitial
    };


    for (var key in tof) {
        if (req.body[key]) {
            //    lcsAp.syslog('error', 'error from str', {'key':key});
            if (typeof tof[key] === "function") {
                tof[key](req, res, frame);
                return;
            }
        }
    }
    _showInitial(req, res, frame);

};
