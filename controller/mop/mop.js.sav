var LCSAP = require('../../lib/ap/lcsap');
var lcsAp = LCSAP.create('IQY');


/*
 * main routine
 * date 1.jun.2012
 */
exports.main = function(req, res){

    if (!lcsAp.isSession(req.session)) {
	res.redirect('/');
    }

    var deffile = './controller/data/def.json';
    var posts = JSON.parse(require('fs').readFileSync(deffile));
    posts.title ='製造情報画面';
    posts.userid = (req.session.userid)?req.session.userid:'undefined';
    res.render('scr/scr301', posts);
};
