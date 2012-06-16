/**
 * ユーザインターフェース
 *
 * @modlue lcsUI
 */
var url = require("url");
var lcsAp = require('./lcsap').create('lcsUI');

function lcsUI() {
    var _name = "",
        _msgmap = {},
        _template = "",
            _handle = {};
};
/**
 * 
 * creates an instance
 */
lcsUI.create = function(nm) {
	_name = nm;
    _msgmap = {"def":"nothing"};
    _template = {"ejs":"layout.ejs"};
    _handle = {"mgr": "undef"};
    /*    
    if (options != 'undefined') {
        this.config(options);
    }
    */
    return new lcsUI();
};

lcsUI.prototype = new Array();
lcsUI.prototype.constructor = Array.prototype.constructor;
/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) module.exports = lcsUI;


/**
 * private method 
 *
 *
 */
function _addPropety(srckey, srcval) {
    var key, subkey, str = '';
    var obj;
    var a = {};
    debugger;
    for (key in srcval) {
        if (key == "path" && srcval[key] != "undefined") {
            str = srcval[key].replace(/\.+/,'').split('/')[1];

            obj = require(srcval[key]);
            _handle[str] =  obj;

        } else if (key == "msg" && srcval[key] != "undefined") {
            for (subkey in srcval[key]) {
                _msgmap[subkey] = srckey;
            }
        } else if (key == "ejs" && srcval[key] != "undefined") {
                _template[srckey] = srcval[key];
        } else {
            lcsAp.log(_name+"addProperty : invalid args", srcval[key]);
            return false;
        }
    }
    return true;

};
/**
 * UI関数の登録
 *
 * @method config
 * @param {file} 関数登録用ファイル(JSON形式)
 * @return {Object}
 */
lcsUI.prototype.config = function (file) {

    map = JSON.parse(require('fs').readFileSync(file));
    debugger;
    for (key in map) {
        if (!_addPropety(key, map[key])) {
            return false;
        }
    }
};
/**
 * private function
 */
function _dispatch(req, res, msg) {

    if (typeof _handle[_msgmap[msg]].main === 'function') {
		_handle[_msgmap[msg]].main(req, res);
    } else {
		res.redirect('/');
        return fault;
    }

    return true;
};
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
    debugger;
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
    auth.get(req.session.id, 
             function(err, sess) {
                 //            console.log('userid: ',req.session.userid);
                 if(sess && sess.views) {
                     res.render('scr/scr800', {
                             title:'locKs',userid:req.session.userid}); /* 初期はmail画面 */
                 } else {
                     res.render('login', {
                             layout:'mylayout.ejs',
                             title: 'LocKs',userid:'not login' });
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
    /*
    delete req.session.userid;
    delete req.session.password;
    console.log('session.userid: ', req.session.userid);
    res.redirect('/');
    */
}
/**
 *
 *
 *
 */
lcsUI.prototype.notFound = function(req, res){
    res.render('404', { layout:'mylayout.ejs',title: 'LocoS' });
};

/**
 * GET処理
 * doActionヘ移行
 */
function getScr(req, res){
    var pathname = url.parse(req.url).pathname;
    if (typeof this._handle[pathname] === 'function') {
		this._handle[pathname](req, res);
    } else {
		res.redirect('/');
    }

};

/*
 * POST処理
 * doActionヘ移行
 */
function postScr(req, res) {
    var pathname = url.parse(req.url).pathname;
    /* dispatch */
    if (typeof handle[pathname] === 'function') {
		handle[pathname](req, res);
    } else {
		res.redirect('/');
    }

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

    var sql ='select userid,password from user where userid=?';
    client.query(sql, [req.body.userid],function(err, results, fields) {
            if (err){
                console.log('err: ' + err);
                return res.redirect('/');
            }

            if (results.length == 0) {
                console.log('userid not exist: ' + req.body.yserid);
                return res.redirect('/');
            }
            if(results[0].userid === req.body.userid && 
               results[0].password === req.body.password) {
                req.session.views = 1;
                req.session.userid = req.body.userid;
                req.session.password = req.body.password;
                return res.redirect('/scr/800'); /* 初期はmail画面 */
            } else {
                return res.redirect('/');
            }
        });
};

