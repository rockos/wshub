'use strict';
/* common file include */

/* local file */

/*
 * 後処理関数
 */
function postData(args, nextExec) {

    var sql ='select * from part order by pcode';
    var results, fields;

    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                lcsAp.log('err: ' + err);
            };

            args.post.title = 'check in';
            args.post.tab = results;

            for( var i=0,max=args.post.tab.length; i<max; i++ ) {
                args.post.tab[i].radiodata = 
                    args.post.tab[i].pcode + "," +
                    args.post.tab[i].sqty + "," +
                    args.post.tab[i].pnam + "," +
                    args.post.tab[i].lotn + "," +
                    args.post.tab[i].mem1 + "," +
                    args.post.tab[i].mem2 + "," +
                    args.post.tab[i].mem3;
            }


            //            args.post.userid = args.req.session.userid;

            if (!err) err = 0;

            var msg = lcsAp.getMsgI18N(String(err));
            args.post.mesg = msg.text;
            args.post.mesg_lavel_color = msg.warn;

            /*
            [args.post.mesg, args.post.mesg_lavel_color] = lcsAp.getMsgI18N(String(err));
            */
            nextExec( null, args);

            return;
        });

};
/**
 *
 */
function shoError(args, emsg) {
    args.post.mesg = emsg.text;
    args.res.render('scr/error', args.post);
};

var validCheck = {
    err : 0,

    checkParams : function (args ,/* next function */ callback) {
        var rtn = lcsUI.checkVal(args.req, ['pcode', 'pnam', 'sqty', 'lotn']);
        if (rtn) {
            lcsUI.shoError(args, rtn);
            return callback(rtn, args, callback);
        }
        
        /* sanitize */
        args.req.sanitize('sqty').toInt(); 
        
        /* normal complete */
        return callback(0, args, callback);        
        
    },
    checkParams_del : function (args ,/* next function */ callback) {
        var rtn = lcsUI.checkVal(args.req, ['pcode']);
        if (rtn) {
            shoError(args, rtn);
            return callback(rtn, args, callback);
        }
        
        /* normal complete */
        return callback(0, args, callback);        
        
    },
    filter : function (args ,/* next function */ callback) {
        /* sanitize */
        //        args.req.sanitize('sqty').toInt(); 
        
        /* normal complete */
        return callback(0, args, callback);        
        
    },
    checkDb : function (args ,callback) {

        args.post.userid = (args.req.session.userid) ? args.req.session.userid:'undefined';
        var err = 0, errtext = [];
        var results, fields;

        var sql ='select * from part where pcode=?';

        lcsDb.query(sql, [args.req.body['pcode']],function(err, results, fields) {
                if (err){
                    shoError(args, '99'); /* db error */
                    callback( err, args, callback);
                    return;
                };
                callback(0, args, callback);

                return;
            });
        return;
    }
};
/* empty function */
var finParse = function(err){
    if (err) {
        return;
    }
}
/* empty function */
var fin = function(err){
    if (err) {
        return;
    }
}
/**
 * show initial data of scr601
 * @date 24.aug.2013
 * @param req
 * @param res
 * @param frame
 */
function _show601(req, res, frame){
    var posts = {};
    var args = {};
    var file = ROOTDIR + '/src/ini/data/mgr601ini.json';
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    args.res = res;
    args.post = posts;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

    if (!lcsAp.isSession(req.session)) {
        return lcsUI.shoError(args, '90'); /* not signin */

    }
    
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 


    res.render("scr/scr601", posts);
};
/**
 * show initial data of scr651
 * @date 27.aug.2013
 * @param req
 * @param res
 * @param frame
 */
function _show630(req, res, frame){
    var posts = {};
    var args = {};
    var file = ROOTDIR + '/src/ini/data/mgr630ini.json';
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    args.res = res;
    args.post = posts;
    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

   /* 
    if (!lcsAp.isSession(req.session)) {
        return lcsUI.shoError(args, '90');
    }
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 
   */

    res.render("scr/scr630", posts);
};
/**
 * show initial data of scr651
 * @date 24.aug.2013
 * @param req
 * @param res
 * @param frame
 */
function _show651(req, res, frame){
    var posts = {};
    var args = {};
    var file = ROOTDIR + '/src/ini/data/mgr651ini.json';
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    args.res = res;
    args.post = posts;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

    if (!lcsAp.isSession(req.session)) {
        return lcsUI.shoError(args, '90'); /* not signin */
    }
    
    posts.pageNavi = JSON.parse(require('fs').readFileSync(file));
    posts.pageNavi.userid = req.session.userid ? req.session.userid: 'undefined'; 


    res.render("scr/scr651", posts);
};
/**
 * Send e-mail via AWS SES 
 * @date 27.aug.2013
 * @param req
 * @param res
 * @param frame
 */
function _sendMail(req, res, frame) {
    var posts = {};
    var args = {};
    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    args.res = res;
    args.post = posts;

    /* page情報設定 */
    posts.frameNavi = frame.frameNavi;

/*
    if (!lcsAp.isSession(req.session)) {
        return lcsUI.shoError(args, '90');
    }
    */
    
    var AWS = require('aws-sdk');
    AWS.config.loadFromPath(ROOTDIR + '/etc/conf/credentials.json');
    var emsg = {};
    var text = req.body.id_text;
    var ses = new AWS.SES({sslEnabled: true});
    var params = {
        Source: 'sin0414@gmail.com',
        Destination: {
            ToAddresses: ['sin0414@gmail.com'],
        },
        Message: {
            Subject: {
                Data: '【Feedback】'
            },
            Body: {
                Text: {
                    Data: text,
                    Charset:'UTF-8'
                }
            }
        }
    };

    ses.client.sendEmail(params, function (err, data) {
        if (err) {
            emsg.text = err.name + ':' + err.message;
            return lcsUI.shoError(args,emsg) ; 
            /* return lcsUI.shoError(args, '6'); */
        } else {
            return lcsUI.shoError(args, '5'); /* complete to send email */
        }
    });


};


/**
 * Main routine of profile editor
 * date 26.sep.2012 first edition.
 *
 */
exports.main = function(req, res, frame){
    var url = require('url')
    
    var get_tof = {/* Table of function for each button */
        "/scr/601" : _show601,
        "/scr/630" : _show630,
        "/scr/651" : _show651
    };
    var tof = {/* Table of function for each button */
        "620_mail" : _sendMail
    };
   var param = {};
   if (req.method == 'GET') {
      param =  url.parse(req.url, true)
      if (typeof get_tof[param.pathname] === 'function') {
         get_tof[param.pathname](req, res, frame);
         return;
      } else {
          shoError(args, '99'); /* db error */
          return;
      }
   } else {
       for (var key in tof) {
           if (req.body[key]) {
               if (typeof tof[key] === "function") {
                   tof[key](req, res, frame);
                   return;
               }
           }
       }
   }
    _show601(req, res, frame);

};
