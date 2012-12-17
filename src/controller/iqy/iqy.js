
/* for screen */
var fs = require('fs');



/*
 * chart test
 */
function scr102(req, res, posts) {

    posts = lcsAp.initialz_posts( req, posts );
	posts.userid = (req.session.userid)?req.session.userid:'undefined';
	res.render('scr/scr102', posts);
}

exports.main = function(req, res){

    var posts = {};
    scr102(req, res, posts);

};
