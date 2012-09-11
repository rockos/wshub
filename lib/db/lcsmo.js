/**
 * mongodbインターフェース
 *
 * @modlue lcsMo
 */
var lcsAp = require('../ap/lcsap').create('LCSMO');

var mongoose = require('mongoose');

/*
 * Constructor
 *
 */
function lcsMo(nm, cf) {

    var _name = nm || "rockos",
        _db = "";
    var instancs = this;
    var _conf
        , _conStr
        , _schema_gndlog
        ,_model_gndlog
    /* 設定ファイル読み込み */
    _conf = JSON.parse(require('fs').readFileSync(cf));

    /*
     * mongodbに接続
     */
   _conStr = 'mongodb://' + _conf.host + '/' + _conf.database;
    //  mongoose.connect('mongodb://localhost/test');
    mongoose.connect(_conStr);

    /**
     *
     * Schemaの定義
     * Default Schemaから新しいSchemaを定義
     */
    _schema_gndlog = new mongoose.Schema({
            mc_begin: String,
            mc_name: String,
            mc_state: String,
            mc_date: Date
        });

    /* 
     * モデル化  model('モデル名', '定義したスキーマクラス')
     */
    _model_gndlog = mongoose.model('gndlog', _schema_gndlog);



   /* 定義したときの登録名で呼び出し */
    //    var gndLog = mongoose.model('gndlog');



    lcsMo.prototype.disconnect = function() {
        mongoose.disconnect();
    };

    /**
     *
     * @method findAll
     *
     */
    lcsMo.prototype.findAll = function(callback) {
        _model_gndlog.find(function(err, docs) {
                debugger;
                callback(err, docs)
            });
    };

    /**
     *
     * @method findById
     */
    lcsMo.prototype.findById = function(id, callback) {
        _model_gndlog.findById(id, function(err) {
                callback()
            });
    };
    
    /**
     *
     * @method findById
     */
    lcsMo.prototype.find = function(param, callback) {
        _model_gndlog.find(param, function(err, docs) {
                callback(err, docs)
            });
    };
    /**
     * @method save document to specified collection.
     * @param {String} schema name
     * @params {[Array] 
     * @params {function} callback
     */
    lcsMo.prototype.save = function(scm, params, callback) {

        if (scm != "gndlog") {
            return callback("","");
        }

       _db = new _model_gndlog();
        for (var k in params) {
            _db[k] = params[k];
        }

       _db.save(function(err) {
                callback(err);
            });
    };

    /*
     * クエリ発行
     *
     * @method query
     * @params {[String]}funcs, {[Array]}ary
     *
     */
    lcsMo.prototype.query = function () {
        _model_gndlog.query(arguments);
    }
    /*
     * 2回目以降はインスタンスだけ返す
     */
    lcsMo = function () {
        return instancs;
    };


}; /* END of constructor */

/**
 * 
 * creates an instance
 */
lcsMo.create = function(nm, file) {
    return new lcsMo(nm, file);
};

/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) module.exports = lcsMo;
