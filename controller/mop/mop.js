var fs = require('fs');


/**
 * 画面表示
 * @module dspwin
 * @param  {number}err, {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jun/2012
 */
function dspWin(err, args) {
    var req = args.req, res = args.res, posts = args.posts;

    //Login user用
    posts.userid = (req.session.userid)?req.session.userid:'undefined';

    if( err ){
        lcsAp.log('winDsp error : '+err);
        switch(err){
        case 2:
            /*規定外のメソッドタイプです*/
            posts.mesg = '規定外のメソッドタイプです';
            posts.mesg_level_color = 'operationPanel_fatal';
            break;
        case 3:
            /*規定外のボタンです*/
            posts.mesg = '規定外のボタンです';
            posts.mesg_level_color = 'operationPanel_fatal';
            break;
        case 4:
            /*DB Error*/
            posts.mesg = 'データベースエラー';
            posts.mesg_level_color = 'operationPanel_fatal';
            break;
        default:
            posts.mesg = 'その他エラー';
            posts.mesg_level_color = 'operationPanel_warning';
        }

        var msg = lcsAp.getMsgI18N("0");
        posts.mesg = msg.text;
        posts.mesg_lavel_color = msg.warn;

        res.render(posts.scrNo, posts);
        return;
    }

    var msg = lcsAp.getMsgI18N("0");
    posts.mesg = msg.text;
    posts.mesg_lavel_color = msg.warn;
    res.render(posts.scrNo, posts);
}

/**
 * Ground へ "CARY" データ送信
 * @module sendGroundcary
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   26/jun/2012
 */
function sendGroundcary(args, callback) {
    callback( null, args );
    return;

    /*
    var req = args.req, res = args.res, posts = args.posts;

    var sql = "",
        ary = [],
        key_ordr = "",
        cary_data = {},
        _dir = "/home/locos/demo/birman/var/log/",
        file = "cary",
        fd,
        d,
        line = "";

    key_ordr = req.body.rad01;

    sql = "select * from cary where ordr=? order by ordr,cary_seqn ";
    ary = [key_ordr];
    lcsDb.query(sql, ary, function(err, results, fields) {
        if (err){
            lcsAp.log( err );
            callback( 4, args );
            return;
        }
        d = new Date;
        file += d.getFullYear()+d.getMonth()+d.getDate()+
                d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds()+
            ".csv";
        fd = fs.openSync(_dir+file, 'a');
        for( var i=0,max=results.length; i<max; i++ ) {
            line = results[i].ordr + "," +
                   results[i].cary_seqn + "," +
                   results[i].part + "," +
                   results[i].locn + "," +
                   results[i].sqty + "," +
                   "\n";
            fs.writeSync(fd, line, line.length, 'utf-8');
        }
        fs.closeSync(fd);
        callback( null, args );
    });
    */
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

    ///*本当はPART消すのですがデモのため消さないようにする*/
    //callback(null,adt);
    //return;

    //debugger;
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
 * 出庫開始 実行
 * (´д｀)＜不採用になりました
 * @module execStartordr
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   26/jun/2012
 */
function execStartordr_ng(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var key_ordr = "",
        updata = {},
        upfuncs = [],
        d = new Date,
        month;

    month = d.getMonth()+1;
    key_ordr = req.body.rad01;

    if( posts.err_code ) {
        args.posts.mesg = '出庫開始エラー';
        args.posts.mesg_level_color = 'operationPanel_warning';
        callback( null, args );
        return ;
    }

    /* set audit data */
    updata.usrid = (req.session.userid)?req.session.userid:'undefined';
    updata.oper = 'START';
    updata.udat = d.getFullYear()+'/'+month+'/'+d.getDate()+ ' '+
                  d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    updata.key_ordr = key_ordr;
    upfuncs[0] = modOrdr;

    /* update */
    lcsDb.update(upfuncs, updata, function(err){
            if( err ) {
                callback( err, args );
                return;
            }else{
                callback( null, args );
                return;
            }
        });
}

/**
 * 出庫開始チェック
 * (´д｀)＜不採用になりました
 * @module checkStartordr
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   26/jun/2012
 */
function checkStartordr_ng(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var sql = "",
        ary = [],
        key_ordr = "";

    // 開始済み確認
    if( !req.body.rad01 ) {
        // ラジオ選択無し
        args.posts.err_code = 101;
        callback( null, args );
        return;
    }
    key_ordr = req.body.rad01;
    if( !key_ordr.length ) {
        // ラジオ選択無し
        args.posts.err_code = 101;
        callback( null, args );
        return;
    }

    sql = "select ordr, stat from ordr where ordr=? ";
    ary = [key_ordr];
    lcsDb.query(sql, ary, function(err, results, fields) {
        if (err){
            lcsAp.log( err );
            callback( 4, args );
            return;
        }
        if( !results.length ) {
            // Ordr データ無し
            args.posts.err_code = 102;
            callback( null, args );
            return;
        } else {
            if( results[0].stat !== "0" ) {
                // 既に開始済み
                args.posts.err_code = 103;
                callback( null, args );
                return;
            } 
        }
        callback( null, args );
    });
}

/**
 * "CARY"テーブルリストを取得する
 * @module dataCary
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   25/jun/2012
 */
function dataCary(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var sql = "",
        cary_rows = [],
        ordr_key = posts.tables2_head.ordr;

    if( !ordr_key || !ordr_key.length ) {
        callback( null, args );
        return;
    }

    sql += "" +
        "select " +
        "    ordr, cary_seqn, part, part_name, locn, locn_name, sqty, " +
        "    IFNULL(mem1,'') as mem1, IFNULL(mem2,'') as mem2, IFNULL(mem3,'') as mem3, " +
        "    IFNULL(mem4,'') as mem4, IFNULL(mem5,'') as mem5 " +
        "from cary " +
        "where 1=1 ";
    sql += " and ordr = '" + ordr_key + "' ";
    sql += "order by ordr,cary_seqn ";

    lcsDb.query(sql, function(err, results, fields) {
        if (err){
            console.log('Query Error : ');
            console.log( err );
            callback( 4, args );
            return;
        }
        cary_rows = results;
        args.posts.tables2 = cary_rows;
        callback( null, args );
    });
}

/**
 * "ORDR"テーブルリストを取得する
 * @module dataOrdr
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jun/2012
 */
function dataOrdr(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var sql = "",
        ordr_rows = [],
        d = new Date,
        month,
        key_ordr;

    month = d.getMonth()+1;

    key_ordr =
        lcsAp.zpadNum(d.getFullYear(),4) +"/" +
        lcsAp.zpadNum(month,2) +"/"+
        lcsAp.zpadNum(d.getDate(),2) +" ";

    sql += "" +
        "select " +
        "    ordr, lotn, area, area_name, sqty, " +
        "    IFNULL(mem1,'') as mem1, IFNULL(mem2,'') as mem2, IFNULL(mem3,'') as mem3, " +
        "    IFNULL(mem4,'') as mem4, IFNULL(mem5,'') as mem5, " +
        "    stat, " +
        "    case when stat='0' then '未' when stat='9' then '完了' else '開始' end as stat_str " +
        "from ordr " +
        "where 1=1 ";

    sql += " and ordr like '" + key_ordr + "%' ";

    if( req.body.ordr && req.body.ordr.length ) {
        sql += " and ordr like '" + req.body.ordr + "%' ";
    }
    if( req.body.lotn && req.body.lotn.length ) {
        sql += " and lotn like '" + req.body.lotn + "%' ";
    }
    if( req.body.area && req.body.area.length ) {
        sql += " and area like '" + req.body.area + "' ";
    }
    if( req.body.chk1 ) {
        for( var i=0, max=req.body.chk1.length; i<max ; i++ ){
            if( i===0 ) sql += " and ( ";
            else        sql += " or ";
            switch( req.body.chk1[i] ){
            case '1':
                sql += " stat='0' ";
                break;
            case '2':
                sql += " (stat>='1' and stat<='8') ";
                break;
            case '3':
                sql += " stat='9' ";
                break;
            }
        }
        sql += " ) ";
    } else {
        sql += " and 1=2 ";
    }
    sql += "order by ordr ";

    lcsDb.query(sql, function(err, results, fields) {
        if (err){
            console.log('Query Error : ');
            console.log( err );
            callback( 4, args );
            return;
        }
        ordr_rows = results;
        for( var i=0, max=ordr_rows.length; i<max; i++ ){
            ordr_rows[i].radio = "1";
            if( posts.new_ordr ) {
                if( ordr_rows[i].ordr==posts.new_ordr ) {
                    ordr_rows[i].radio_checked = "checked";
                    args.posts.tables2_head.ordr = ordr_rows[i].ordr;
                    args.posts.tables2_head.start = ordr_rows[i].mem5;
                }
            }else if( req.body.rad01 ) {
                if( ordr_rows[i].ordr==req.body.rad01 ) {
                    ordr_rows[i].radio_checked = "checked";
                    args.posts.tables2_head.ordr = ordr_rows[i].ordr;
                    args.posts.tables2_head.start = ordr_rows[i].mem5;
                }
            }else{
                if( i==0 ) {
                    ordr_rows[i].radio_checked = "checked";
                    args.posts.tables2_head.ordr = ordr_rows[i].ordr;
                    args.posts.tables2_head.start = ordr_rows[i].mem5;
                }
            }
        }
        args.posts.tables = ordr_rows;
        callback( null, args );
    });
}

/**
 * "PART"テーブルリストを取得する
 * @module dataPart
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function dataPart(args, callback) {
    var req = args.req, res = args.res, posts = args.posts;

    var sql = "",
        part_rows = [];

    sql += "" +
        "select " +
        "    pcode, sqty, pnam, lotn, " +
        "    IFNULL(mem1,'') as mem1, IFNULL(mem2,'') as mem2, IFNULL(mem3,'') as mem3 " +
        "from part " +
        "where 1=1 ";
    if( req.body.pcode ) {
        sql += " and pcode = '" + req.body.pcode +"' ";
    }else{
        sql += " and pcode = '" + "' ";
    }
    sql += "order by pcode ";

    lcsDb.query(sql, function(err, results, fields) {
        if (err){
            callback( 4, args );
            return;
        }
        part_rows = results;
        for( var i=0, max=part_rows.length; i<max; i++ ){
            part_rows[i].partkeys = part_rows[i].pcode + "," + part_rows[i].pnam + "," + part_rows[i].lotn;
            part_rows[i].checkbox = "1";
            part_rows[i].chk_checked = "checked";
        }
        args.posts.tabpart = part_rows;
        callback( null, args );
    });
}

/**
 * "AREA"optionリストを取得する
 * @module optionsArea
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jun/2012
 */
//function optionsArea(req, res, posts, callback) {
function optionsArea(args, callback) {
    var req = args.req, res = args.res;

    var sql = "",
        ary = [];

    sql = 
        "select " +
        "  area, area_name, if(area=?,'selected','xxx') as selected " +
        "from ordr " +
        "where 1=1 " +
        "group by area, area_name " +
        "order by area, area_name ";
    if(req.body.area) {
        ary = [req.body.area];
    }else{
        ary = ['XXX'];
    }

    lcsDb.query(sql, ary, function(err, results, fields) {
        if (err){
            lcsAp.log( err );
            callback( 4, args );
            return;
        }
        args.posts.options = results;
        callback( null, args );
    });
}

/**
 * "PART"optionリストを取得する
 * @module optionsPArt
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   23/jul/2012
 */
//function optionsPart(req, res, posts, callback) {
function optionsPart(args, callback) {
    var req = args.req, res = args.res;

    var sql = "",
        ary = [];

    sql = 
        "select " +
        "  pcode, pcode as pcode_name, if(pcode=?,'selected','xxx') as selected " +
        "from part " +
        "where 1=1 " +
        "group by pcode " +
        "order by pcode ";
    if(req.body.pcode) {
        ary = [req.body.pcode];
    }else{
        ary = ['XXX'];
    }

    lcsDb.query(sql, ary, function(err, results, fields) {
        if (err){
            lcsAp.log( err );
            callback( 4, args );
            return;
        }
        args.posts.options2 = results;
        callback( null, args );
    });
}

/**
 * 出庫開始押下時の処理
 * @module startOrdr
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   26/jun/2012
 */
function startOrdr(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};

    // information bar へ出力
    posts.mesg = 'ここは警告表示行';

    // text object へ出力
    posts.text.ordr = req.body.ordr;
    posts.text.lotn = req.body.lotn;

    //check box へ出力
    if( req.body.chk1 ) {
        for( var i=0 ; i<req.body.chk1.length ; i++ ) {
            if(req.body.chk1[i]){
                posts.checkbox.chk1[req.body.chk1[i]] = "checked";
            }
        }
    }

    posts.dspcstm["corp"] = "hidden";
    posts.dspcstm["priv"] = "hidden";
    posts.dspcstm["vist"] = "hidden";
    switch( req.body.dspcstm ) {
    case "corp":
        posts.dspcstm["corp"] = "";
        posts.dspcstm_val = "corp";
        break;
    case "priv":
        posts.dspcstm["priv"] = "";
        posts.dspcstm_val = "priv";
        break;
    case "vist":
        posts.dspcstm["vist"] = "";
        posts.dspcstm_val = "vist";
        break;
    case "default":
        posts.dspcstm["corp"] = "";
        posts.dspcstm_val = "corp";
        break;
    }

    lcsAp.sync( args,
                [checkStartordr,
                 execStartordr,
                 sendGroundcary,
                 optionsArea,
                 optionsPart,
                 dataPart,
                 dataOrdr,
                 dataCary], 
                dspWin );
}

/**
 * 最新表示押下時の処理
 * @module showoOrdr
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   24/jun/2012
 */
function showOrdr(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};

    // information bar へ出力
    posts.mesg = 'ここは警告表示行';

    // text object へ出力
    posts.text.ordr = req.body.ordr;
    posts.text.lotn = req.body.lotn;

    //check box へ出力
    if( req.body.chk1 ) {
        for( var i=0 ; i<req.body.chk1.length ; i++ ) {
            if(req.body.chk1[i]){
                posts.checkbox.chk1[req.body.chk1[i]] = "checked";
            }
        }
    }

    posts.dspcstm["corp"] = "hidden";
    posts.dspcstm["priv"] = "hidden";
    posts.dspcstm["vist"] = "hidden";
    switch( req.body.dspcstm ) {
    case "corp":
        posts.dspcstm["corp"] = "";
        posts.dspcstm_val = "corp";
        break;
    case "priv":
        posts.dspcstm["priv"] = "";
        posts.dspcstm_val = "priv";
        break;
    case "vist":
        posts.dspcstm["vist"] = "";
        posts.dspcstm_val = "vist";
        break;
    case "default":
        posts.dspcstm["corp"] = "";
        posts.dspcstm_val = "corp";
        break;
    }

    lcsAp.sync( args,
                [optionsArea,
                 optionsPart,
                 dataPart,
                 dataOrdr,
                 dataCary], dspWin );

}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   24/jun/2012
 */
function initSend(req, res, posts) {

    var args = {"req": req, "res": res, "posts": posts};
    var str = req.url.replace(/\.+/,'').split('/');

    // information bar へ出力
    posts.mesg = 'ここは警告表示行';

    // text object へ出力
    posts.text.ordr = '';
    posts.text.lotn = '';

    //check box へ出力
    posts.checkbox.chk1['1'] = 'checked';
    posts.checkbox.chk1['2'] = 'checked';
    posts.checkbox.chk1['3'] = '';

    req.body.chk1 = ['1','2'];

    posts.dspcstm["corp"] = "hidden";
    posts.dspcstm["priv"] = "hidden";
    posts.dspcstm["vist"] = "hidden";
    switch( str[2] ) {
    case "301":
        posts.dspcstm["corp"] = "";
        posts.dspcstm_val = "corp";
        break;
    case "302":
        posts.dspcstm["priv"] = "";
        posts.dspcstm_val = "priv";
        break;
    case "303":
        posts.dspcstm["vist"] = "";
        posts.dspcstm_val = "vist";
        break;
    case "default":
        posts.dspcstm["corp"] = "";
        posts.dspcstm_val = "corp";
        break;
    }

    lcsAp.sync( args,
                [optionsArea,
                 optionsPart,
                 dataOrdr,
                 dataCary], dspWin );

}

/**
 * 供給画面/main routine
 * @module mop.main
 * @param  {Object}req, {Object}res
 * @date   21/jun/2012
 */
exports.main = function(req, res){

    var posts = {};
    posts = lcsAp.initialz_posts(req,posts,"301");

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    if( req.method=="GET" ) {
        /*GET メソッド*/
        //initialz_posts(posts);
        initSend( req, res, posts );
    }else if( req.method=="POST" ){
        /*POST メソッド*/
        if ( req.body.send_iqy ) {
            showOrdr(req, res, posts);
        } else if ( req.body.send_add ) {
            startOrdr( req, res, posts);
        //} else if ( req.body.send_del ) {
            //deletePart(req, res, posts);
        } else {
            /*規定外のボタンです*/
            dspWin( 3, req, res, posts );
        }
    }else{
        /*規定外のメソッドタイプです*/
        dspWin( 2, req, res, posts );
    }

};
