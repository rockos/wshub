'use strict';
/* common file include */
var url = require("url");

var MYNAME = "SYS"
var rootdir = process.env.LOCOS_DEV;
//var lcsAp = require(rootdir + 'lib/ap/lcsap').create(MYNAME);
//var lcsDb = require(rootdir + 'lib/db/lcsdb').create(MYNAME, rootdir+'etc/db.cf');

/* local file */


/*
 * Mar-25-2012
 */
function checkUser(req, res) {
    var sql ='select userid,password from user where userid=?';
    lcsDb.query(sql, [req.body.userid],function(err, results, fields) {
            if (err){
                console.log('err: ' + err);
                return res.redirect('/');
            }
            debugger;
            if (results.length == 0) {
                console.log('userid not exist: ' + req.body.userid);
                return res.redirect('/');
            }
            if(results[0].userid === req.body.userid && 
               results[0].password === req.body.password) {
                req.session.views = 1;
                req.session.userid = req.body.userid;
                req.session.password = req.body.password;
                return res.redirect('scr/800'); /* 初期はmail画面 */
            } else {
                return res.redirect('/');
            }
        });
};


/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res){

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    var pathname = url.parse(req.url).pathname;
    if (pathname == '/check') {
        //        checkUser(req, res);
        res.redirect('scr/800');
    } else if (pathname == '/') {
        loginUser(req, res);
    }
};
