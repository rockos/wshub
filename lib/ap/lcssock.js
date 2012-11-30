/**
 * Socket.io インターフェース
 *
 * @modlue lcsSOCK
 */


/* lcsxxはグローバルオブジェクトとしてapp.jsで作成される。
   var lcsAp = require('./lcsap').create('lcsUI', process.env.LOCOS_DEV);
   */
function lcsSOCK(nm) {

    var _instance,
        _name = nm,
        _socketio = {},
        _exec = {},
        _handle = {},
        _namespace = {};
  
    /**
     * default comparison function
     */



    /**
     * private method 
     *
     *
     */
    function _addPropety(srckey, srcval) {
        var key, subkey, str = '';
        var obj;
        var a = {};

        for (key in srcval) {
            if (key == 'path' && srcval[key] != 'undefined') {
                if (srcval[key].length) {
                    _handle[srckey] = require(srcval[key]);
                }
            } else if (key == 'ns' && srcval[key] != 'undefined') {
                _namespace[srckey] = srcval[key];
            } else if (key == 'exec' && srcval[key] != 'undefined') {
                _exec[srckey] = srcval[key];
            } else {
                lcsAp.syslog('error',
                             {'name': _name, 'addProperty : invalid args': srcval[key]});
                return false;
            }
        }
        return true;
    };
    /**
     * ページ情報設定
     *
     * @param  {key:value}
     * @return {Object}
     */
    lcsSOCK.prototype.config = function(objs) {
        try {
            if (objs === null || objs === 'undefined') {
                lcsAp.syslog('error', {'invalid params': "lcssock.config"});
                return false;
            }
            var param = {},
            key = {};

            param = objs;
            if (param.map) {
                var map = JSON.parse(require('fs').readFileSync(param.map));
                for (var key in map) {
                    if (!_addPropety(key, map[key])) {
                        return false;
                    }
                }
            }
        } catch (e) {
            lcsAp.syslog('error', {'uncaughtException trace': e.stack});
        }
    };
    /**
     * socket listen
     * @param  
     */
    lcsSOCK.prototype.listen = function(httpServer) {
        _socketio = require('socket.io').listen(httpServer);
        /*configure*/
        _socketio.configure('production', function() {
                _socketio.set('log level', 1);
            });
        _socketio.configure('development', function() {
                _socketio.set('log level', 2);
            });
        _socketio.configure('degub', function() {
                _socketio.set('log level', 2);
            });
    };

    /**
     * socket.io instance
     * @param  
     * @return {Object}
     */
    lcsSOCK.prototype.io = function() {
        return _socketio;
    };

    /**
     * コネクトイベントを張って、クライアントにIDをemitする
     * @param  
     * @return
     */
    lcsSOCK.prototype.emitClientID = function() {
        for (var key in _namespace) {
            _socketio.of(_namespace[key]).on('connection', function(socket) {

                    console.log(_namespace[key]);
                    console.log(key);

                    _socketio.of(_namespace[key]).sockets[socket.id].emit("conn-conf", {
                            "clientID" : socket.id, 
                            "nameSpace" : _namespace[key] 
                        });
                    _socketio.of(_namespace[key]).sockets[socket.id].emit("debugz", "conn::"+socket.id+"<br>");
                });
        }
    };

    lcsSOCK.prototype.emitError = function() {
        _socketio.of('/error').on('connection', function(socket) {
                _socketio.of('/error').sockets[socket.id].emit("conn-conf", {
                        "clientID" : socket.id, 
                            "nameSpace" : '/error' 
                            });
            });
    };

    /*
     * 2回目以降はインスタンスだけ返す
     */
    lcsSOCK = function (nm) {
        _name = nm || "rockos";
        return _instance;
    };

};/* END of constructor */

/**
 * 
 * creates an instance
 */
lcsSOCK.create = function(nm) {
    _instance = new lcsSOCK(nm);
    return _instance;
};


if (typeof exports == 'object' && exports === this) {
    module.exports = lcsSOCK;
}

