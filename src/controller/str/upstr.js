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
    var updata = {};
    var dt = new Date;

    /* set audit data */
    updata.usrid = (args.req.session.userid) ? args.req.session.userid:'undefined';
    updata.oper = 'DEL';
    updata.udat = dt.toLocaleString();
    updata.pcode = args.req.body.pcode;
    upfuncs[0] = _delPart;


    /* update */
    lcsDb.update(upfuncs, updata, function(err)/*これがopt*/{
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

    lcsDb.cmnd(insSql, ary, adt, callback);
}

/*
 * delete inventry
 *
 */
exports._upAddStr = function (args, nextExec) {

    var upfuncs = new Array(2);
    var updata = {};
    var dt = new Date;

    /* set audit data */
    updata.usrid = (args.req.session.userid) ? args.req.session.userid:'undefined';
    updata.oper = 'ADD';
    updata.udat = dt.toLocaleString();
    updata.pcode = args.req.body.pcode;
    updata.sqty = args.req.body.sqty;
    updata.lotn = args.req.body.lotn;
    updata.mem1 = args.req.body.mem1;
    updata.mem2 = args.req.body.mem2;
    updata.mem3 = args.req.body.mem3;
    updata.pnam = args.req.body.pnam;
    upfuncs[0] = insUlog;
    upfuncs[1] = insPart;

    /* update */
    lcsDb.update(upfuncs, updata, function(err)/*これがopt*/{
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
    var updata = {};
    var dt = new Date;

    /* set audit data */
    updata.usrid = (args.req.session.userid) ? args.req.session.userid:'undefined';
    updata.oper = 'ADD';
    updata.udat = dt.toLocaleString();
    updata.pcode = args.req.body.pcode;
    updata.sqty = args.req.body.sqty;
    updata.lotn = args.req.body.lotn;
    updata.mem1 = args.req.body.mem1;
    updata.mem2 = args.req.body.mem2;
    updata.mem3 = args.req.body.mem3;
    updata.pnam = args.req.body.pnam;
    upfuncs[0] = insUlog;
    upfuncs[1] = modPart;

    /* update */
    lcsDb.update(upfuncs, updata, function(err)/*これがopt*/{
            if (err) {
                nextExec( err, args);
                return;
            } else {
                nextExec( null, args);
                return;
            }
        });
}
