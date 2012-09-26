'use strict';
/* common file include */

/* local file */
var fn501a = require('./501a.js');


function _initial(req, res, frame){

    var posts = {};
    var inifile = './controller/data/mnt501ini.json';

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

    posts.pageNavi = JSON.parse(require('fs').readFileSync(inifile));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 

    debugger;
    fn501a.showDemo(req, res, posts, "scr/scr501");
}

/**
 * Main routine of profile editor
 * date 26.sep.2012 first edition.
 *
 */
exports.main = function(req, res, frame){

    /*Table of function for each button */
    var tof = {
        "501a_ADD": fn501a.addProf,
        "501a_QRY": fn501a.queryProf,
    };


    debugger;
    for (var key in tof) {
        if (req.body[key]) {
            if (typeof tof[key] === "function") {
                tof[key](req, res, frame);
                return;
            }
        }
    }
    _initial(req, res, frame);

    /*
      lcsAp.log("mnt501 Undefined caller");
      res.redirect('scr/scr404');
    */
};



