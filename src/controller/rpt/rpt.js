

/*
 * main routine
 * date 1.jun.2012
 */
exports.main = function(req, res, frame){
    var posts = {};
    var deffile = ROOTDIR + '/src/ini/data/def701.json';
    posts.pageNavi = JSON.parse(require('fs').readFileSync(deffile));

    if (!lcsAp.isSession(req.session)) {
		res.redirect('/');
    }
    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
    posts.pageNavi.userid = (req.session.userid)?req.session.userid:'undefined';

    posts.title ='帳票画面';
    res.render('scr/scr701', posts);
};
