libap = require('../../lib/ap/libap');

/* for screen */
var fs = require('fs');


exports.main = function(req, res, conn){
    switch (req.params.id) {
    case '101':
    console.log('101called params.id: '+req.params.id);
    return scr101(req, res, conn);
    case '102':
    return scr102(req, res, conn);
    default:
    console.log('params.id: '+req.params.id);
    res.redirect('/');
    }
}
/*
 * chart test
 */
    function scr102(req, res, conn) {
	var file = './controller/data/iqy.json';
	var deffile = './controller/data/def.json';

	if (!libap.isSession(req.session)) {
	    res.redirect('/');
	}


	var posts = JSON.parse(require('fs').readFileSync(deffile));
	posts.title="部材別入出庫頻度";
	posts.scrhead= ""
	posts.comment="Highcharts";

	posts.userid = (req.session.userid)?req.session.userid:'undefined';
	res.render('scr/scr102', posts);
    };
/*
 *
 */
    function scr101(req, res, conn) {
	var file = './controller/data/iqy.json';
	var deffile = './controller/data/def.json';

	if (!libap.isSession(req.session)) {
	    res.redirect('/');
	}

	if (req.body['refresh'] == 'REFRESH') {
	    var posts = JSON.parse(require('fs').readFileSync(deffile));
	    posts.userid = (req.session.userid)?req.session.userid:'undefined';
	    res.render('scr/scr101', posts);
	} else if (req.body['update'] == 'UPDATE') {
	    var posts = JSON.parse(require('fs').readFileSync(file));
	    posts.userid = (req.session.userid)?req.session.userid:'undefined';
	    res.render('scr/scr101', posts);
	} else {
	    var posts = JSON.parse(require('fs').readFileSync(deffile));
	    posts.userid = (req.session.userid)?req.session.userid:'undefined';
	    res.render('scr/scr101', posts);
	}
    };


/*
fs.readFile('/data/iqy.json'', "utf-8", function (err, data) {
time = 0;
data = data.split('\n').forEach(function (val, i) {
time += +val
    })
        r = parseInt((time/60))+'\n'+(time%60)

	    fs.writeFile(file, r);
    });
*/