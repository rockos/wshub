/**
 *  screen 301 inquiry module
 */

/**
 * 入力されたフォームにデータを返す
 * @module setEcho
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
exports.setEcho = function (args, nextDo) {
    var req = args.req, res = args.res;
    /* txt1 */
    nextDo(null, args);
}

/**
 * t_stocksテーブルリストを取得する
 * @module postData
 * @param  {Object}args, {function}nextDo
 * @date   24/jul/2012
 */
exports.postData = function (args, nextDo) {

    var req = args.req, 
        res = args.res, 
        posts = args.posts,
        step = args.posts.step,
        sql = "",
        bind = [],
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
        "    and i.id_item = s.id_item " +
        "";
    if (req.body.txt3) {
        sql += " and s.id_user = ? ";
        bind = [req.body.txt3];
    } else if (req.body.sel1) {
        sql += " and s.id_user = ? ";
        bind = [req.body.sel1];
    }else{
        sql += " and s.id_user = ? ";
        bind = ["x"]; /* non search */
    }
    sql += "order by l.address ";


    lcsDb.query(sql, bind, function(err, results, fields) {
        if (err) {
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            nextDo(args);
            return;
        }
        stock_rows = results;
        if (stock_rows.length) {
            args.posts.table.tab1.shift();
        }

        for (var i=0, max=stock_rows.length; i<max; i++) {
            stock_rows[i].chk1 = new Object();
            stock_rows[i].chk1.val = stock_rows[i].col4;
            stock_rows[i].chk1.exist = "1";
            if (req.body.tab1_chk) {
                if (typeof req.body.tab1_chk === "string") {
                    if (stock_rows[i].chk1.val == req.body.tab1_chk) {
                        stock_rows[i].chk1.on = "checked";
                    }
                } else {
                    for (var j=0, maxj=req.body.tab1_chk.length; j<maxj; j++) {
                        if (stock_rows[i].chk1.val == req.body.tab1_chk[j]) {
                            stock_rows[i].chk1.on = "checked";
                            break;
                        }
                    }
                }
            }
            if (step=="3" || step=="4") {
                if (stock_rows[i].chk1.on == "checked") {
                    args.posts.table.tab1.push(stock_rows[i]);
                }
            } else {
                args.posts.table.tab1.push(stock_rows[i]);
            }
        }
        nextDo( null, args );
    });
}

/**
 * m_users optionリストを取得する
 * @module optionsDsp
 * @param  {Object}args, {function}nextDo
 * @date   23/jul/2012
 */
exports.optionsDsp = function (args, nextDo) {
    var req = args.req, 
        res = args.res,
        sql = "",
        bind = [];
    sql = "" +
        "select " +
        "  id_user as value, nickname as dsp2, " +
        "  CONCAT(id_user,':',nickname) as dsp, " +
        "  IF(id_user=?, 'selected', 'x') as selected " +
        "from m_users " +
        "where 1=1 " +
        "order by id_user ";
    if (req.body.sel1) {
        bind = [req.body.sel1];
    } else if (req.body.txt3) {
        bind = [req.body.txt3];
    } else {
        bind = [args.posts.frameNavi.userid];
    }

    lcsDb.query (sql, bind, function (err, results, fields) {
        if (err){
            args.errmsg = lcsAp.getMsgI18N(99);
            args.dberr = err;
            nextDo(args);
            return;
        }
        args.posts.select.opt1 = results;
        for( var i=0, max=args.posts.select.opt1.length; ; i++ ) {
            if( args.posts.select.opt1[i].selected == "selected" ) {
                args.posts.text.txt3 = args.posts.select.opt1[i].value;
                args.posts.dsp.user = args.posts.select.opt1[i].dsp;
                break;
            }
        }
        nextDo( null, args );
    });
}
