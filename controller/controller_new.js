/**
 * ユーザインターフェース
 *
 * @modlue lcsUI
 */
var lcsAp = require('../lib/ap/lcsap').create('lcsUI');

function lcsUI() {
    var _name = "",
        _handle = {},
        _args = argments;

}

lcsUI.prototype = new Array();
lcsUI.prototype.constructor = Array.prototype.constructor;

/**
 * default comparison function
 */
if (typeof exports == 'object' && exports === this) module.exports = lcsAp;

/**
 * private method 
 *
 *
 */
function addPropety(src) {
    var parent = {};

    if (src["path"] == "undefined" ||
        src["msg"] == "undefined") {
        lcsAp.log("lcsUI.addProperty : invalid args", src);
        return false;
    }
    _handle[src["msg"]] =  require(src[key]);

    /*
    for (key in src) {
        if (key == "path") {
            _handle["obj"] = require(src[key]);
            lcsAp.log("require :",src[key]);
            if (typeof parent["obj"].main === "function") {
                lcsAp.log("nm function :", parent["obj"]);
            }
        } else if (key == "msg") {
            parent["msg"] = src[key];
        }
    }
    */
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
    var key = '',
    fnc = {},
    map = JSON.parse(require('fs').readFileSync(file));


    for (key in map) {
        if (!addPropety(map[key])) {
            return false;
        }
        /*
        if (typeof cnv["obj"].main === 'function') {
            lcsAp.log("func is : ", cnv["obj"].main);
            return this;
        } else if (typeof cnv["obj"].main === 'string') {
            lcsAp.log("string is : ", cnv["obj"]);
        } else {
            lcsAp.log("UNDEFINED is : ", cnv["obj"]);
        }
        */
    }
};

function routingMap() {
    var funcmap = {};
    var map = JSON.parse(require('fs').readFileSync('./controller/map.json'));
    for (key in map) {
            var cnv = namespace(map[key]);
            if (typeof cnv["obj"].main === 'function') {
                lcsAp.log("func is : ", cnv["obj"].main);
                return this;
            } else if (typeof cnv["obj"].main === 'string') {
                lcsAp.log("string is : ", cnv["obj"]);
            } else {
                lcsAp.log("UNDEFINED is : ", cnv["obj"]);
            }
    };
};
/*
function doAction() {
    var funcmap = {};
    var map = JSON.parse(require('fs').readFileSync('./controller/map.json'));
    for (key in map) {
            var cnv = namespace(map[key]);
            if (typeof cnv["obj"].main === 'function') {
                lcsAp.log("func is : ", cnv["obj"].main);
                return this;
            } else if (typeof cnv["obj"].main === 'string') {
                lcsAp.log("string is : ", cnv["obj"]);
            } else {
                lcsAp.log("UNDEFINED is : ", cnv["obj"]);
            }
    };
};
*/
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
 
   if (typeof _handle[pathname] === 'function') {
		handle[pathname](req, res);
    } else {
		res.redirect('/');
    }
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
    if (typeof handle[pathname] === 'function') {
		handle[pathname](req, res);
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

