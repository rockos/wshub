libap = require('../../lib/ap/libap');

/*
 * main routine
 * date 1.jun.2012
 */
exports.main = function(req, res){

    if (!libap.isSession(req.session)) {
	res.redirect('/');
    }

    var deffile = './controller/data/def701.json';
    var posts = JSON.parse(require('fs').readFileSync(deffile));
    posts.userid = (req.session.userid)?req.session.userid:'undefined';

    posts.title ='帳票画面';
    res.render('scr/scr701', posts);
};
