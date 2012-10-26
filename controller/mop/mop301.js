var fs = require('fs');

var fin = function(err){
    if (err) {
        res.redirect('scr/error');
        return;
    }
}

/**                                                                                                                                                          
 * show error message.                                                                                                                                       
 * @param {Object} args argument.                                                                                                                            
 * @param {Object} emsg contents of error.                                                                                                                   
 */
function shoError(args, emsg) {
    if (typeof emsg === 'object') {
        args.errors = emsg;
        args.post.mesg = emsg.text;
        args.res.render('scr/error', args.post);
    } else {
        var msgobj = lcsAp.getMsgI18N(emsg);
        args.errors = msgobj;
        args.post.mesg = msgobj.text;
        args.res.render('scr/error', args.post);
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

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render(posts.scrNo, posts);
    nextDo( null, args );
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
    args.posts.mesg = "";

    nextDo( null, args );
    return;
}

/**
 * ＊＊＊テーブルリストを取得する
 * @module postData
 * @param  {Object}args, {function}nextDo
 * @date   24/jul/2012
 */
function postData(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    var step = args.posts.step;

    /* *** デモ中 ***********************************************************
    var __file = "./ini/data/moptest002.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));    
    if( step=="3" || step=="4" ) {
        var xtab1 = [];
        for( var i=0, maxi=ddd.tab1.length; i<maxi; i++ ) {
            if( req.body.tab1_chk ) {
                if( typeof req.body.tab1_chk === "string" ) {
                    if( ddd.tab1[i].chk1.val == req.body.tab1_chk ) {
                        xtab1.push( ddd.tab1[i] );
                        xtab1[xtab1.length-1].chk1.on = "checked";
                    }
                } else {
                    for( var j=0,maxj=req.body.tab1_chk.length; j<maxj; j++ ) {
                        if( ddd.tab1[i].chk1.val == req.body.tab1_chk[j] ) {
                            xtab1.push( ddd.tab1[i] );
                            xtab1[xtab1.length-1].chk1.on = "checked";
                        }
                    }
                }
            }
        }
        if( xtab1.length ) {
            args.posts.table.tab1 = xtab1;
        }
    } else {
        for( var i=0, maxi=ddd.tab1.length; i<maxi; i++ ) {
            if( req.body.tab1_chk ) {
                if( typeof req.body.tab1_chk === "string" ) {
                    if( ddd.tab1[i].chk1.val == req.body.tab1_chk ) {
                        ddd.tab1[i].chk1.on = "checked";
                    }
                } else {
                    for( var j=0,maxj=req.body.tab1_chk.length; j<maxj; j++ ) {
                        if( ddd.tab1[i].chk1.val == req.body.tab1_chk[j] ) {
                            ddd.tab1[i].chk1.on = "checked";
                        }
                    }
                }
            }
        }

        args.posts.table.tab1 = ddd.tab1;
    }
    nextDo( null, args );
    ***********************************************************************/

    var sql = "",
        stock_rows = [];

    sql += "" +
        "select " +
        "    l.name as col1, i.item_code as col2, i.item_name as col3, s.id_stock col4, " +
        "    s.quantity as col5, DATE_FORMAT(s.initial_date,'%Y/%m/%d') as col6, s.remark as col7, " +
        "    case " +
        "    when exists(select * from t_rv_stock r where r.id_stock=s.id_stock) " +
        "    then '◎'"+
        "    else '' end as col8 " +
        "from t_stocks s, t_join j, m_locations l, m_users u, m_items i " +
        "where 1=1 " +
        "    and j.id_join = s.id_join " +
        "    and l.address = j.address and l.area = j.area " +
        "    and u.id_user = s.id_user " +
        "    and i.id_item = s.id_item ";

    if (req.body.txt3) {
        sql += " and s.id_user = '" + req.body.txt3 +"' ";
    } else if (req.body.sel1) {
        sql += " and s.id_user = '" + req.body.sel1 +"' ";
    }else{
        sql += " and s.id_user = '" + "' ";
    }
    sql += "order by l.address ";

    lcsDb.query(sql, function(err, results, fields) {
        if (err) {
            nextDo( 4, args );
            return;
        }
        stock_rows = results;
        for( var i=0, max=stock_rows.length; i<max; i++ ){
            stock_rows[i].chk1 = new Object();
            stock_rows[i].chk1.val = stock_rows[i].col4;
            stock_rows[i].chk1.exist = "1";
            if( req.body.tab1_chk ) {
                if( typeof req.body.tab1_chk === "string" ) {
                    if( stock_rows[i].chk1.val == req.body.tab1_chk ) {
                        stock_rows[i].chk1.on = "checked";
                    }
                } else {
                    for (var j=0, maxj=req.body.tab1_chk.length; j<maxj; j++ ) {
                        if( stock_rows[i].chk1.val == req.body.tab1_chk[j] ) {
                            stock_rows[i].chk1.on = "checked";
                            break;
                        }
                    }
                }
            }
        }
        args.posts.table.tab1 = stock_rows;
        nextDo( null, args );
    });

}

/**
 * ＊＊＊optionリストを取得する
 * @module optionsDsp
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
function optionsDsp(args, nextDo) {
    var req = args.req, res = args.res;

    var sql = "",
        ary = [];

    sql = 
        "select " +
        "  id_user as value, nickname as dsp, 'xxx' as selected " +
        "from m_users " +
        "where 1=1 " +
        "order by id_user ";
    ary = ['XXX'];

    lcsDb.query (sql, function (err, results, fields) {
        if (err){
            nextDo( 4, args );
            return;
        }
        args.posts.select.opt1 = results;
        for( var i=0, max=args.posts.select.opt1.length; ; i++ ) {
            if( i < max ) {
                args.posts.select.opt1[i].dsp = args.posts.select.opt1[i].value +
                    ":" + args.posts.select.opt1[i].dsp;
                if( req.body.sel1 ) {
                    if( req.body.sel1 == args.posts.select.opt1[i].value ) {
                        args.posts.select.opt1[i].selected = "selected";
                        args.posts.text.txt3 = args.posts.select.opt1[i].value;
                        args.posts.dsp.user = args.posts.select.opt1[i].dsp;
                        break;
                    }
                } else if( req.body.txt3 ) {
                    if( req.body.txt3 == args.posts.select.opt1[i].value ) {
                        args.posts.select.opt1[i].selected = "selected";                                                                                                             args.posts.text.txt3 = args.posts.select.opt1[i].value;
                        args.posts.dsp.user = args.posts.select.opt1[i].dsp;
                        break;
                    }
                } else {
                    if( 'hello' == args.posts.select.opt1[i].value ) {
                        args.posts.select.opt1[i].selected = "selected";                                                                                                             args.posts.text.txt3 = args.posts.select.opt1[i].value;
                        args.posts.dsp.user = args.posts.select.opt1[i].dsp;
                        break;
                    }
                }
            } else {
                break;
            }
        }
        nextDo( null, args );
    });

    /* *** デモ中 ***********************************************************
    var __file = "./ini/data/moptest001.json";
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    for( var i=0, max=ddd.opt1.length; ; i++ ) {
        if( i < max ) {
            if( req.body.sel1 ) {
                if( req.body.sel1 == ddd.opt1[i].value ) {
                    ddd.opt1[i].selected = "selected";
                    args.posts.text.txt3 = ddd.opt1[i].value;
                    args.posts.dsp.user = ddd.opt1[i].dsp.substr(7);
                    break;
                }
            } else {
                if( req.body.txt3 == ddd.opt1[i].value ) {
                    ddd.opt1[i].selected = "selected";
                    args.posts.text.txt3 = ddd.opt1[i].value;
                    args.posts.dsp.user = ddd.opt1[i].dsp.substr(7);
                    break;
                }
            }
        } else {
            ddd.opt1[0].selected = "selected";
            break;
        }
    }
    args.posts.select.opt1 = ddd.opt1;

    nextDo( null, args );
    ***********************************************************************/
}

/**
 * キャンセル 実行
 * @module delExe
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function delExe(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 出庫予約 実行
 * @module addExe
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addExe(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * キャンセル押下時の処理
 * @module delPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function delPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "4";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 出庫予約押下時の処理
 * @module addPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function addPB(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "3";

    lcsAp.series(args,
                 [setEcho,
                  optionsDsp,
                  postData,
                  dspWin], /* 後処理 */
                 fin);
}

/**
 * 表示押下時の処理
 * @module iqyPB
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function iqyPB(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "2";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
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

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};
    args.posts.step = "0";

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [setEcho,
                  optionsDsp,
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

    var ToF = {/* Table of function for each button */
        "GET": initSend,
        "POST":{
            "send_iqy" : iqyPB,
            "send_add" : addPB,
            "send_del" : delPB,
            "send_add_exe" : addExe,
            "send_del_exe" : delExe,
            "send_bak1" : initSend,
            "send_bak2" : iqyPB
        }
    };

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
    }

    for( var key1 in ToF ) {
        if( key1 === req.method ) {
            if( typeof ToF[key1] === "function" ) {
                ToF[key1]( req, res, posts );
                return;
            } else if( typeof ToF[key1] === "object" ) {
                for( var key2 in ToF[key1] ) {
                    if( req.body[key2] ) {
                        if( typeof ToF[key1][key2] === "function" ) {
                            ToF[key1][key2]( req, res, posts );
                            return;
                        }
                    }
                }
                /*規定外のボタンです*/
                //dspWin( 3, req, res, posts );
                res.redirect('/');
                return;
            }
        }
    }
    /*規定外のメソッドタイプです*/
    //dspWin( 2, req, res, posts );
    res.redirect('/');
    return;

}
