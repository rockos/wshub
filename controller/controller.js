var url = require("url");
var iqy = require("./iqy/iqy");
var str  = require("./str/str");
var mop  = require("./mop/mop");
var rpt  = require("./rpt/rpt");
var inf  = require("./inf/inf");


/* for screen */

/* function Definition */
var handle = {};
handle['/scr/101'] = iqy.main;
handle['/scr/102'] = iqy.main;
handle['/scr/201'] = str.main;
handle['/scr/301'] = mop.main; /* オーダープロセス*/
handle['/scr/701'] = rpt.main; /* 帳票作成*/
handle['/scr/800'] = inf.main;

exports.scrget = function(req, res){
    var pathname = url.parse(req.url).pathname;
    console.log('get action ' + req.params.id);
    if (typeof handle[pathname] === 'function') {
	handle[pathname](req, res);
    } else {
	res.redirect('/');
    }

};


exports.scrpost = function(req, res) {
    var pathname = url.parse(req.url).pathname;

    /* dispatch */
    if (typeof handle[pathname] === 'function') {
	handle[pathname](req, res);
    } else {
	res.redirect('/');
    }

};
/*
 *
 */
exports.check = function(req, res) {

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
	    /*
	    console.log('results.userid: ', results[0].userid);
	    console.log('results.password: ', results[0].password);
	    console.log('body.userid: ', req.body.userid);
	    console.log('body.password: ', req.body.password);
	    */
	    if(results[0].userid === req.body.userid && 
	       results[0].password === req.body.password) {
		req.session.views = 1;
		req.session.userid = req.body.userid;
		req.session.password = req.body.password;
		return res.redirect('/scr/800');/* 初期はmail画面 */
	    } else {
		return res.redirect('/');
	    }
	});
};

exports.logout = function(req, res) {
    auth.destroy(req.session.id, function(err) {
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