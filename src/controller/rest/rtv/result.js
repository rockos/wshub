
/**
 * doSync finally
 * @param {Object} err : contents of error-code.
 * @param {Object} args : method "err" throw on error screen and error log.
 * @remark Error is caught if 1st-parameter value defined.
 *         and rendering to error screen.
 */
function finSync(err_args) {
    if (err_args) {
        var req = err_args.req, res = err_args.res, posts = err_args.posts;
        // エラーレスポンスを返す
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(posts),'utf8');
    }
}

/**
 * 画面表示
 * @module dspWin
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function dspWin(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(posts),'utf8');
    nextDo(null, args);
}


/**
 * テーブルリストを取得する
 * @module postData1
 * @param  {Object}req, {Object}res, {Object}posts, {function}callback
 * @date   24/jul/2012
 */
function postData(args, nextDo) {
    var req = args.req, res = args.res;

    //**** デモ中 ***********************************************************
    var idx = 0;
    var __file = ROOTDIR + '/src/ini/data/restreservetest001.json';
    var ddd = JSON.parse(require('fs').readFileSync(__file));
    args.posts.user = req.query.user;
    args.posts.date = req.query.date;
    args.posts.part = [];
    for (var i = 0, imax = ddd.part.length; i < imax; i++) {
        if (ddd.part[i].user == req.query.user) {
            args.posts.part[idx] = ddd.part[i];
            idx++;
        }
    }
    if (idx <= 0) {
        args.posts.error = 'not found';
        nextDo(args);
        return;
    }
    nextDo( null, args );
    //***********************************************************************
}

/**
 * 予約取得リクエスト
 * @module reserveRQ
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function reserveRQ(req, res, posts) {

    var sync_pool = [];
    var args = {"req": req, "res": res, "posts": posts};

    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  postData, /* 表示データを取得する */
                  dspWin], /* 後処理 */
                 finSync );
}
/**
 *  REST型 WEB API 予約リクエスト受信
 *  reserve.js
 *  @remark GETのみ受付ける
 */
exports.main = function(req, res) {
    var posts = {};
    reserveRQ(req, res, posts);
}
