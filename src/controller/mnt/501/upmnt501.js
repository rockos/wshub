'use strict';
/*
   var rootdir = process.env.LOCOS_DEV;
   var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
   */
/*
 * Mar-28-2012
 */
function insUser(args, callback) {

    var ary = [];

    /* insert into t_users */
    var insSql = 'insert into m_users ' +
        '(id_user,nickname,password,mail_address,initial_date,revised_date)' +
        'values (?,?,?,?,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP())';
    ary = [args.adt.id_user, args.adt.nickname,
        args.adt.password, args.adt.email];
        lcsDb.query(insSql, ary, function(err, results) {
            if (err) {
                lcsAp.syslog('error',{'sql': err.stack});
                lcsUI.shoError(args,
                               lcsAp.getMsgI18N('99')); /* db error */
                               callback(err, args);
            } else {
                callback(null, args);
            }
        });
}
/*
 * 12-OCT-2012
 */
function insProof(args, callback) {
    var ary = [];
    var str = '';

    /* insert into t_proof */
    var insSql = 'x insert into t_proof (initial_date, text) ' +
        'values (CURRENT_TIMESTAMP(),?)';

    for (var key in args.adt) {
        str += key + ':' + args.adt[key] + ';';
    }
    ary = [str];
    lcsDb.query(insSql, ary, function(err, results) {
        if (err) {
            debugger;
            lcsAp.syslog('error',{'sql': err.stack});
            lcsUI.shoError(args,
                           lcsAp.getMsgI18N('99')); /* db error */
                           callback(err, args);
        } else {
            callback(null, args);
        }
    });
}


/**
 * insert user's profile
 * @param {Object} args argument.
 * @param {Function} callback which shoud run at next step.
 *
 */
exports.upAddProf = function(args, callback) {

    var adt = {};
    var dt = new Date;
    var id_user = '';

    /* set audit data */
    adt.usrid = (args.req.session.userid) ?
        args.req.session.userid : 'undefined';
    adt.oper = 'ADD';
    adt.udat = dt.toLocaleString();
    adt.id_user = args.id_user;
    adt.nickname = args.req.body.nickname;
    adt.email = args.req.body.email;
    adt.password = args.req.body.password;

    args.adt = adt;

    /* update */
    lcsAp.correct(args, [
                  insUser,
                  insProof],
                  callback);
};
