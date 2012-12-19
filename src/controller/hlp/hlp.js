'use strict';
/* common file include */

/*
 * Mar-25-2012
 */
function showHelp(req, res, posts) {

    //    var posts = {'title':'デモ説明','scrhead':'help','current':[]};

    var msg = lcsAp.getMsgI18N("0");

    /* page情報設定 */
    posts.pageNavi = {};
    posts.pageNavi.userid = (req.session.userid)? req.session.userid:'undefined';
    posts.current = [];
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;


    //2012.07.20 taka
    if( !posts.pageNavi.userid || posts.pageNavi.userid=='undefined'
        || posts.pageNavi.userid=='not login' ) {
        posts.layouts = "layout2.ejs";
    }else {
        posts.layouts = "layout.ejs";
    }

    if (req.body['Demo']) {
        posts.title = "Demo";
        posts.current['Demo'] = "current";
        res.render('scr/scr801', posts);
    } else if (req.body['I18N']) {
        posts.title = "I18N";
        posts.current['I18N'] = "current";
        res.render('scr/scr802', posts);
    } else if (req.body['Graph']) {
        posts.title = "Graph";
        posts.current['Graph'] = "current";
        res.render('scr/scr803', posts);
    } else {
        posts.title = "Help Desk";
        posts.current['xxx'] = "current";
        res.render('scr/scr800', posts);
    }
};
/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res, frame){

    var posts = {};

    /* page情報設定 */
    posts = frame.frameNavi;


    showHelp(req, res, frame);

};
