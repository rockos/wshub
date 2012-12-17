'use strict';

var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsDb = require(rootdir + 'lib/db/lcsdb').create('TST', rootdir+'etc/db.cf');

/*
 * jul-9-2012
 */
function _delPart(adt, callback) {

    /* delete Part */
    var delSql ='delete from part where pcode=?';
    var ary = [adt.pcode];
    debugger;
    lcsDb.cmnd(delSql, ary , adt, callback);
}

/*
 *
 *
 */
exports._upDelStr = function (req, res, post, nextExec) {

    var upfuncs = new Array(1);
    var updata = {};

    debugger;
    /* set audit data */
    updata.usrid = (req.session.userid)?req.session.userid:'undefined';
    updata.oper = 'ADD';
    updata.udat = '2012/7/8 12:34:56';
    updata.pcode = req.body.pcode;
    updata.sqty = req.body.sqty;
    updata.lotn = req.body.lotn;
    upfuncs[0] = _delPart;


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
 *
 *
 */
exports._upAddStr = function (req, res, post, nextExec) {

    var upfuncs = new Array(2);
    var updata = {};
    var dt = new Date;

    /* set audit data */
    updata.usrid = (req.session.userid)?req.session.userid:'undefined';
    updata.oper = 'ADD';
    updata.udat = dt.toLocaleString();
    updata.pcode = req.body.pcode;
    updata.sqty = req.body.sqty;
    updata.lotn = req.body.lotn;
    updata.mem1 = req.body.mem1;
    updata.mem2 = req.body.mem2;
    updata.mem3 = req.body.mem3;
    updata.pnam = req.body.pnam;
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
