'use strict';
//var libap = require('../../lib/ap/libap');
var LCSAP = require('../../lib/ap/lcsap');
var lcsAp = LCSAP.create('STR');

/* for screen */
var fs = require('fs');


/*
 * Mar-25-2012
 */
function showPart(req, res) {
    var sql ='select * from part order by pcode';
    client.query(sql, function(err, results, fields) {
	    if (err){
		console.log('err: ' + err);
	    }

	    var posts = {'title':'入庫画面','scrhead':'MySQLを使った画面','comment':'JSON Data','tab':results};
	    /* for debug
	    console.log('results=> ',results);
	    console.log('results[0].pcode=> ',results[0].pcode);
	    console.log('dsp.dcrheade=> ',dsp.scrhead);
	    console.log('dsp.tab[0]=> ',dsp.tab[0]);

	    */

	    posts.userid = (req.session.userid)?req.session.userid:'undefined';
		posts.mesg = 'ここは警告表示行';


	    res.render('scr/scr201', posts);
	});
};
/*
 * Mar-28-2012
 */
function registPart(req, res, post) {
    /*    console.log(req.body);
    console.log(req.files);
    console.log('req,body: ', req.body);
    */

    /* insert SQL */
    var insSql ='insert into part (pcode,sqty,lotn,mem1,mem2,mem3,pnam) ';
	insSql += 'values (?,?,?,?,?,?,?)';
    var ary = [];
    ary = [req.body.pcode, req.body.sqty,req.body.lotn,req.body.mem1,req.body.mem2,req.body.mem3, req.body.pnam];
    client.query(insSql, ary,
		 function(err, results) {
		     if (err){
			 console.log('err: ' + err);
		     }
		     var dsp = {'title':'登録完了','scrhead':'HAHA','comment':'JSON','tab':results};

		     /* return res.render('scr/scr201', post); */
		     showPart(req, res);

		 });
    

}
/*
 * 2-jun-2012 new
 */
function deletePart(req, res, post) {

    /* delete */
    var delSql ='delete from part where pcode=?';
    var ary = [];
    ary = [req.body.pcode];

    client.query(delSql, ary,
		 function(err, results) {
		     if (err){
			 console.log('err: ' + err);
		     }
		     var dsp = {'title':'削除完了','scrhead':'del','comment':'JSON','tab':results};

		     /* return res.render('scr/scr201', post); */
		     showPart(req, res);

		 });
    

}

/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res){
    var file = './controller/data/str.json';
    var deffile = './controller/data/def201.json';

//    if (!libap.isSession(req.session)) {
    if (!lcsAp.isSession(req.session)) {
		res.redirect('/');
    }

    if (req.body['QRY'] == '最新表示') {
		showPart(req, res);
    } else if (req.body['ADD'] == '登録') {
		var posts = JSON.parse(require('fs').readFileSync(file));
		registPart(req, res, posts);
    } else if (req.body['DEL'] == '削除') {
		var posts = JSON.parse(require('fs').readFileSync(file));
		deletePart(req, res, posts);
    } else {
	var posts = JSON.parse(require('fs').readFileSync(deffile));
		showPart(req, res);
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