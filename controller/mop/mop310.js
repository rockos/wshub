var fs = require('fs');

var fin = function(err){
    if (err) {
        return;
    }
}


/**
 * 画面表示
 * @module dspwin
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //Login user用
    posts.userid = (req.session.userid)?req.session.userid:'undefined';

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render(posts.scrNo, posts);
}

/**
 *   inserted Ordr
 */
function insOrdr( adt, callback ) {

    var sql = "",
        ary = [],
        str = [],
        pcode = "",
        area = "X01",
        area_name = "トランクルーム",
        sqty = 0,
        mem1 = "備考",
        mem2 = "",
        mem3 = "",
        mem4 = "",
        mem5 = adt.udat;

    debugger;
    str = adt.part_grp[0].split(',');
    pcode = str[0];
    sqty = adt.part_grp.length;

    ary = [adt.key_ordr,
           pcode,
           area,
           area_name,
           sqty,
           mem1,
           mem2,
           mem3,
           mem4,
           mem5];

    sql = 
        "insert into ordr( "+
        "ordr,lotn,area,area_name, "+
        "sqty,mem1,mem2,mem3, "+
        "mem4,mem5,stat "+
        ") values ("+
        "?, ?, ?, ?, "+
        "?, ?, ?, ?, "+
        "?, ?, '1' ) ";
    lcsDb.cmnd(sql, ary, adt, callback );
}
/**
 *   inserted Cary
 */
function insCary( adt, callback ) {

    var sql = "",
        ary = [],
        str = [],
        seq = adt.cary_seq+1,
        mem4 = 298,
        mem5 = adt.udat;

    debugger;
    if( !adt.part_grp[adt.cary_seq] ) {
        callback(null,adt);
        return;
    }
    str = adt.part_grp[adt.cary_seq].split(',');
    adt.cary_seq++;

    ary = [adt.key_ordr,
           seq,
           mem4,
           mem5,
           str[0],
           str[1],
           str[2]];

    sql = 
        "insert into cary( "+
        "  ordr, cary_seqn, part, part_name, "+
        "  locn, locn_name, sqty,mem1, "+
        "  mem2, mem3, mem4, mem5 "+
        ") "+
        "select "+
        "  ?, ?, lotn, lotn, "+
        "  pnam, pnam, sqty, mem1, "+
        "  mem2, mem3, ?, ? "+
        "from part "+
        "where 1=1 "+
        "  and pcode = ? "+
        "  and pnam = ? "+
        "  and lotn = ? ";
    lcsDb.cmnd(sql, ary, adt, callback );
}
/**
 *   deleted Part
 */
function delPart( adt, callback ) {

    var sql = "",
        ary = [],
        str = [];

    if( !adt.part_grp[adt.part_seq] ) {
        callback(null,adt);
        return;
    }
    str = adt.part_grp[adt.part_seq].split(',');
    adt.part_seq++;

    ary = [str[0],
           str[1],
           str[2]];

    sql =
        "delete from part "+
        "where 1=1 "+
        "  and pcode = ? "+
        "  and pnam = ? "+
        "  and lotn = ? ";
    lcsDb.cmnd(sql, ary, adt, callback );
}

/**
 * 出庫開始 実行
 * @module execStartordr
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function execStartordr(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var audit = {},
        upfuncs = [],
        d = new Date,
        month;

    if( posts.err_code ) {
        args.posts.mesg = 'チェックアウト開始エラー';
        args.posts.mesg_level_color = 'operationPanel_warning';
        callback( null, args );
        return ;
    }

    month = d.getMonth()+1;

    /* set audit data */
    audit.usrid = (req.session.userid)?req.session.userid:'undefined';
    audit.oper = 'START';
    audit.udat = d.getFullYear()+'/'+month+'/'+d.getDate()+ ' '+
                  d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    audit.key_ordr = posts.key_ordr;
    audit.cary_seq = 0;
    audit.part_seq = 0;
    debugger;
    if( typeof req.body.partchk==='string' ) {
        audit.part_grp = new Array(req.body.partchk);
    }else{
        audit.part_grp = req.body.partchk;
    }
    upfuncs[0] = insOrdr;
    for( var i=0, max=audit.part_grp.length; i<max; i++ ) {
        upfuncs.push(insCary);
    }
    for( var i=0, max=audit.part_grp.length; i<max; i++ ) {
        upfuncs.push(delPart);
    }

    /* update */
    lcsDb.update(upfuncs, audit, function(err){
            if( err ) {
                callback( err, args );
                return;
            }else{
                args.posts.new_ordr = audit.key_ordr;
                callback( null, args );
                return;
            }
        });
}

/**
 * 出庫開始チェック
 * @module checkStartordr
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   26/jun/2012
 */
function checkStartordr(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var sql = "",
        ary = [],
        d = new Date,
        key_ordr = "",
        month;

    if( !req.body.partchk ) {
        // 選択無し
        args.posts.err_code = 101;
        callback( null, args );
        return;
    }
    if( !req.body.partchk.length ) {
        // 選択無し
        args.posts.err_code = 101;
        callback( null, args );
        return;
    }

    month = d.getMonth()+1;

    key_ordr =
        lcsAp.zpadNum(d.getFullYear(),4) +"/" + 
        lcsAp.zpadNum(month,2) +"/"+ 
        lcsAp.zpadNum(d.getDate(),2) +" ";

    sql = "select max(ordr) as maxordr from ordr where ordr like '" + 
        key_ordr +
        "%' ";
    lcsDb.query(sql, function(err, results, fields) {
            if (err){
                callback( 4, args );
                return;
            }
            if( !results.length || results[0].maxordr==null ) {
                key_ordr += "#"+lcsAp.zpadNum(1,4);
            }else{
                key_ordr += "#"+ lcsAp.zpadNum(parseInt( results[0].maxordr.slice(-4), 10 )+1,4);
            }
            args.posts.key_ordr = key_ordr;
            callback( null, args );
        });
}

/**
 * 画面表示
 * @module setEcho
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function setEcho(args, nextDo) {
    var req = args.req, res = args.res;

    // information bar へ出力
    args.posts.mesg = 'ここは警告表示行';

    // text object へ出力
    if( req.body.txt1 ) {
        args.posts.text.txt1 = req.body.txt1;
    } else {
        args.posts.text.txt1 = '';
    }
    if( req.body.txt2 ) {
        args.posts.text.txt2 = req.body.txt2;
    } else {
        args.posts.text.txt2 = '';
    }
    if( req.body.txt3 ) {
        args.posts.text.txt3 = req.body.txt3;
    } else {
        args.posts.text.txt3 = '';
    }
    if( req.body.txt4 ) {
        args.posts.text.txt4 = req.body.txt4;
    } else {
        args.posts.text.txt4 = '';
    }
    if( req.body.txt5 ) {
        args.posts.text.txt5 = req.body.txt5;
    } else {
        args.posts.text.txt5 = '';
    }
    if( req.body.txt6 ) {
        args.posts.text.txt6 = req.body.txt6;
    } else {
        args.posts.text.txt6 = '';
    }
    if( req.body.txt7 ) {
        args.posts.text.txt7 = req.body.txt7;
    } else {
        args.posts.text.txt7 = '';
    }
    if( req.body.txt8 ) {
        args.posts.text.txt8 = req.body.txt8;
    } else {
        args.posts.text.txt8 = '';
    }

    //check box へ出力
    //args.req.body.chk1 = ['c1','c2'];
    //if( req.body.chk1 ) {
    //    for( var i=0 ; i<req.body.chk1.length ; i++ ) {
    //        if(req.body.chk1[i]){
    //            args.posts.checkbox.chk1[req.body.chk1[i]] = "checked";
    //        }
    //    }
    //}

    nextDo( null, args );
    return;
}

/**
 * テーブルリストを取得する
 * @module postData
 * @param  {Object}args, {function}nextDo
 * @date   24/jul/2012
 */
function postData(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest005.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    if( args.posts.step=="2" ) {
        var ddd2 = {"tab1":[]};
        ddd2.tab1.push(ddd.tab1[0]);
        args.posts.table.tab1 = ddd2.tab1;

        args.posts.mod.text.txt1 = ddd.tab1[0].col1.substr(0,2);
        args.posts.mod.text.txt2 = ddd.tab1[0].col1.substr(3,2);
        args.posts.mod.text.txt3 = ddd.tab1[0].col1.substr(6,2);

        args.posts.mod.text.txt4 = ddd.tab1[0].col6;
        args.posts.mod.text.txt5 = ddd.tab1[0].col7;
        args.posts.mod.text.txt6 = ddd.tab1[0].col8.substr(0,4)+ddd.tab1[0].col8.substr(5,2)+ddd.tab1[0].col8.substr(8,2);
        args.posts.mod.text.txt7 = ddd.tab1[0].col9;
    } else {
        args.posts.table.tab1 = ddd.tab1;
    }
    nextDo( null, args );
    //***********************************************************************

    /*
    var sql = "",
        part_rows = [];

    sql += "" +
        "select " +
        "    pcode as col1, sqty as col2, pnam as col3, lotn col4, " +
        "    IFNULL(mem1,'') as col5, IFNULL(mem2,'') as col6, IFNULL(mem3,'') as col7 " +
        "from part " +
        "where 1=1 ";
    if( req.body.txt1 ) {
        sql += " and pcode = '" + req.body.txt1 +"' ";
    }else{
        sql += " and pcode = '" + "' ";
    }
    sql += "order by pcode ";

    lcsDb.query(sql, function(err, results, fields) {
        if (err){
            nextDo( 4, args );
            return;
        }
        part_rows = results;
        for( var i=0, max=part_rows.length; i<max; i++ ){
            part_rows[i].chk1.value = part_rows[i].col1;
            part_rows[i].chk1.exist = "1";
            part_rows[i].chk1.on = "checked";
        }
        args.posts.table.tab1 = part_rows;
        nextDo( null, args );
    });
    */
}

/**
 * optionリストを取得する
 * @module ***
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
function optionsDsp_m1(args, nextDo) {
    var req = args.req, res = args.res;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest001.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    ddd.opt1[6].selected = "selected";
    args.posts.mod.select.opt1 = ddd.opt1; 
    nextDo( null, args );
    //***********************************************************************
}

/**
 * optionリストを取得する
 * @module ***
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
function optionsDsp_m2(args, nextDo) {
    var req = args.req, res = args.res;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest006.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    args.posts.mod.select.opt2 = ddd.opt2; 
    nextDo( null, args );
    //***********************************************************************
}
/**
 * optionリストを取得する
 * @module optionsDsp
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
function optionsDsp(args, nextDo) {
    var req = args.req, res = args.res;

    //**** デモ中 ***********************************************************
    var __file = "./ini/data/moptest001.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    args.posts.select.opt1 = ddd.opt1; 
    nextDo( null, args );
    //***********************************************************************

    /*
    var sql = "",
        ary = [];

    sql = 
        "select " +
        "  pcode as value, pcode as disp, if(pcode=?,'selected','xxx') as selected " +
        "from part " +
        "where 1=1 " +
        "group by pcode " +
        "order by pcode ";
    if(req.body.txt1) {
        ary = [req.body.txt1];
    }else{
        ary = ['XXX'];
    }

    lcsDb.query(sql, ary, function(err, results, fields) {
        if (err){
            nextDo( 4, args );
            return;
        }
        args.posts.select.opt1 = results;
        nextDo( null, args );
    });
    */
}

/**
 * 出庫開始押下時の処理
 * @module addPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * * * * 押下時の処理
 * @module exePB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function exePB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step="1";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}
/**
 * * * * 押下時の処理
 * @module modPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function modPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step="2";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  optionsDsp_m1,
                  optionsDsp_m2,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * * * * 押下時の処理
 * @module prnPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function prnPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.scrNo="scr/scr751";

    lcsAp.series(args,
                 [postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 最新表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function iqyPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step="1";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function initSend(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 供給画面/main routine
 * @module mop.main
 * @param  {Object}req, {Object}res
 * @date   21/jun/2012
 */
exports.main = function(req, res, frame){

    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" );
        res.redirect('/');
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
        return;
    }

    if( req.method=="GET" ) {
        /*GET メソッド*/
        initSend( req, res, posts );
    }else if( req.method=="POST" ){
        /*POST メソッド*/
        if ( req.body.send_iqy ) {
            iqyPB(req, res, posts);
        } else if ( req.body.send_mod ) {
            modPB( req, res, posts);
        } else if ( req.body.send_exe ) {
            exePB( req, res, posts);
        } else if ( req.body.send_prn ) {
            prnPB( req, res, posts);
        //} else if ( req.body.send_add ) {
        //    addPB( req, res, posts);
        //} else if ( req.body.send_del ) {
        //    delPB(req, res, posts);
        } else {
            /*規定外のボタンです*/
            //dspWin( 3, req, res, posts );
            res.redirect('/');
        }
    }else{
        /*規定外のメソッドタイプです*/
        //dspWin( 2, req, res, posts );
        res.redirect('/');
    }

};
