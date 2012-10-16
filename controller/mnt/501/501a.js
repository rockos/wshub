'use strict';
/* common file include */
/* local file */
var UPMNT501 = require('./upmnt501.js');
/*
 *  暫定
 */
function dspWin(args, callback) {

    //Login user用
    args.post.userid = (args.req.session.userid) ?
        args.req.session.userid : 'undefined';
    var msg = lcsAp.getMsgI18N('0');
    args.post.mesg = msg.text;
    args.post.mesg_lavel_color = msg.warn;

    args.res.render('scr/scr501a', args.post);
    callback(null, callback);
}
/*
 * 後処理関数
 */
function postData(args, nextExec) {

    var sql = 'select * from part order by pcode';
    var results, fields;

    lcsDb.query(sql, function(err, results, fields) {
        if (err) {
            lcsAp.log('err: ' + err);
        }

        args.post.title = 'check in';
        args.post.tab = results;

        for (var i = 0, max = args.post.tab.length; i < max; i++) {
            args.post.tab[i].radiodata =
                args.post.tab[i].pcode + ',' +
                args.post.tab[i].sqty + ',' +
                args.post.tab[i].pnam + ',' +
                args.post.tab[i].lotn + ',' +
                args.post.tab[i].mem1 + ',' +
                args.post.tab[i].mem2 + ',' +
                args.post.tab[i].mem3;
        }


        //            args.post.userid = args.req.session.userid;

        if (!err) err = 0;

        var msg = lcsAp.getMsgI18N(String(err));
        args.post.mesg = msg.text;
        args.post.mesg_lavel_color = msg.warn;

        /*
           [args.post.mesg, args.post.mesg_lavel_color] =
           lcsAp.getMsgI18N(String(err));
           */
        nextExec(null, args);
    });

}
/**
 *
 */
function shoError(args, emsg) {
    if (typeof emsg === 'object') {
        args.errors = emsg;
        args.post.mesg = emsg.text;
        args.res.render('scr/error', args.post);
    } else {
        var msgobj = lcsAp.getMsgI18N(emsg);
        args.errors = msgobj;
        args.post.mesg = msgobj.text;
        args.res.render('scr/error', args.post);
    }
}
/**
 * Validator for form data.
 *
 */
var validCheck = {
    err: 0,

    checkParams: function(args , /* next function */ callback) {
        var rtn = lcsUI.checkVal(args.req, ['nickname', 'password', 'email']);
        if (rtn) {
            shoError(args, rtn);
            return callback(rtn, args);
        }

        /* normal complete */
        return callback(null, args);
    },
    filter: function(args, /* next function */ callback) {
        /* sanitize */
        /* args.req.sanitize('sqty').toInt(); */
        /* normal complete */

        return callback(null, args);

    },
    checkDb: function(args, callback) {
        var err = 0, errtext = [];
        var results, fields;
        var sql = 'select * from m_users where nickname=?';
        lcsDb.query(sql, [args.req.body['nickname']],
                    function(err, results) {
                        if (err) {
                            shoEOrror(args,
                                      lcsAp.getMsgI18N('99')); /* db error */
                                      callback(err, args);
                                      return;
                        }
                        callback(null, args);

                        return;
                    });
                    return;
    }
};
/**
 *
 *
 */
function parseData(args, callback) {
    lcsAp.doSync(args, [
                 validCheck.checkParams,
                 validCheck.checkDb,
                 validCheck.filter],
                 callback);
}
/*
 * 12-OCT-2012
 */
function getID(args, callback) {
    var sql = '', sql1, sql2, sql3, sql4, sql5;
    var ary = [];
    var results, fields;

    /* insert into t_proof */
    if (args.seqnID === 'id_user') {
        sql = 'update t_sequence set seqn_user=seqn_user+1,' +
            'user_uptime=CURRENT_TIMESTAMP()';
    } else if (args.seqnID === 'id_stock') {
        sql = 'update t_sequence set seqn_tock=seqn_stock+1,' +
            'user_uptime=CURRENT_TIMESTAMP()';
    } else {
        shoError('300');
        return callback('undefined', args);
    }
    lcsDb.query(sql, ary, function(err, results) {
        if (err) {
            lcsAp.syslog('error', 'getID lcsdb.cmnd');
            callback(err, args);
            return;
        }
        sql = 'select concat(substring(CURRENT_TIMESTAMP(),1,4),' +
            'substring(CURRENT_TIMESTAMP(),6,2),' +
            'substring(CURRENT_TIMESTAMP(),9,2),' +
            'lpad(seqn_user,4,"0")) as "id_user"' +
            'from t_sequence;';

        lcsDb.query(sql,
                    function(err, results, fields) {
                        if (err) {
                            lcsAp.syslog('error', 'getID lcsdb.query');
                            callback(err, args);
                            return;
                        }
                        args.id_user = results[0].id_user;
                        callback(null, args);
                        return;
                    });
    });
}
/*
 * 12-OCT-2012
 */
function prepareData(args, callback) {
    args.seqnID = 'id_user';
    lcsAp.doSync(args,
                 [getID],
                 callback);
}

/*
 * main routine
 * date 22.mar.2012
 */
exports.addProf = function(req, res, frame) {

    var posts = {};
    var args = {};

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
    posts.frameNavi.userid = (req.session.userid) ?
        req.session.userid : 'undefined';

    args.req = req;
    args.res = res;
    args.post = posts;
    args.errors = {};
    lcsAp.initSync();
    lcsAp.doSync(args, [
                 parseData,     /* 入力チェック*/
                 prepareData,   /* 前処理 */
                 UPMNT501.upAddProf, /* データベース登録 upmnt501.js */
                 dspWin]);      /* 後処理 */
};
