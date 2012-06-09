
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', {title: 'Locos', userid:'not LOGIN'})
};

exports.login = function(req, res){
    auth.get(req.session.id, function(err, sess) {
	    console.log('userid: ',req.session.userid);
	    if(sess && sess.views) {
		res.render('scr/scr800', {
			title:'locos',userid:req.session.userid}); /* 初期はmail画面 */
	    } else {
		res.render('login', {
			layout:'mylayout.ejs',
			title: 'LocoS',userid:'not login' })
	    }
	})

};

exports.notFound = function(req, res){
  res.render('404', { layout:'mylayout.ejs',title: 'LocoS' })
};