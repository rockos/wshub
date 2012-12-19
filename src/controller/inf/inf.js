/*
 * main routine
 * date 22.mar.2012
 */
//libap = require('../../lib/ap/libap');
//var LCSAP = require('../../lib/ap/lcsap');
//var lcsAp = new LCSAP('MOP');

exports.main = function(req, res){
    var deffile = './controller/data/def.json';
    var posts = JSON.parse(require('fs').readFileSync(deffile));
    /*
    if (req.session.userid) {
	posts.userid = req.session.userid;
	res.render('scr/scr800', posts);
    } else {
	res.redirect('/');
    }
    */
    if (lcsAp.isSession(req.session)) {
		posts.userid = req.session.userid;
		res.render('scr/scr800', posts);
    } else {
		res.redirect('/');
    }

};
