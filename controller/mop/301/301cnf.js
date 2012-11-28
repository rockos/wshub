/**
 *  screen 301 update confirm module
 */

/**
 * Validator for form data.
 * @param {Object} args argument.
 * @param {Function} callback function which shoud run at next step.
 * @return {Function} callback.
 */
var validCheck = {
    "err" : 0,
    "checkParams_add" : function(args , callback) {
        lcsUI.checkVal2(
             [
             {"form":args.data.id_user, "column":"t_reserve.id_user"}, 
             {"form":args.data.schedule, "column":"t_reserve.schedule"}, 
             {"form":args.data.remark, "column":"t_reserve.remark"} 
              ], function(errmsg) {
                 if (errmsg) {
                     args.errmsg = errmsg;
                     callback(args,args);
                     return;
                 }
                 callback(null, args);
                 return;
             });
    },
    "checkParams_del" : function(args , callback) {
        lcsUI.checkVal2(
             [
             {"form":args.data.id_user, "column":"t_reserve.id_user"}
              ], function(errmsg) {
                 if (errmsg) {
                     args.errmsg = errmsg;
                     callback(args,args);
                     return;
                 }
                 callback(null, args);
                 return;
             });
    },
    "filter" : function(args, callback) {
        /* sanitize */
        return callback(null, args);
    }
};
/**
 * データベースの整合性チェック
 * @param {Object} args argument of parent function.
 * @param {Function} callback function which should run at next step.
 */
var checkDb = {
    /**
     *  stockが存在すること
     */
    "stockExists" : function(args, callback) {
        var counter = 0;
        var stock_check = function(id_stock, callback, nextDo) {
            var bind = [];
            /* exist check t_stocks */
            var sql = "" +
            "select count(s.id_stock) as stock_exist " +
            "from t_stocks s " +
            "where s.id_stock = ? ";
            bind = [id_stock];
            lcsDb.query(sql, bind, function(err, results) {
                    if (err) {
                        nextDo(err, "99", callback);
                        return;
                    }
                    if (!results[0].stock_exist) {
                        nextDo(null, "30101", callback);
                        return;
                    }
                    nextDo(null, null, callback);
                });
        };

        var stock_check_callback = function(err, reason, callback) {
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args,args);
                return;
            }
            if (reason) {
                args.errmsg = lcsAp.getMsgI18N(reason);
                callback(args,args);
                return;
            }
            counter++;
            if (counter >= args.data.id_stock.length) {
                /* check OK. */
                callback(null, args);
                return;
            }
            stock_check(args.data.id_stock[counter], callback, stock_check_callback);
        };
        stock_check(args.data.id_stock[counter], callback, stock_check_callback);
    },
    /**
     *  stockが存在すること
     *  stockが未予約であること
     */
    "stockNo_reserve" : function(args, callback) {
        var counter = 0;
        var rv_stock_check = function(id_stock, callback, nextDo) {
            var bind = [];
            /* exist check t_rv_stock */
            var sql = "" +
            "select count(r.id_stock) as rv_exist " +
            "from t_stocks s " +
            "  left outer join t_rv_stock r on r.id_stock = s.id_stock " +
            "where s.id_stock = ? ";
            bind = [id_stock];
            lcsDb.query(sql, bind, function(err, results) {
                    if (err) {
                        nextDo(err, "99", callback);
                        return;
                    }
                    if (results[0].rv_exist) {
                        nextDo(null, "30102", callback);
                        return;
                    }
                    nextDo(null, null, callback);
                });
        };

        var rv_stock_check_callback = function(err, reason, callback) {
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args,args);
                return;
            }
            if (reason) {
                args.errmsg = lcsAp.getMsgI18N(reason);
                callback(args,args);
                return;
            }
            counter++;
            if (counter >= args.data.id_stock.length) {
                /* check OK. */
                callback(null, args);
                return;
            }
            rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
        };
        rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
    },

    /**
     *  stockが存在すること
     *  stockが予約であること
     */
    "reserveExist" : function(args, callback) {
        var counter = 0;
        var rv_stock_check = function(id_stock, callback, nextDo) {
            var bind = [];
            /* exist check t_rv_stock */
            var sql = "" +
            "select count(r.id_stock) as rv_exist " +
            "from t_stocks s " +
            "  left outer join t_rv_stock r on r.id_stock = s.id_stock " +
            "where s.id_stock = ? ";
            bind = [id_stock];
            lcsDb.query(sql, bind, function(err, results) {
                    if (err) {
                        nextDo(err, "99", callback);
                        return;
                    }
                    if (!results[0].rv_exist) {
                        nextDo(null, "30103", callback);
                        return;
                    }
                    nextDo(null, null, callback);
                });
        };

        var rv_stock_check_callback = function(err, reason, callback) {
            if (err) {
                args.errmsg = lcsAp.getMsgI18N(99);
                args.dberr = err;
                callback(args,args);
                return;
            }
            if (reason) {
                args.errmsg = lcsAp.getMsgI18N(reason);
                callback(args,args);
                return;
            }
            counter++;
            if (counter >= args.data.id_stock.length) {
                /* check OK. */
                callback(null, args);
                return;
            }
            rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
        };
        rv_stock_check(args.data.id_stock[counter], callback, rv_stock_check_callback);
    },

    /**
     *  base
     */
    "blockA" : function(args, callback) {
        var sql = "",
        bind = [];
        sql = "" +
        "select 0 as data " +
        "";
        lcsDb.query(sql, bind, function(err, results) {
                if (err) {
                    args.errmsg = lcsAp.getMsgI18N(99);
                    args.dberr = err;
                    callback(args,args);
                    return;
                }
                /* check OK. */
                callback(null, args);
            });
        return;
    },

    "blockZ" : function() {
        callback(null, args);
        return;
    }
};

/**
 *  選択されたt_reserveを取得
 */
function getReserve(args, callback) {
    var counter = 0;
    var get_reserve = function(id_stock, callback, nextDo) {
        var bind = [];
        var sql = "" +
        "select id_reserve " +
        "from t_rv_stock " +
        "where id_stock = ? ";
        bind = [id_stock];
        lcsDb.query(sql, bind, function(err, results) {
                nextDo(err, results, callback);
            });
    };
    
    var get_reserve_callback = function(err, results, callback) {
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            callback(args,args);
            return;
        }
        args.id_reserve.push(results[0].id_reserve);
        counter++;
        if (counter >= args.data.id_stock.length) {
            callback(null, args);
            return;
        }
        get_reserve(args.data.id_stock[counter], callback, get_reserve_callback);
    };
    get_reserve(args.data.id_stock[counter], callback, get_reserve_callback);
}

/**
 * 前処理
 * @param {Object} args argument of parent function.
 * @param {function} callback function should run at next step.
 */
exports.prepareData_del = function (args, callback) {
    args.id_reserve = new Array();
    lcsAp.doSync(args,
                 [
                  getReserve
                  ],
                 callback);
}

/**
 * validate form data.
 * @param {Object} args argument.
 * @param {Function} callback function which should run.
 * @date  1/nov/2012
 */
exports.parseData_del = function (args, callback) {
    var stocks = new Array();
    var chkAry = [];
    if (!args.req.body.tab1_chk) {
        /* no selected */
        args.errmsg = lcsAp.getMsgI18N(198);
        callback(args);
        return;
    } else {
        if (typeof args.req.body.tab1_chk === 'object') {
            chkAry = args.req.body.tab1_chk;
        } else {
            chkAry[0] = args.req.body.tab1_chk;
        }
    }
    for (var i = 0,imax = chkAry.length; i < imax; i++) {
        stocks.push(chkAry[i]);
    }
    var data = {
        "id_user" : args.req.body.txt3,
        "id_stock" : stocks 
    };
    args.data = new Object();
    args.data = data;

    lcsAp.doSync(args, 
                 [
                  validCheck.filter,
                  validCheck.checkParams_del,
                  checkDb.stockExists,
                  checkDb.reserveExist
                 ],
                 callback);
}

/**
 * 前処理
 * @param {Object} args argument of parent function.
 * @param {function} callback function should run at next step.
 */
exports.prepareData_add = function (args, callback) {
    args.seqnID = "id_reserve";
    args.id_reserve = "";
    lcsAp.doSync(args,
                 [lcsUI.getID],
                 callback);
}

/**
 * validate form data.
 * @param {Object} args argument.
 * @param {Function} callback function which should run.
 * @date  1/nov/2012
 */
exports.parseData_add = function (args, callback) {
    var stocks = new Array();
    var chkAry = [];
    if (!args.req.body.tab1_chk) {
        /* no selected */
        args.errmsg = lcsAp.getMsgI18N(198);
        callback(args);
        return;
    } else {
        if (typeof args.req.body.tab1_chk === 'object') {
            chkAry = args.req.body.tab1_chk;
        } else {
            chkAry[0] = args.req.body.tab1_chk;
        }
    }
    for (var i = 0,imax = chkAry.length; i < imax; i++) {
        stocks.push(chkAry[i]);
    }

    var data = {
        "id_user" : args.req.body.txt3,
        "schedule" : args.req.body.txt1,
        "remark" : args.req.body.txt2,
        "id_stock" : stocks 
    };
    args.data = new Object();
    args.data = data;

    lcsAp.doSync(args, 
                 [
                  validCheck.filter,
                  validCheck.checkParams_add,
                  checkDb.stockExists,
                  checkDb.stockNo_reserve
                 ],
                 callback);
}
