'use strict';
/* common file include */
/* local file */
var UPMNT501 = require('./upmnt501.js');
/**
 *   結果表示
* @param {Object} args argument.
* @param {Function} callback which shoud run at next setp.
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
/**
 * show error message.
 * @param {Object} args argument.
 * @param {Object} emsg contents of error.
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
 * @param {Object} args argument.
 * @param {Function} callback function which shoud run at next step.
 * @return {Function} callback.
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

    }
};
/**
 * データベースの整合性チェック
 * @param {Object} args argument of parent function.
 * @param {Function} callback function which should run at next step.
 */
var checkDb = {

    blockA: function(args, callback) {
        var err = 0;
        var sql = '';
        var results = {}, fields = {};
        debugger;
        sql = 'select count(*) as count from m_users ' +
            'where nickname=? or mail_address=?';
        lcsDb.query(sql, [args.req.body['nickname'],
                    args.req.body['email']],
                    function(err, results) {
                        debugger;
                        if (err || results.length == 0) {
                            shoError(args,
                                     lcsAp.getMsgI18N('99')); /* db error */
                                     lcsAp.syslog('error',
                                                  {'checkDb.blockA: ':
                                                      err.message});
                                                  callback(true, args);
                                                  return;
                        }
                        debugger;
                        if (results[0].count != 0) {
                            shoError(args,
                                     lcsAp.getMsgI18N('301')); /* tourokusumi */
                                     callback(true, args);
                                     return;
                        }
                        callback(null, args);

                        return;
                    });
                    return;
    },
    blockB: function(args, callback) {
        var err = 0;
        var sql = '';
        var results = {}, fields = {};

        sql = 'rollback';
        lcsDb.query(sql,
                    function(err, results) {
                        debugger;
                        if (err || results.length == 0) {
                            shoError(args,
                                     lcsAp.getMsgI18N('301')); /* db error */
                                     lcsAp.syslog('error',
                                                  {'checkDb.blockB: ': sql});
                                                  callback(true, args);
                                                  return;
                        }
                        callback(null, args);

                        return;
                    });
                    return;
    },
    blockC: function(err, result) {
        callback(null, args);
        return;
    },
    blockD: function(err, results) {
        callback(null, args);
        return;
    }
};
/**
 * generate m_users.ID
 *
 * @param {Object} args argument of parent function.
 * @param {Function} callback function which should run at next step.
 *
 */
function getID(args, callback) {
    var sql = '';
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
        callback('undefined', args);
        return;
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
/**
 * validate form data.
 * @param {Object} args argument.
 * @param {Function} callback function which should run.
 *
 */
function parseData(args, callback) {
    lcsAp.doSync(args, [
                 validCheck.checkParams,
                 checkDb.blockB,
                 checkDb.blockA,
                 validCheck.filter],
                 callback);
}
/**
 * 前処理
 * @param {Object} args argument of parent function.
 * @param {function} callback function should run at next step.
 */
function prepareData(args, callback) {
    args.seqnID = 'id_user';
    lcsAp.doSync(args,
                 [getID],
                 callback);
}

/**
 * main routine
 * date 22.mar.2012
 * @param {Object} req request data from client.
 * @param {Object} res respons data to client.
 * @param {Object} frame data for render.
 * @author msyaono@rockos.co.jp
 */
exports.addProf = function(req, res, frame) {

    var posts = {};
    var args = {};
    var sync_pool = [];

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
    posts.frameNavi.userid = (req.session.userid) ?
        req.session.userid : 'undefined';

    args.req = req;
    args.res = res;
    args.post = posts;
    args.errors = {};
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args, [
                 parseData,     /* 入力チェック*/
                 prepareData,   /* 前処理 */
                 UPMNT501.upAddProf, /* データベース登録 upmnt501.js */
                 dspWin]);      /* 後処理 */
};
