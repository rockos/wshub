'use strict';
/* common file include */
var domain = require('domain');
var glb_dm = domain.create();

/* local file */
var fn501a = require('./501a.js');
var fn501m = require('./501m.js');
var fn501d = require('./501d.js');


function _showInitial(req, res, frame) {

    var posts = {};
    var inifile = './ini/data/mnt501ini.json';
    var msg = lcsAp.getMsgI18N('0');
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

    posts.pageNavi = JSON.parse(require('fs').readFileSync(inifile));
    posts.pageNavi.userid = req.session.userid ?
        req.session.userid : 'undefined';

    res.render('scr/scr501', posts);
    //    fn501a.showDemo(req, res, posts, 'scr/scr501');
}
function _showScr(req, res, frame) {

    var posts = {};
    var inifile = './ini/data/mnt501ini.json';
    var msg = lcsAp.getMsgI18N('0');

    
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

    if (req.body['501a']) {
        posts.pageNavi = JSON.parse(require('fs').readFileSync(inifile));
        posts.pageNavi.userid = req.session.userid ?
            req.session.userid : 'undefined';

        res.render('scr/scr501a', posts);
    } else if (req.body['501m']) {
        posts.pageNavi = JSON.parse(require('fs').readFileSync(inifile));
        posts.pageNavi.userid = req.session.userid ?
            req.session.userid : 'undefined';

        res.render('scr/scr501m', posts);
    } else {
        posts.pageNavi = JSON.parse(require('fs').readFileSync(inifile));
        posts.pageNavi.userid = req.session.userid ?
            req.session.userid : 'undefined';

        res.render('scr/scr501d', posts);
    }
}

/*
 * Main routine of profile editor
 * date 26.sep.2012 first edition.
 *
 */
function dmfunc() {};
exports.main = function(req, res, frame) {

    var tof = {/* Table of function for each button */
        '501a' : _showScr,
        '501m' : _showScr,
        '501d' : _showScr,
        '501a_ADD' : fn501a.addProf,
        '501a_RTN' : _showInitial,
        /* message for modify */
        '501m_SEL' : fn501m.selUser,
        '501m_MOD' : fn501m.modProf,
        '501m_RTN' : _showInitial,

        /* message for delete */
        '501d_SEL' : fn501d.selUser,
        '501d_DEL' : fn501d.delProf,
        '501d_RTN' : _showInitial
    };
    try {
        for (var key in tof) {
            if (req.body[key]) {
                if (typeof tof[key] === 'function') {
                     tof[key](req, res, frame);
  //                  dmfunc = glb_dm.bind(tof[key]);
  //                  dmfunc(req, res, frame);
                    return;
                }
            }
        }
        _showInitial(req, res, frame);
    } catch (e) {
        lcsAp.exlog(e, lcsAp.getStackTrace());
    } 
};
/*
 *
 */
glb_dm.on('error', function(err) {
    debugger;
    lcsAp.syslog('error',
                 {'Detail': err,
                     'Trace': lcsAp.getStackTrace()}
                );
});

