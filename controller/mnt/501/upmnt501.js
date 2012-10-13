'use strict';
/*
var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsDb = require(rootdir + 'lib/db/lcsdb').create('TST', rootdir+'etc/db.cf');
*/

/*
 * jul-9-2012
 */
function _delPart(adt, callback) {

    /* delete Part */
    var delSql ='delete from part where pcode=?';
    var ary = [adt.pcode];

    lcsDb.cmnd(delSql, ary , adt, callback);
}

/*
 *
 *
 */
exports._upDelStr = function (args, nextExec) {

    var upfuncs = new Array(1);
    var adt= {};
    var dt = new Date;

    /* set audit data */
    adt.usrid = (args.req.session.userid) ? args.req.session.userid:'undefined';
    adt.oper = 'DEL';
    adt.udat = dt.toLocaleString();
    adt.pcode = args.req.body.pcode;
    upfuncs[0] = _delPart;


    /* update */
    lcsDb.update(upfuncs, adt, function(err)/*これがopt*/{
            if( err ) {
                nextExec( err, args);
                return;
            }else{
                nextExec( null, args);
                return;
            }
        });


}

/*
 * Mar-28-2012
 */
function insUser(adt, callback) {

    var ary = [];
    /* insert into t_users */
    var insSql ='insert into m_users (id_user,nickname,password,mail_address,initial_date,revised_date)';
    insSql += 'values (?,?,?,?,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP())';

    ary = [adt.id_user, adt.nickname, adt.password, adt.email];
    lcsDb.cmndOne(insSql, ary, callback);
}
/*
 * 12-OCT-2012
 */
function insProof(adt, callback) {
    var ary = [];
    var str = '';

    /* insert into t_proof */
    var insSql ='insert into t_proof (initial_date, text) ';
    insSql += 'values (CURRENT_TIMESTAMP(),?)';

    for (var key in adt) {
        str += key + ':' + adt[key] + ';';
    }
    ary = [str];

    lcsDb.cmnd(insSql, ary, adt, callback);
}


/*
 * insert user's profile 
 *
 */
exports.upAddProf = function (args, callback) {

    var adt = {};
    var dt = new Date;
    var id_user = '';

    /* set audit data */
    adt.callback = callback;
    adt.usrid = (args.req.session.userid) ? args.req.session.userid:'undefined';
    adt.oper = 'ADD';
    adt.udat = dt.toLocaleString();
    adt.id_user = args.id_user;
    adt.nickname = args.req.body.nickname;
    adt.email = args.req.body.email;
    adt.password = args.req.body.password;
debugger;

    /* update */
    lcsDb.correct(adt, [
                  insUser,
                  insProof]);
/*
    lcsDb.correct(upfuncs, adt, function(err) {
        debugger;
        if (err) {
                nextExec(err, args);
                return;
            } else {
                nextExec(null, args);
                return;
            }
        });
*/
}

/*
 * Mar-28-2012
 */
function modPart(adt, callback) {

    /* insert into PART */
    var modSql ='update part set sqty=?,lotn=?,mem1=?,mem2=?,mem3=?,pnam=? ';
	modSql += 'where pcode=?';
    var ary = [adt.sqty, adt.lotn, adt.mem1, adt.mem2, adt.mem3, adt.pnam, adt.pcode];
    lcsDb.cmnd(modSql, ary, adt, callback);
}
/*
 * modification of inventry
 *
 */
exports._upModStr = function (args, nextExec) {

    var upfuncs = new Array(2);
    var adt = {};
    var dt = new Date;

    /* set audit data */
    adt.usrid = (args.req.session.userid) ? args.req.session.userid:'undefined';
    adt.oper = 'ADD';
    adt.udat = dt.toLocaleString();
    adt.pcode = args.req.body.pcode;
    adt.sqty = args.req.body.sqty;
    adt.lotn = args.req.body.lotn;
    adt.mem1 = args.req.body.mem1;
    adt.mem2 = args.req.body.mem2;
    adt.mem3 = args.req.body.mem3;
    adt.pnam = args.req.body.pnam;
    upfuncs[0] = insUlog;
    upfuncs[1] = modPart;


    /* update */
    lcsDb.correct(upfuncs, adt, function(err) /*これがopt*/{
            if (err) {
                nextExec( err, args);
                return;
            } else {
                nextExec( null, args);
                return;
            }
        });
}
