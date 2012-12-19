var app;
var rootDir = "/home/locos/demo/somali";

var lcsAp = require('../lib/ap/lcsap').create('test-dosync', rootDir, app);

var aaa = function(args, callback) {
    args.posts.test.push("正常なら問題ない");
    lcsAp.doSync(args,
                 [
                  sub1,
                  sub2,
                  sub3
                  ],
                 callback );
};

var bbb = function(args2, callback) {
    args2.posts.test.push("上手くいかない例");
    lcsAp.doSync(args2,
                 [
                  sub1,
                  sub2_err,
                  sub3
                  ],
                 callback );
};

var ccc = function(args3, callback) {
    args3.posts.test.push("苦肉の策");
    lcsAp.doSync(args3,
                 [
                  sub1,
                  sub2_err,
                  sub3
                  ],
                 callback );
};


var main = function() {
    var sync_pool = [];
    var args = {"req": "req-test", "res": "res-test", "posts": {}};
    var args2 = {"req": "req-test", "res": "res-test", "posts": {}};
    var args3 = {"req": "req-test", "res": "res-test", "posts": {}};
    args.posts.test = [];
    args2.posts.test = [];
    args3.posts.test = [];

    lcsAp.initSync(sync_pool);
    /* 正常なら問題ない */
    lcsAp.doSync(args,
                 [
                  aaa,
                  bbb,
                  ccc
                  ],
                 fin );



    /*
    lcsAp.initSync(sync_pool);
    setTimeout( function() {
            /* 正常なら問題ない 
            args.posts.test.push("正常なら問題ない");
            lcsAp.doSync(args,
                         [
                          sub1,
                          sub2,
                          sub3
                          ],
                         fin );
        }, 500);


    setTimeout( function() {
            args2.posts.test = [];
            /* 上手くいかない例 
            args2.posts.test.push("上手くいかない例");
            lcsAp.doSync(args2,
                         [
                          sub1,
                          sub2_err,
                          sub3
                          ],
                         fin );
        }, 5000);

    setTimeout( function() {
            args3.posts.test = [];
            /* 苦肉の策 
            args3.posts.test.push("苦肉の策");
            lcsAp.doSync(args3,
                         [
                          sub1,
                          sub2_err,
                          sub3
                          ],
                         function(err) {
                             fin(err, args3);
                         });
        }, 10000);
    */
};

var sub1 = function(args, callback) {
    args.posts.test.push("sub1");
    console.log("sub1:"+args.posts.test.join());
    callback(null, args);
};

var sub2 = function(args, callback) {
    args.posts.test.push("sub2");
    console.log("sub2:"+args.posts.test.join());
    callback(null, args);
};

var sub2_err = function(args, callback) {
    args.posts.test.push("sub2-error");
    console.log("sub2:"+args.posts.test.join());
    callback(args); /*Error*/
};

var sub3 = function(args, callback) {
    args.posts.test.push("sub3");
    console.log("sub3:"+args.posts.test.join());
    callback(null, args);
};
    
var fin = function(err, args) {
    if (err) {
        args = err;
    }
    try {
        args.posts.test.push("fin");
        console.log("fin:"+args.posts.test.join());
    }catch(e) {
        console.log(e);
    }
};

main();


