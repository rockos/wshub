'use strict';
/**
 *  2-nov-2012
 */
function insReserve(args, callback) {
    var ary = [];

    /* insert into t_reserve */
    var insSql = "" +
        "INSERT INTO t_reserve " +
        "  (id_reserve, id_user, schedule, remark, " +
        "   kind, status, initial_date, revised_date ) " +
        "values( " +
        "   ?, ?, ?, ?, " +
        "   ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()" +
        ")";
    ary = [args.adt.id_reserve, args.adt.id_user,
           args.adt.schedule, args.adt.remark,
           args.adt.kind, args.adt.status];
    lcsDb.query(insSql, ary, function(err, results) {
debugger;
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args, args);
                return;
            }
            callback(null, args);
        });
}

/**
 *  Mar-28-2012
 */
function insRv_stock(args, callback) {
    var counter = 0;
    var rv_stock_ins = function(id_stock, callback, nextDo) {
        var bind = [];
        /* insert into t_rv_stock */
        var insSql = "" +
        "INSERT INTO t_rv_stock " +
        "  (id_reserve, id_stock, quantity, " +
        "   initial_date, revised_date) " +
        "select " +
        "   ?, id_stock, quantity, " +
        "   CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() " +
        "from t_stocks " +
        "where id_stock = ? ";
        bind = [args.adt.id_reserve, id_stock];
        lcsDb.query(insSql, bind, function(err, results) {
                nextDo(err, callback);
            });
    };

    var rv_stock_ins_callback = function(err, callback) {
debugger;
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            callback(args, args);
            return;
        }
        counter++;
        if (counter >= args.adt.id_stock.length) {
            callback(null, args);
            return;
        }
        rv_stock_ins(args.adt.id_stock[counter], callback, rv_stock_ins_callback);
    };

    rv_stock_ins(args.adt.id_stock[counter], callback, rv_stock_ins_callback);
}

/**
 *  Nov-5-2012
 */
function delReserve(args, callback) {
    var counter = 0;
    var reserve_del = function(id_reserve, callback, nextDo) {
debugger;
        var bind = [];
        /* delete t_reserve */
        var sql = "" +
        "DELETE from t_reserve " +
        "where id_reserve = ? " +
        "  and not exists(select * from t_rv_stock where id_reserve = ?) ";
        bind = [id_reserve, id_reserve];
        lcsDb.query(sql, bind, function(err, results) {
                nextDo(err, callback);
            });
    };

    var reserve_del_callback = function(err, callback) {
debugger;
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            callback(args, args);
            return;
        }
        counter++;
        if (counter >= args.adt.id_reserve.length) {
            callback(null, args);
            return;
        }
        reserve_del(args.adt.id_reserve[counter], callback, reserve_del_callback);
    };
    reserve_del(args.adt.id_reserve[counter], callback, reserve_del_callback);
}

/**
 *  Nov-5-2012
 */
function delRv_stock(args, callback) {
    var counter = 0;
    var rv_stock_del = function(id_stock, callback, nextDo) {
debugger;
        var bind = [];
        /* delete t_rv_stock */
        var sql = "" +
        "DELETE from t_rv_stock " +
        "where id_stock = ? ";
        bind = [id_stock];
        lcsDb.query(sql, bind, function(err, results) {
                nextDo(err, callback);
            });
    };

    var rv_stock_del_callback = function(err, callback) {
debugger;
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            callback(args, args);
            return;
        }
        counter++;
        if (counter >= args.adt.id_stock.length) {
            callback(null, args);
            return;
        }
        rv_stock_del(args.adt.id_stock[counter], callback, rv_stock_del_callback);
    };
    rv_stock_del(args.adt.id_stock[counter], callback, rv_stock_del_callback);
}

/**
 *  12-OCT-2012
 */
function insProof(args, callback) {
    var ary = [];
    var str = '';

    /* insert into t_proof */
    var insSql = 'insert into t_proof (initial_date, text) ' +
        'values (CURRENT_TIMESTAMP(),?)';

    for (var key in args.adt) {
        str += key + ':' + args.adt[key] + ';';
    }
    ary = [str];
    lcsDb.query(insSql, ary, function(err, results) {
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            callback(args, args);
            return;
        }
        callback(null, args);
    });
}


/**
 * 出庫予約実行
 * @param {Object} args argument.
 * @param {Function} callback which shoud run at next step.
 */
exports.upAddExec = function(args, callback) {

    var adt = {};
    var dt = new Date;
    var id_reserve = '';

    /* set audit data */
    //adt.usrid = (args.req.session.userid) ?
    //    args.req.session.userid : 'undefined';
    adt.usrid = "";
    adt.oper = 'ADD';
    adt.udat = dt.toLocaleString();
    adt.id_reserve = args.id_reserve;
    adt.id_user = args.data.id_user;
    adt.schedule = lcsUI.convertDate(args.data.schedule);
    adt.remark = args.data.remark;
    adt.kind = "2"; /* retreve */
    adt.status = "YOYK"; /*予約*/
    adt.id_stock = new Array();
    for (var i = 0, imax = args.data.id_stock.length; i < imax; i++) {
        adt.id_stock.push(args.data.id_stock[i]);
    }
    args.adt = adt;

    /* update */
    lcsAp.correct(args, [
                         insReserve,
                         insRv_stock,
                         insProof
                         ],
                  callback);
};

/**
 * 出庫予約キャンセル実行
 * @param {Object} args argument.
 * @param {Function} callback which shoud run at next step.
 */
exports.upDelExec = function(args, callback) {

    var adt = {};
    var dt = new Date;
    var id_reserve = '';

    /* set audit data */
    //adt.usrid = (args.req.session.userid) ?
    //    args.req.session.userid : 'undefined';
    adt.usrid = "";
    adt.oper = 'DEL';
    adt.udat = dt.toLocaleString();
    adt.id_user = args.data.id_user;
    adt.id_stock = new Array();
    for (var i = 0, imax = args.data.id_stock.length; i < imax; i++) {
        adt.id_stock.push(args.data.id_stock[i]);
    }
    adt.id_reserve = new Array();
    for (var i = 0, imax = args.id_reserve.length; i < imax; i++) {
        adt.id_reserve.push(args.id_reserve[i]);
    }
    args.adt = adt;
debugger;

    /* update */
    lcsAp.correct(args, [
                         delRv_stock,
                         delReserve,
                         insProof
                         ],
                  callback);
};
