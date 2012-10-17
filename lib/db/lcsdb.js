/**
 * MySqlインターフェース
 *
 */
var fs = require('fs');
var async = require('async');

const _dbIDLE = -1;
const _dbCONNECTED = 1;

/**
 *  Constructor
 * @this
 * @param {String} nm name of applicastion.
 * @param {String} file configuration file path.
 */
function lcsDb(nm, file) {

    var _instance,
    _name = nm || 'rockos',
    _status = _dbIDLE,
    _conn = {};

    if (_status != _dbCONNECTED) {
        _conn = _connectServer(file);
        _disablAutoCommit();
        _status = _dbCONNECTED;
    }

    _instance = this;

    /**
     * connect mysql server.
     *
     * @param {file} cf configuration file.
     * @return {Object} client mysql client object.
     */
    function _connectServer(cf) {

        /* mysql */
        var mysql = require('mysql');
        var conf = JSON.parse(require('fs').readFileSync(cf));
        var mysqlConfig = {};

        mysqlConfig.host = conf.host;
        mysqlConfig.port = conf.port;
        mysqlConfig.user = conf.user;
        mysqlConfig.password = conf.password;
        mysqlConfig.database = conf.database;

        return mysql.createClient(mysqlConfig);
    };

    /**
     * autocommit無効
     *
     */
    function _disablAutoCommit() {
        _conn.query('set autocommit=0',
                    function(err, results) {
                        if (err) {
                            lcsAp.syslog('error',
                                         {'disablAutoCommit:': err.message});
                        }
                    });

    };
    /**
     * トランザクションの開始
     *
     */
    function _startTran() {
        _conn.query('set autocommit=0;start transaction',
                    function(err, results) {
                        if (err) {
                            lcsAp.syslog('error', {'startTran:': err.message});
                        }
                    });
    };
    /**
     * トランザクションの開始
     * @param {Object} args argument of parent function.
     * @param {Function} opt callback function.
     *
     */
    lcsDb.prototype.startTran = function(args, opt) {
        debugger;
        _conn.query('set autocommit=0; start transaction',
                    function(err, results) {
                        debugger;
                        if (err) {
                            lcsAp.syslog('error', {'startTran:': err.message});
                        }
                        if (opt instanceof Function) {
                            opt(null, args);
                        }
                    });
    };

    /**
     * トランザクションのコミット
     *
     * @param {Object} args argument of parent function.
     * @param {Function} opt callback function.
     *
     */
    lcsDb.prototype.commitTran = function(args, opt) {
        _conn.query('commit',
                    function(err, results) {
                        if (err) {
                            lcsAp.syslog('error', {'commitTran:': err.message});
                        }
                        if (opt instanceof Function) {
                            opt(null, args);
                        }
                    });

    };
    /**
     * トランザクションのロールバック
     *
     * @param {Object} args argument of parent function.
     * @param {Function} opt calback function.
     *
     */
    lcsDb.prototype.rollbackTran = function(args, opt) {
        _conn.query('rollback',
                    function(err, results) {
                        if (err) {
                            lcsAp.syslog('error',
                                         {'rollbackTran:': err.message});
                        }
                        if (opt instanceof Function) {
                            opt(null, args);
                        }
                    });
    };

    /**
     * データベース更新処理
     *
     * @param {Function} funcs update function.
     * @param {Object} updString data for update.
     * @param {Function} opt callback function.
     *
     */
    lcsDb.prototype.updateNG = function(funcs, updString, opt) {

        _startTran();

        var exec_lists = [];

        for (var i = 0, max = funcs.length; i < max; i++) {
            if (i === 0) {
                exec_lists[i] = async.apply(funcs[i], updString);
            } else {
                exec_lists[i] = funcs[i];
            }
        }
        async.waterfall(exec_lists, function(err) {
            if (err) {
                _rollbackTran();

            } else {
                _commitTran();
            }
            lcsAp.logdb(updString);
            opt(err);
        });
    };

    /**
     * クエリ発行
     *
     * @param {String} sql query string.
     * @param {Array} ary arguments.
     * @param {Object} adt audit string.
     * @param {Function} callback optional function.
     *
     */
    lcsDb.prototype.cmnd = function(sql, ary, adt, callback) {
        _conn.query(sql, ary,
                    function(err, results) {
                        if (err) {
                            lcsAp.syslog('error', {'cmd:': err.message});
                            callback(err, adt);
                        } else {
                            callback(null, adt);
                        }
                    });
    };
    /**
     * クエリ発行
     *
     * @param {String} sql query string.
     * @param {Array} ary arguments.
     * @param {Object} args argument for callback.
     * @param {Function} callback optional function.
     *
     */
    lcsDb.prototype.cmndOne = function(sql, ary, args, callback) {
        _conn.query(sql, ary,
                    function(err, results) {
                        if (err) {
                            lcsAp.syslog('error', {'cmdOne:': err.message});
                            callback(err, args);
                        } else {
                            callback(null, args);
                        }
                    });
    };

    /**
     * クエリ発行
     *
     * @param {Array} arguments array of arguments.
     *
     */
    lcsDb.prototype.query = function(arguments) {
        var sql, ary, func;
        var arg = arguments;
        if (arg.length == 1) {
            sql = arg[0];
            _conn.query(sql,
                        function(err, results) {
                            if (err) {
                                lcsAp.syslog('error',
                                             {'lcsDb.query:': err.message});
                            }
                        });
        } else if (arg.length == 2) {
            sql = arg[0];
            /* */
            if (arg[1] instanceof Array) {
                ary = arg[1];
                _conn.query(sql, ary,
                            function(err, results) {

                                if (err) {
                                    lcsAp.syslog('error',
                                                 {'lcsDb.query:': err.message});
                                }
                                /* is callback True?  */
                                if (arg[1] instanceof Function) {
                                    func = arg[1];
                                    func(err, results);
                                }
                            });
            } else {
                _conn.query(sql,
                            function(err, results) {
                                if (err) {
                                    lcsAp.syslog('error',
                                                 {'lcsDb.query:': err.message});
                                }

                                /* is callback True?  */
                                if (arg[1] instanceof Function) {
                                    func = arg[1];
                                    func(err, results);
                                }
                            });
            }
        } else if (arg.length == 3) {
            sql = arg[0];
            ary = arg[1];
            func = arg[2];
            _conn.end();
            if (func instanceof Function) {
                _conn.query(sql, ary, func);
            }
        } else if (arg.length == 4) {
            sql = arg[0];
            ary = arg[1];
            args = arg[2];
            func = arg[3];
            _conn.end();
            if (func instanceof Function) {
                _conn.query(sql, ary, args, func);
            }
        }

    };


    /**
     * 2回目以降はインスタンスだけ返す
     *
     * @param {String} nm name of instance.
     * @param {String} file configuration file.
     * @return {Object} _instance object this constructor.
     */
    lcsDb = function(nm, file) {
        _name = nm || 'rockos';
        return _instance;
    };

} /* END of constructor */

/**
 *
 * creates an instance
 * @param {String} nm name of instance.
 * @param {String} file configuration file.
 * @return {Object} lcsDb new instance.
 */
lcsDb.create = function(nm, file) {
    return new lcsDb(nm, file);
};

/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) {
    module.exports = lcsDb;
}
