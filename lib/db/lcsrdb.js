/**
 * Redisインターフェース
 *
 */
var redis = require("redis"),
    rdb = redis.createClient();
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
function lcsRdb(nm, file) {

    var _instance,
    _name = nm || 'rockos',
    _status = _dbIDLE,
    _conn = {};

    if (_status != _dbCONNECTED) {
        _conn = _connectServer(file);
        _status = _dbCONNECTED;
    }

    _instance = this;

    /**
     * connect redis server.
     *
     * @param {file} cf configuration file.
     * @return {Object} client mysql client object.
     */
    function _connectServer(cf) {
        try {

            return this;
        } catch (e) {
            lcsAp.syslog('error',
                         {'Detail': e.stack}
                        );
        }
    };

    /**
     * トランザクションの開始
     * @param {Object} args argument of parent function.
     * @param {Function} opt callback function.
     *
     */
    lcsRdb.prototype.startTran = function(args, opt) {
        rdb.multi();
    };

    /**
     * トランザクションのコミット
     *
     * @param {Object} args argument of parent function.
     * @param {Function} opt callback function.
     *
     */
    lcsRdb.prototype.commitTran = function(args, opt) {
        rdb.exec();

    };
    /**
     * トランザクションのロールバック
     *
     * @param {Object} args argument of parent function.
     * @param {Function} opt calback function.
     *
     */
    lcsRdb.prototype.rollbackTran = function(args, opt) {
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
    lcsRdb.prototype.hget = function(key, field, cb) {
        rdb.hget(key, field, cb);
    };
    /*
     *
     */
    lcsRdb.prototype.hset = function(key, field, data, cb) {
        rdb.hset(key, field, data, cb);
    };
    /**
     * 2回目以降はインスタンスだけ返す
     *
     * @param {String} nm name of instance.
     * @param {String} file configuration file.
     * @return {Object} _instance object this constructor.
     */
    lcsRdb = function(nm, file) {
        _name = nm || 'rockos';
        return _instance;
    };

} /* END of constructor */

/**
 *
 * creates an instance
 * @param {String} nm name of instance.
 * @param {String} file configuration file.
 * @return {Object} lcsRdb new instance.
 */
lcsRdb.create = function(nm, file) {
    return new lcsRdb(nm, file);
};

/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) {
    module.exports = lcsRdb;
}
