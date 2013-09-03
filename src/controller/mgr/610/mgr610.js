'use strict';
/* common file include */

/* local file */

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
            lcsUI.shoMsg(res, rtn);
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
            lcsUI.shoMsg(args.res, rtn);
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
 * Authenticationi is successful.set sesseion info.
 *
 */
function _setSession(req, res, frame, file) {
    var posts = {};

    /* set session information */
    req.session.views = 1;
    req.session.userid = req.body.userid;
    req.session.password = req.body.password;
    req.session.lang = req.body.lang;

    lcsAp.setLangI18N(req.session.lang);

    /* set page information */
    posts.frameNavi = frame.frameNavi;
    posts.frameNavi.signin ="true";
    posts.frameNavi.nickname = 
        req.session.nickname ? req.session.nickname: 'undefined'; 
    posts.frameNavi.userid = 
        req.session.userid ? req.session.userid: 'undefined'; 
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));

    return res.redirect('/');
}
/**
 * main routine
 * @date 20.aug.2013
 * @param req
 * @param res
 * @param frame
 */
function _checkUser(req, res, frame) {
    var posts = {};

    var file = ROOTDIR + '/src/ini/data/indexini.json';
    var sql ='select nickname, mail_address as "email",password,permit ' + 
      ' from m_users where mail_address=? and password=?';
    var posts = {};
    if (process.env.DATABASE == 'MySql') {
        var args = [req.body.userid, req.body.password];
        lcsDb.query(sql, args, function(err, results, fields) {
            if (err){
               lcsAp.syslog('info', err);
               lcsUI.shoMsg(res, 99); /* database error */
               return;
            }

            if (results.length == 0) {
               lcsUI.shoMsg(res, 106); /* invalid mail address */
               return;
            }
            /*
            if (results[0].email !== req.body.userid || 
                results[0].password !== req.body.password) {
               lcsUI.shoMsg(res, 106);
               return;
            }
            */
            req.session.permit = results[0].permit;
            req.session.nickname = results[0].nickname; 
            req.session.userid = req.body.userid; 
            return _setSession(req, res, frame, file);
        });
    } else {
        req.session.permit = 1; 
        return _setSession(req, res, frame);
    }
}
/**
 * main routine
 * @date 20.aug.2013
 * @param req
 * @param res
 * @param frame
 */
exports.signinUser = function(req, res, frame){
    var posts = {};
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    posts.frameNavi = frame.frameNavi;
    if (req.body['610_cancel']) {
        return lcsUI.shoMsg(res, 'キャンセルされました。');
    } else if (req.body['610_signin']) {
        _checkUser(req, res, frame);
        return;
    } else {
        return res.redirect('/');
    }
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
 * show initial data of scr651
 * @date 27.aug.2013
 * @param req
 * @param res
 * @param frame
 */
exports.registUser = function(req, res, frame){
    var posts = {};
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    posts.frameNavi = frame.frameNavi;

    if (req.body['620_cancel']) {
        return lcsUI.shoMsg(res, 'キャンセルされました。');
    } else if (req.body['620_regist']) {
        return lcsUI.shoMsg(res, 0);
    } else {
        return res.redirect('/');
    }
};
/**
 * show initial data of scr651
 * @date 27.aug.2013
 * @param req
 * @param res
 * @param frame
 */
exports.showScreen = function(req, res, frame){
    var url = require('url')
    var posts = {};
    var param = {};
    var file = ROOTDIR + '/src/ini/data/indexini.json';

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 
    param =  url.parse(req.url, true);
    if (req.url === '/') {
        _showInitial(req, res, frame);
    } else if (req.url === '/index') {
        _showInitial(req, res, frame);
    } else if (param.query.kind === 'signin') {
        res.render("scr/scr610", posts);
    } else if (param.query.kind === 'regist') {
        res.render("scr/scr620", posts);
    } else {
        lcsUI.shoMsg(res, 7); /* page not found */
    }
};
/**
 * Main routine of profile editor
 * date 26.sep.2012 first edition.
 *
 */
exports.main = function(req, res, frame){
    var url = require('url')
    var get_tof = {/* Table of functions */
        "/" : _showInitial
    };
    var tof = {/* Table of functions */
        "610_signin" : _signin,
        "610_cancel" : _signin,
        "620_regist" : _regist,
        "620_cancel" : _regist
    };

    var posts = {};
    var param = {};
    if (req.method == 'GET') {
        param =  url.parse(req.url, true)
        if (typeof get_tof[param.pathname] === 'function') {
            get_tof[param.pathname](req, res, frame);
            return;
        } else {
            lcsUI.shoMsg(res, 7); /* page not found */
            return;
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
    lcsUI.shoMsg(res, 7); /* page not found */

};
