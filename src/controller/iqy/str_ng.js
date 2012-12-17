/* for screen */
var fs = require('fs');


/*
 * 25.mar.2012
 */
function showPart(rep, res, posts) {
    /*

    select CONCAT("tab[",GROUP_CONCAT(                                                                                              
         CONCAT("{pcode:'",pcode,"'"),
         CONCAT(",sqty:'",sqty,"'"),
         CONCAT(",lotn:'",lotn),"'}")
           ) ,"]"                                                                                                                           
         from part;

    */
    /*
    var sql = 'select CONCAT("tab[",GROUP_CONCAT('
	+ 'CONCAT("{pcode:'",pcode,"'"),'
	+ 'CONCAT(",sqty:'",sqty,"'"),'
	+ 'CONCAT(",lotn:'",lotn),"'}")'
	+ '  ) ,"]"'
	+ 'from part;';
    */
    var sql1 = 'select CONCAT(\"\"\"tab\"\":[\",GROUP_CONCAT('
	+ 'CONCAT(\"{\"\"pcode\"\":\'"\,pcode,\"\'\"),'
	+ 'CONCAT(\",\"\"sqty\"\":\'\",\"sqty\",\"\'\"),'
	+ 'CONCAT(\",\"\"lotn\"\":\'\",lotn),\"\'}\")'
	+ ') ,\"]\"'
	+ 'from part;';
    /*
        var sql = 'select CONCAT(\"tab\":[\",GROUP_CONCAT('
     + 'CONCAT(\"{\"pcode\":\'\",pcode,\"\'\"),'
     + 'CONCAT(\",\"sqty\":\'\",\"sqty\",\"\'\"),'
     + 'CONCAT(\",\"lotn\":\'\",lotn),\"\'}")'
     + ' ) ,\"]\"'
	+ 'from part;';
    */    
    var sql2 ='select * from part';
    client.query(sql2, function(err, results, fields) {
	    if (err){
		console.log('err: ' + err);
	    }
	    /*
	    results.scrhead = 'hehehe';
	    results.comment = 'wawa';
	    console.log('row0: '+results[0].pcode);
	    console.log('row1: '+results[1].pcode);
	    console.log('row2: '+results[2].pcode);
	    for (var k in results) {
		console.log('results :' + results[k]);
		for (var j in results[k]) {
		    console.log('results_obj :' + eval(String(results[k]+'.'+j)));
		}
	    }
	    for (var k in fields) {
		console.log('fields :' + k);
	    }

	    */
	    var posts = JSON.stringify(results);
	    var ary ={'scrhead':'HAHA','comment':'JSON','tab':posts};
	    /*	    console.log('posts: ',ary); */
	    var hai = {'scrhead':'HAHA','comment':'JSON','tab':results};
	    console.log('results=> ',results);
	    console.log('results[0].pcode=> ',results[0].pcode);
	    console.log('hai.dcrheade=> ',hai.scrhead);
	    console.log('hai.tab[0]=> ',hai.tab[0]);
	    console.log('hai.tab[0]=> ',hai.tab[0].pcode);
	    /*

	    console.log('posts=> ',posts);
	    console.log('posts[0].scrhead=>: ',posts[0].scrhead);
	    console.log('ary=> ',ary);
	    console.log('ary.tab=> ',ary.tab);
	    console.log('ary.tab[0].pcode=> ',ary.tab[0].pcode);
	    */

	    res.render('scr/scr201', hai);
	});
};

/*
 * main routine
 * date 22.mar.2012
 */
exports.main = function(req, res){
    var file = './controller/data/str.json';
    var deffile = './controller/data/def201.json';
    if (req.body['query1'] == 'Query') {
	var posts = JSON.parse(require('fs').readFileSync(file));
	showPart(req, res, posts);
    } else if (req.body['update'] == 'UPDATE') {
	var posts = JSON.parse(require('fs').readFileSync(file));
	res.render('scr/scr201', posts);
    } else {
	var posts = JSON.parse(require('fs').readFileSync(deffile));
	res.render('scr/scr201', posts);
    }
};

/*
  showPart(req, req) {
  var sql2 = 'select ...';
  client.query(sql2, function(err, results, fields) {
  var sql3 = 'select ...'
  client.query(sql3, function(err, result, fields) {
  res.render('scr/scr201', posts);
  });
  });
  };

*/

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