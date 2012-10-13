/**
 * ユーザインターフェース
 *
 * @modlue lcsUI
 */
var url = require("url");
//var lcsUserAgentUtil = require("./lcsutil");


/* lcsxxはグローバルオブジェクトとしてapp.jsで作成される。
   var lcsAp = require('./lcsap').create('lcsUI', process.env.LOCOS_DEV);
   */
function lcsUI(nm) {

    var _instance
    ,_frameInf = {}
    ,_tags = {}
    ,_name = nm
    ,_msgmap = {"def":"nothing"}
    ,_template = {"ejs":"layout.ejs"}
    ,_parmit = {"parmit":0}
    ,_handle = {"mgr": "undef"};
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
            if (key == "path" && srcval[key] != "undefined") {
                str = srcval[key].replace(/\.+/,'').split('/');
                str = str[str.length-1];
                obj = require(srcval[key]);
                _handle[str] =  obj;

            } else if (key == "msg" && srcval[key] != "undefined") {
                for (subkey in srcval[key]) {
                    _msgmap[subkey] = srckey;
                }
            } else if (key == "ejs" && srcval[key] != "undefined") {
                _template[srckey] = srcval[key];
            } else if (key == "parmit" && srcval[key] != "undefined") {
                _parmit[srckey] = srcval[key];
            } else {
                lcsAp.log(_name+"addProperty : invalid args", srcval[key]);
                return false;
            }
        }
        return true;

    };
    /**
     * ページ情報設定
     *
     * @method config
     * @param [{key:value},{key,value}...]
     * @return {Object}
     */
    lcsUI.prototype.config = function(objs) {
        if (objs === null || objs === 'undefined') {
            lcsAp.log('invalid params:" lcsui.config');
            return false;
        }

        var param = {};
        for (var i = 0,max = objs.length; i < max; i++) {
            param = objs[i];
            if (param.map) {
                var map = JSON.parse(require('fs').readFileSync(param.map));
                for (var key in map) {
                    if (!_addPropety(key, map[key])) {
                        return false;
                    }
                }
            } else if (param.frame) {
                _frameInf = JSON.parse(require('fs').readFileSync(param.frame));

            } else if (param.tags) {
                _tags = JSON.parse(require('fs').readFileSync(param.tags));
            } else {
                lcsAp.log('invalid params: lcsui.config '+ param);
                return false;
            }
        }
    };
    /**
     * private function
     */
    function _dispatch(req, res, msg) {
        var inf = {};
        try {

            if (typeof _handle[_msgmap[msg]].main === 'function') {
                lcsAp.setLangI18N(req.session.lang);
                if( _parmit[_msgmap[msg]] > req.session.permit ) {
                    //res.redirect('/444');
                    res.render('444', {
                        title:'Rockos',userid:req.session.userid}); /* 初期はmail画面 */
                        return false;
                }else {
                    inf.frameNavi = _frameInf;
                    inf.pageTags = _tags
                    _handle[_msgmap[msg]].main(req, res, inf);
                }
            } else {
                res.redirect('/');
                return false;
            }
        } catch (e) {
            /* 例外処理をここに書くが、非同期関数内で発生した場合はここで補足できない*/
            /* app.jsのprocess.onで処理する */
            lcsAp.log(e);
            lcsAp.log(e.stack);
            res.redirect('/');
        }

        return true;
    };

    /**
     * page情報を返す
     *
     * @method getPageInf
     * @params none
     */
    lcsUI.prototype.getPageInf = function(){
        return _pageInf;
    }

    /**
     * 指定されたパスに従って関数を呼びだす
     *
     * @method doAction
     * @params {Object} req
     * @params {Object} res
     *
     */
    lcsUI.prototype.doAction = function(req, res){
        var pathname = url.parse(req.url).pathname;

        if (!_dispatch(req, res, pathname)){
            lcsAp.log('msg fault ', pathname);
            return false;
        }
        return true;
    };

    /**
     * ログイン画面(セッション管理)
     *
     * @method login
     * @params {Object} req
     * @params {Object} res
     *
     */
    lcsUI.prototype.login = function(req, res) {
        var posts = {};

        posts.frameNavi = _frameInf;
        posts.layouts = "layout.ejs";
        posts.pageNavi = {};
        posts.frameNavi.userid = req.session.userid;
        auth.get(req.session.id, 
                 function(err, sess) {
                     if(sess && sess.views) {
                         /*既にログイン済み*/
                         res.render('scr/scr800', posts);
                     } else {
                         /* Node.jsでユーザエージェントを取得 */
                         var ua = req.headers['user-agent'];
                         /* フィーチャーフォン判別 */
                         if (lcsUserAgentUtil.isMobile(ua)) {
                             /* フィーチャーフォン用HTML返却*/
                             posts.layouts = "layout3.ejs";
                             res.render('scm/scr800', posts);

                         } else if (ua.indexOf('iPod') >= 0) { /* iPos用HTML返却*/
                         posts.layouts = "layout3.ejs";
                         res.render('scm/scr800', posts);
                         } else {   /* PC、スマートフォン、タブレット用HTML返却 */

                         //ログインの時に801を出すように変更 2012.07.20
                         posts.layouts = "layout2.ejs";
                         posts.frameNavi.userid = "Not LOGIN";
                         res.render('scr/login', posts);

                         }
                     }
                 });

    };

    /**
     * ログアウト機能(セッション切断)
     *
     * @method logout
     * @params {Object} req
     * @params {Object} res
     *
     */
    lcsUI.prototype.logout = function(req, res) {
        auth.destroy(req.session.id, 
                     function(err) {

                         req.session.destroy();
                         console.log('deleted sesstion');

                         res.redirect('/');
                     });
    }

    /**
     * @methpd notFound
     * @param {Object} req
     * @param {Object} res
     *
     */
    lcsUI.prototype.notFound = function(req, res){
        res.render('404', { layout:'layout2.ejs',title: 'Rockos' });
    };


    /*
     * ログイン処理
     *
     * @method checkUser
     * @params {Object} req
     * @params {Object} res
     *
     */
    lcsUI.prototype.checkUser = function(req, res) {

        var sql ='select id_user as "userid",password,permit from m_users where id_user=?';
        lcsDb.query(sql, [req.body.userid],function(err, results, fields) {
            if (err){
                console.log('err: ' + err);
                return res.redirect('/');
            }

            if (results.length == 0) {
                console.log('userid not exist: ' + req.body.userid);
                return res.redirect('/');
            }
            if(results[0].userid === req.body.userid && 
               results[0].password === req.body.password) {
                req.session.views = 1;
            req.session.userid = req.body.userid;
            req.session.password = req.body.password;
            req.session.permit = results[0].permit;
            req.session.lang = req.body.lang;

            return res.redirect('/scr/800'); /* 初期はmail画面 */
            } else {
                return res.redirect('/');
            }
        });
    };


    /**
     * validation
     *
     * @method validation check
     * @params Array
     */

    lcsUI.prototype.checkVal = function(req, params){
        var errors = {}, errmsg = {};
        for (var i = 0,max = params.length; i < max; i++) {
            switch (params[i]) {

                case 'nickname':
                    req.check(params[i], '101').len(5,20); /* invalid nickname */
                break;
                case 'password':
                    req.check(params[i], '105').len(5,20); /* invalid password */
                break;
                case 'email':
                    req.check(params[i], '106').len(5,20); /* invalid email */
                break;

                default:
                    errmsg = lcsAp.getMsgI18N("199"); /* Invalid field specified */
                return errmsg;
            }
            errors = req.validationErrors();
            if (errors) {
                errmsg = lcsAp.getMsgI18N(errors[0].msg);
                return errmsg;
            }
        }
        return false; /* succes */
    }


    /*
     * 2回目以降はインスタンスだけ返す
     */
    lcsUI = function (nm) {
        _name = nm || "rockos";
        return _instance;
    };

};/* END of constructor */

/**
 * 
 * creates an instance
 */
lcsUI.create = function(nm) {
    _instance = new lcsUI(nm);
    return _instance;
};


if (typeof exports == 'object' && exports === this) {
    module.exports = lcsUI;
}
/**
 * ユーザエージェント解析ユーティリティ
 * （モジュールパターンで記述）
 */
var lcsUserAgentUtil = function () {
    'use strict';
    var cache = {}, // メモ化によるキャッシュ
    os, // OS解析定義配列
    browser, // ブラウザ解析定義配列
    getOs, // OS情報取得関数
    getBrowser, // ブラウザ情報取得関数
    getOsAndBrowserStr, // OS・ブラウザ情報文字列取得関数
    isMobile, // フィーチャーフォン判定関数
    publicObj; // public関数用オブジェクト

    // OS解析定義
    // 記述順に評価するため、順番も考慮が必要です
    os = [ 
        {
        type: 'ios',
        getName: function (ua) {
            var name = null, type = '', isMatch = false;

            if (ua.indexOf('iPad') >= 0) {
                isMatch = true;
                type = ' (iPad)';
            } else if (ua.indexOf('iPod') >= 0) {
                isMatch = true;
                type = ' (iPod)';
            } else if (ua.indexOf('iPhone') >= 0) {
                isMatch = true;
                type = ' (iPhone)';
            }

            if (isMatch) {
                name = 'iOS';
                if (/OS ([0-9_]+)/.test(ua)) {
                    name += ' ' + RegExp.$1.replace(/_/g, '.');
                }
                name += type;
            }
            return name;
        }
    },
    {
        type: 'android',
        getName: function (ua) {
            var name = null;
            if (ua.indexOf('Android') >= 0) {
                name = 'Android';
                if (/Android ([＼-a-zA-Z0-9＼.]+)/.test(ua)) {
                    name += ' ' + RegExp.$1;
                }
            }
            return name;
        }
    },
    {
        type: 'mac',
        getName: function (ua) {
            return (ua.indexOf('Mac') >= 0) ? 'Macintosh' : null;
        }
    },
    {
        type: 'windows',
        getName: function (ua) {
            return (ua.indexOf('Win') >= 0) ? 'Windows' : null;
        }
    }
    ];

    // ブラウザ解析定義
    // 記述順に評価するため、順番も考慮が必要です
    browser = [
        {
        type: 'opera',
        getName: function (ua) {
            var name = null;
            if (ua.indexOf('Opera') >= 0) {
                name = 'Opera';
                if (/Version\/([0-9\.]+)/.test(ua)) {
                    name += ' ' + RegExp.$1;
                } else if (/Opera ([0-9\.]+)/.test(ua)) {
                    name += ' ' + RegExp.$1;
                } else if (/Opera\/([0-9\.]+)/.test(ua)) {
                    name += ' ' + RegExp.$1;
                }
            }
            return name;
        }
    },
    {
        type: 'msie',
        getName: function (ua) {
            var name = null;
            if (ua.indexOf('MSIE') >= 0) {
                name = 'Internet Explorer';
                if (/MSIE ([0-9\.]+)/.test(ua)) {
                    name += ' ' + RegExp.$1;
                }
            }
            return name;
        }
    },
    {
        type: 'firefox',
        getName: function (ua) {
            var name = null;
            if (ua.indexOf('Firefox') >= 0) {
                if (ua.indexOf('Fennec') >= 0) {
                    name = 'Fennec';
                    if (/Fennec\/([0-9\.]+)/.test(ua)) {
                        name += ' ' + RegExp.$1;
                    }
                } else {
                    name = 'Firefox';
                    if (/Firefox\/([0-9\.]+)/.test(ua)) {
                        name += ' ' + RegExp.$1;
                    }
                }
            }
            return name;
        }
    },
    {
        type: 'chrome',
        getName: function (ua) {
            var name = null;
            if (ua.indexOf('Chrome') >= 0) {
                name = 'Chrome';
                if (/Chrome\/([0-9\.]+)/.test(ua)) {
                    name += ' ' + RegExp.$1;
                }
            }
            return name;
        }
    },
    {
        type: 'safari',
        getName: function (ua) {
            var name = null;
            if (ua.indexOf('Safari') >= 0) {
                if (ua.indexOf('Mobile') >= 0) {
                    name = 'Mobile Safari';
                } else {
                    name = 'Safari';
                }
                if (/Version\/([0-9\.]+) Safari/.test(ua)) {
                    name += ' ' + RegExp.$1;
                }
            }
            return name;
        }
    }
    ];

    // OS情報を取得
    getOs = function (ua) {
        var name, i, len, cacheObj = cache[ua];

        if (ua === undefined) {
            return null;
        }

        if (cacheObj !== undefined && cacheObj.os !== undefined) {
            return cacheObj.os;
        }

        for (i = 0, len = os.length; i < len; i += 1) {
            name = os[i].getName(ua);
            if (name !== null) {
                break;
            }
        }

        if (name === null) {
            name = 'undefined';
        }

        cache[ua] = cache[ua] || {};
        cache[ua].os = name;

        return name;
    };

    // ブラウザ情報を取得
    getBrowser = function (ua) {
        var name, i, len, cacheObj = cache[ua];

        if (ua === undefined) {
            return null;
        }

        if (cacheObj !== undefined && cacheObj.browser !== undefined) {
            return cacheObj.browser;
        }

        for (i = 0, len = browser.length; i < len; i += 1) {
            name = browser[i].getName(ua);
            if (name !== null) {
                break;
            }
        }

        if (name === null) {
            name = 'undefined';
        }

        cache[ua] = cache[ua] || {};
        cache[ua].browser = name;

        return name;
    };

    // OSとブラウザ情報を文字列として返却
    getOsAndBrowserStr = function (ua) {
        var str, cacheObj = cache[ua];

        if (ua === undefined) {
            return null;
        }

        if (cacheObj !== undefined  && cacheObj.toString !== undefined) {
            return cacheObj.toString;
        }

        str = getOs(ua);
        // PCの場合はブラウザ情報を付与する
        if (!/(iOS|Android)/.test(os)) {
            str += ' / ' + getBrowser(ua);
        }

        cache[ua] = cache[ua] || {};
        cache[ua].toString = str;

        return str;
    };
    // フィーチャーフォン判定
    isMobile = function (ua) {
        var isMobile, cacheObj = cache[ua];
        if (ua === undefined) {
            return false;
        }

        if (cacheObj !== undefined && cacheObj.isMobile !== undefined) {
            return cacheObj.isMobile;
        }

        isMobile = /(DoCoMo|SoftBank|UP\.Browser|Vodafone|KDDI)/.test(ua);

        cache[ua] = cache[ua] || {};
        cache[ua].isMobile = isMobile;

        return isMobile;
    };

    publicObj = {
        getOs: getOs,
        getBrowser: getBrowser,
        getOsAndBrowserStr: getOsAndBrowserStr,
        isMobile: isMobile
    };

    return publicObj ;
}();

