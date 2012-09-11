/**
 * MySqlインターフェース
 *
 * @modlue lcsDb
 */
var fs = require('fs');
var async = require('async');

/* lcsxxはグローバルオブジェクトとしてapp.jsで作成される。
 var lcsAp = require('../ap/lcsap').create('LCSDB');
*/
const _dbIDLE = -1;
const _dbCONNECTED = 1;

/**
 *  Constructor
 *
 *
 */
function lcsDb(nm, file) {

    var _instance
        ,_name = nm || "rockos"
        ,_status = _dbIDLE
        ,_conn = {};

    if (_status != _dbCONNECTED) {
        _conn = _connectServer(file);
        _status = _dbCONNECTED;
    }

    _instance = this;

    /**
     * 
     *
     * @method connect
     * @param {file} 
     * @return {Object}
     */
    function _connectServer(cf) {

        /* mysql */
        var mysql = require('mysql');
        var conf  = JSON.parse(require('fs').readFileSync(cf));
        var mysqlConfig = {};
        
        mysqlConfig.host = conf.host;
        mysqlConfig.port = conf.port;
        mysqlConfig.user = conf.user;
        mysqlConfig.password = conf.password;
        mysqlConfig.database = conf.database;
    
        return mysql.createClient(mysqlConfig);
    };

    /**
     * トランザクションの開始
     *
     * @method startTran
     * @params void
     *
     */
    function _startTran(){
        _conn.query('start transaction', 
                    function(err, results) {
                        if (err){
                            lcsAp.log('start tran err: ' + err);
                        }
                    });

        return true;
    };

    /**
     * トランザクションのコミット
     *
     * @method commitTran
     * @params void
     *
     */
    function _commitTran() {
        _conn.query('commit', 
                    function(err, results) {
                        if (err){
                            lcsAp.log('commit tran err: ' + err);
                        }
                    });

        return true;
    };
    /**
     * トランザクションのロールバック
     *
     * @method rollback Tran
     * @params void
     *
     */
    function _rollbackTran() {
        _conn.query('rollback', 
                    function(err, results) {
                        if (err){
                            lcsAp.log('rollback tran err: ' + err);
                        }
		 });
        
        return true;
    };

    /*
     * データベース更新処理
     *
     * @method update
     * @params {[function]}funcs, {Object}updString
     *
     */
    lcsDb.prototype.update = function (funcs, updString, opt) {
        
        _startTran();

        var exec_lists = [];

        for ( var i = 0, max = funcs.length; i < max; i++ ) {
            if (i === 0 ) {
                exec_lists[i] = async.apply(funcs[i], updString);
            } else {
                exec_lists[i] = funcs[i];
            }
        }
        async.waterfall( exec_lists, function (err) {
                if (err) {
                    _rollbackTran();
                    
                } else {
                    _commitTran();
                }
                lcsAp.logdb(updString);
                opt(err);
            });
    };

    /*
     * クエリ発行
     *
     * @method cmnd
     * @params {[String]}funcs, {[Array]}ary
     *
     */
    lcsDb.prototype.cmnd = function (sql, ary, adt, callback) {
        _conn.query(sql, ary,
                    function(err, results) {
                        if (err){
                            lcsAp.log('cmnd  err: ' + err);
                            callback(err, adt);
                        } else {
                            callback(null, adt);
                        }
                    });
    };

    /*
     * クエリ発行
     *
     * @method query
     * @params {[String]}funcs, {[Array]}ary
     *
     */
    lcsDb.prototype.query = function () {
        var sql, ary, func;
        var arg = arguments;

        if (arg.length == 1) {
            sql = arg[0];
            _conn.query(sql,
                        function(err, results) {
                            if (err){
                                lcsAp.log('query err: ' + err);
                            }
                        });
        } else if (arg.length == 2) {
            sql = arg[0];
            /* */
            if (arg[1] instanceof Array) {
                ary = arg[1];
                _conn.query(sql, ary,
                            function(err, results) {

                                if (err){
                                    lcsAp.log('query err: ' + err);
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
                                if (err){
                                    lcsAp.log('query err: ' + err);
                                }

                                /* is callback True?  */
                                if (arg[1] instanceof Function) {
                                    func = arg[1];
                                    func(err, results);                                
                                }
                            });
            }
        } else {
            sql =  arg[0];
            ary = arg[1];
            func = arg[2];
            _conn.query(sql, ary,
                        function(err, results) {

                            if (err){
                                lcsAp.log('query err: ' + err);
                            }
                            func(err, results);
                        });
        }
    };


    /*
     * 2回目以降はインスタンスだけ返す
     */
    lcsMo = function (nm, file) {
        _name = nm || "rockos";
        return _instance;
    };

}; /* END of constructor */

/**
 * 
 * creates an instance
 */
lcsDb.create = function(nm, file) {
    return new lcsDb(nm, file);
};

/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) module.exports = lcsDb;
