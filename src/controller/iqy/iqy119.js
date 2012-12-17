'use strict';
/* common file include */
/*
var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('TST');
var lcsDb = require(rootdir + 'lib/db/lcsdb').create('TST', rootdir+'etc/db.cf');
*/
/* local file */


var lang = 'jp';

/*
 * 04-sep-2012
 */
function showDemo(req, res, posts) {

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;


    /*
      [posts.mesg, posts.mesg_lavel_color] = lcsAp.getMsgI18N(String(err));
    */
    posts.dspcstm = new Array;
    posts.dspcstm["corp"] = "hidden";
    posts.dspcstm["priv"] = "hidden";
    posts.dspcstm["vist"] = "hidden";
    if( req.method=="POST" ) {
        switch( req.body.dspcstm ) {
        case "corp":
            posts.dspcstm["corp"] = "";
            posts.dspcstm_val = "corp";
            break;
        case "priv":
            posts.dspcstm["priv"] = "";
            posts.dspcstm_val = "priv";
            break;
        case "vist":
            posts.dspcstm["vist"] = "";
            posts.dspcstm_val = "vist";
            break;
        case "default":
            posts.dspcstm["corp"] = "";
            posts.dspcstm_val = "corp";
            break;
        }
    } else {
        var str = req.url.replace(/\.+/,'').split('/');
        switch( str[2] ) {
        case "201":
            posts.dspcstm["corp"] = "";
            posts.dspcstm_val = "corp";
            break;
        case "202":
            posts.dspcstm["priv"] = "";
            posts.dspcstm_val = "priv";
            break;
        case "203":
            posts.dspcstm["vist"] = "";
            posts.dspcstm_val = "vist";
            break;
        default:
            posts.dspcstm["corp"] = "";
            posts.dspcstm_val = "corp";
            break;
        }
    }
    
    res.render('scr/scr119', posts);
};


/*
 * main routine
 * date 22.mar.2012
 * @req {object} request data from user agent
 * @res {object} responce data to user agent
 * @frame {object} page infomation
 */
exports.main = function(req, res, frame) {

    var posts = {};
    /* below is for test. */
    var file = './ini/data/iqy119.json',
    inifile = './ini/data/iqy119ini.json';

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;
    posts.pageTags = frame.pageTags.scr119;
    debugger;
    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    if (req.body['TANA']) {
        console.log("hit qry :"+req.body['TANA']);
        posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
        posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 
        showDemo(req, res, posts);
    } else {
        console.log("hit initial :"+req.body['QRY']);
        posts.pageNavi = JSON.parse(require('fs').readFileSync(inifile));
        posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 
        showDemo(req, res, posts);

    }
};
