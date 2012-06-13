var url = require("url");
var iqy = require("./iqy/iqy");
var str  = require("./str/str");
var mop  = require("./mop/mop");
var rpt  = require("./rpt/rpt");
var inf  = require("./inf/inf");


/* for screen */

/* function Definition */
var handle = {};
handle['/'] = login;
handle['/logout'] = logout;
handle['/check'] = checkUser;
handle['/scr/101'] = iqy.main;
handle['/scr/102'] = iqy.main;
handle['/scr/201'] = str.main;
handle['/scr/301'] = mop.main; /* オーダープロセス*/
handle['/scr/701'] = rpt.main; /* 帳票作成*/
handle['/scr/800'] = inf.main;

/* export function */
exports.login = login;
exports.logout = logout;
exports.getAction = getAction;
exports.getScr = getScr;
exports.postScr = postScr;
exports.checkUser = checkUser;

function getAction(req, res){
	 /* 最終的に全てprivate varにする
	  */
    var pathname = url.parse(req.url).pathname;
    console.log('get action ' + req.params.id);
    if (typeof handle[pathname] === 'function') {
		handle[pathname](req, res);
    } else {
		res.redirect('/');
    }



};

function login(req, res){
    auth.get(req.session.id, function(err, sess) {
				 console.log('userid: ',req.session.userid);
				 if(sess && sess.views) {
					 res.render('scr/scr800', {
									title:'locos',userid:req.session.userid}); /* 初期はmail画面 */
				 } else {
					 res.render('login', {
									layout:'mylayout.ejs',
									title: 'LocoS',userid:'not login' });
				 }
			 });
	
};

function logout(req, res) {
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

function notfound(req, res){
  res.render('404', { layout:'mylayout.ejs',title: 'LocoS' });
};

/*
 * GET処理
 */
function getScr(req, res){
    var pathname = url.parse(req.url).pathname;
    /* console.log('get action ' + req.params.id);
	 */
    if (typeof handle[pathname] === 'function') {
		handle[pathname](req, res);
    } else {
		res.redirect('/');
    }

};

/*
 * POST処理
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
 */
function checkUser(req, res) {

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

