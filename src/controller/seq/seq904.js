'use strict';
var fs = require('fs');

/* デモ用グローバル */
var DEMO = {};

/**
 * doSync finally
 * @param {Object} err : contents of error-code.
 * @param {Object} args : method "err" throw on error screen and error log.
 * @remark Error is caught if 1st-parameter value defined.
 *         and rendering to error screen.
 */
function finSync(err_args) {
    if (err_args) {
        // エラー画面表示
        lcsUI.showError(err_args, err_args.errmsg);
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
    res.render(posts.scrNo, posts);
    nextDo(null, args);
}

/**
 * クライアントにアクション通知
 * @module 
 * @param
 */ 
var emitClient = {
    /**
     * クライアントにアクション通知
     * @module emitClient.move 
     * @param object from:{x,y}
     * @param object to:{xy}
     * @param string id
     */ 
    "move":function(from, to, id) {
        var act = "";
        if (from.x - to.x > 0) {
            act = "left";
        } else if (from.x - to.x < 0) {
            act = "right";
        } else if (from.y - to.y > 0) {
            act = "up";
        } else if (from.y - to.y < 0) {
            act = "down";
        }

        lcsSOCK.io().of('/scr/904').emit("move", {
            "x": from.x
            ,"y": from.y
            ,"act": act
            ,"id": id
        });

    },
    /**
     * クライアントにアクション通知
     * @module emitClient.zaika 
     * @param string event ('dead','born')
     * @param object target{x,y}
     * @param string id 
     */ 
    "zaika":function(event, target, id) {
        lcsSOCK.io().of('/scr/904').emit("zaika", {
            "x": target.x
            ,"y": target.y
            ,"act": event
            ,"id": id
        });
    }
};

/**
 * パネル初期化
 * @module demoInitialPanel
 * @param
 */ 
function demoInitialPanel() {
    var __file = ROOTDIR + '/src/ini/data/test904.json';
    var ps = JSON.parse(require('fs').readFileSync(__file));

    DEMO.panelSize = ps.panelSize;
    DEMO.xMax = ps.xMax;
    DEMO.yMax = ps.yMax;
    DEMO.empty = [];
    var emptyCount = 0;
    DEMO.pmx = [];
    for (var i = 0; i < DEMO.xMax; i++) {
        DEMO.pmx[i] = [];
        for (var j = 0; j < DEMO.yMax; j++) {
            var exst = 0;
            DEMO.pmx[i][j] = {};
            for (var k = 0, kmax = ps.defPanel.length; k < kmax; k++ ) {
                if ( ps.defPanel[k].x == i && ps.defPanel[k].y == j) {
                    DEMO.pmx[i][j].type = ps.defPanel[k].type;
                    DEMO.pmx[i][j].id = ps.defPanel[k].id;
                    if (typeof ps.defPanel[k].zaik === 'string') {
                        DEMO.pmx[i][j].zaik = '1';
                    } else {
                        DEMO.pmx[i][j].zaik = '0';
                    }
                    exst = 1;
                    break;
                }
            }
            if (!exst) {
                DEMO.pmx[i][j].type = "empty";
                DEMO.pmx[i][j].id = "";
                DEMO.empty[emptyCount] = {"x": i, "y": j};
                emptyCount++;
            }
        }
    }
}

/**
 * イベントを受けて画面を更新
 * @module demoDisplay
 * @param  
 * @date   6/dec/2012
 */
function demoDisplay2() {
    var __file = ROOTDIR + '/src/ini/data/test904_route.json';
    var ps = JSON.parse(require('fs').readFileSync(__file));
    var counter = 0, 
        end = ps.move.length - 1;

    setTimeout(function() {
        demoDisplay2Exec(ps, counter, end);
    }, 5000);

    //setTimeout(function() {
    //    demoDisplay2();
    //}, 2000 * ps.move.length);
}
function demoDisplay2Exec(ps, counter, end) {
    var from = ps.move[counter],
        to = { "x":DEMO.empty[0].x, "y":DEMO.empty[0].y};
    setTimeout(function() {
        if (typeof from.event == 'string') {
            emitClient.zaika(from.event, from, DEMO.pmx[from.x][from.y].id);
            if (from.event == 'dead') {
                DEMO.pmx[from.x][from.y].zaik = "";
            } else if(from.event == 'born') {
                DEMO.pmx[from.x][from.y].zaik = "1";
            }
        } else {
            emitClient.move(ps.move[counter], 
                            {"x":DEMO.empty[0].x, "y":DEMO.empty[0].y}, 
                                DEMO.pmx[ps.move[counter].x][ps.move[counter].y].id); 

            DEMO.pmx[to.x][to.y].type = DEMO.pmx[from.x][from.y].type;
            DEMO.pmx[to.x][to.y].id = DEMO.pmx[from.x][from.y].id;
            DEMO.pmx[to.x][to.y].zaik = DEMO.pmx[from.x][from.y].zaik;
            DEMO.pmx[from.x][from.y].type = "empty";
            DEMO.pmx[from.x][from.y].id = "";
            DEMO.pmx[from.x][from.y].zaik = "";
            DEMO.empty[0].x = from.x;
            DEMO.empty[0].y = from.y;
        }

        if (counter < end) {
            counter++;
            demoDisplay2Exec(ps, counter, end);
        } else {
            counter = 0;
            demoDisplay2Exec(ps, counter, end);
        }
    }, 2500);
}
/**
 * イベントを受けて画面を更新
 * @module demoDisplay
 * @param  
 * @date   6/dec/2012
 */
function demoDisplay() {
    setTimeout(function() {
        for (var i = 0, imax = DEMO.empty.length; i < imax; i++) {
            var x = DEMO.empty[i].x;
            var y = DEMO.empty[i].y;
            var move = [4]; /* u,d,r,l */
            if (y <= 0) {
                move[0] = 0;
            } else {
                
                if (DEMO.pmx[x][y - 1].type == "dontMove" ||
                    DEMO.pmx[x][y - 1].type == "empty") {
                    move[0] = 0;
                } else {
                    move[0] = 1;
                }
                
            }
            if (y + 1 >= DEMO.yMax) {
                move[1] = 0;
            } else {
                if (DEMO.pmx[x][y + 1].type == "dontMove" ||
                    DEMO.pmx[x][y + 1].type == "empty") {
                    move[1] = 0;
                } else {
                    move[1] = 1;
                }
            }
            if (x + 1 >= DEMO.xMax) {
                move[2] = 0;
            } else {
                if (DEMO.pmx[x + 1][y].type == "dontMove" ||
                    DEMO.pmx[x + 1][y].type == "empty") {
                    move[2] = 0;
                } else {
                    move[2] = 1;
                }
            }
            if (x <= 0) {
                move[3] = 0;
            } else {
                if (DEMO.pmx[x - 1][y].type == "dontMove" ||
                    DEMO.pmx[x - 1][y].type == "empty") {
                    move[3] = 0;
                } else {
                    move[3] = 1;
                }
            }
            if (move[0] + move[1] + move[2] + move[3] <= 0) {
                continue;
            }
            if (move[0] + move[1] + move[2] + move[3] == 1) {
                if (move[0]) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x
                        ,"y": y - 1
                        ,"act": "down"
                        ,"id": DEMO.pmx[x][y - 1].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x][y - 1].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x][y - 1].id;
                    DEMO.pmx[x][y - 1].type = "empty";
                    DEMO.pmx[x][y - 1].id = "";
                    DEMO.empty[i].y -= 1;
                }
                if (move[1]) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x
                        ,"y": y + 1
                        ,"act": "up"
                        ,"id": DEMO.pmx[x][y + 1].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x][y + 1].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x][y + 1].id;
                    DEMO.pmx[x][y + 1].type = "empty";
                    DEMO.pmx[x][y + 1].id = "";
                    DEMO.empty[i].y += 1;
                }
                if (move[2]) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x + 1
                        ,"y": y
                        ,"act": "left"
                        ,"id": DEMO.pmx[x + 1][y].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x + 1][y].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x + 1][y].id;
                    DEMO.pmx[x + 1][y].type = "empty";
                    DEMO.pmx[x + 1][y].id = "";
                    DEMO.empty[i].x += 1;
                }
                if (move[3]) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x - 1
                        ,"y": y
                        ,"act": "right"
                        ,"id": DEMO.pmx[x - 1][y].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x - 1][y].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x - 1][y].id;
                    DEMO.pmx[x - 1][y].type = "empty";
                    DEMO.pmx[x - 1][y].id = "";
                    DEMO.empty[i].x -= 1;
                }
            }
            if (move[0] + move[1] + move[2] + move[3] > 1) {
                var rand = 0;
                while (1) {
                    rand = Math.floor(Math.random() * 4);
                    if (move[rand]) {
                        break;
                    }
                }
                if (rand == 0) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x
                        ,"y": y - 1
                        ,"act": "down"
                        ,"id": DEMO.pmx[x][y - 1].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x][y - 1].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x][y - 1].id;
                    DEMO.pmx[x][y - 1].type = "empty";
                    DEMO.pmx[x][y - 1].id = "";
                    DEMO.empty[i].y -= 1;
                }
                if (rand == 1) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x
                        ,"y": y + 1
                        ,"act": "up"
                        ,"id": DEMO.pmx[x][y + 1].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x][y + 1].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x][y + 1].id;
                    DEMO.pmx[x][y + 1].type = "empty";
                    DEMO.pmx[x][y + 1].id = "";
                    DEMO.empty[i].y += 1;
                }
                if (rand == 2) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x + 1
                        ,"y": y
                        ,"act": "left"
                        ,"id": DEMO.pmx[x + 1][y].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x + 1][y].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x + 1][y].id;
                    DEMO.pmx[x + 1][y].type = "empty";
                    DEMO.pmx[x + 1][y].id = "";
                    DEMO.empty[i].x += 1;
                }
                if (rand == 3) {
                    lcsSOCK.io().of('/scr/904').emit("move", {
                        "x": x - 1
                        ,"y": y
                        ,"act": "right"
                        ,"id": DEMO.pmx[x - 1][y].id
                    });
                    DEMO.pmx[x][y].type = DEMO.pmx[x - 1][y].type;
                    DEMO.pmx[x][y].id = DEMO.pmx[x - 1][y].id;
                    DEMO.pmx[x - 1][y].type = "empty";
                    DEMO.pmx[x - 1][y].id = "";
                    DEMO.empty[i].x -= 1;
                }
            }
        }
        demoDisplay();
    }, 2000);
}
/**
 * イベントを受けて画面を更新
 * @module eventDisplay
 * @param  
 * @date   6/dec/2012
 */
function eventDisplay() {
    demoInitialPanel();
    demoDisplay2()
}

/**
 * デフォルトパネル 
 * @module defPanels
 * @param  {Object}args, {function}nextDo
 * @date   21/sep/2012
 */
function defPanels(args, nextDo) {
    var req = args.req, res = args.res, posts = args.posts;

    args.posts.panelSize = DEMO.panelSize;
    args.posts.xMax = DEMO.xMax;
    args.posts.yMax = DEMO.yMax;
    args.posts.defPanel = [];
    for (var i = 0, imax = DEMO.pmx.length; i < imax; i++) {
        for (var j = 0, jmax = DEMO.pmx[i].length; j < jmax; j++) {
            if (DEMO.pmx[i][j].type != "empty") {
                args.posts.defPanel.push(DEMO.pmx[i][j]);
                args.posts.defPanel[args.posts.defPanel.length-1].x = i;
                args.posts.defPanel[args.posts.defPanel.length-1].y = j;
            }
        }
    }

    nextDo(null, args);
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
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  defPanels,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * メニューからジャンプ時の処理
 * @module initSend
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function initSend(req, res, posts) {
    var sync_pool = [],
        args = {"req": req, "res": res, "posts": posts};
    lcsAp.initSync(sync_pool);
    lcsAp.doSync(args,
                 [
                  defPanels,
                  dspWin], /* 後処理 */
                 finSync );
}

/**
 * エラー
 * @module errDisp
 * @param  {Object}req, {Object}res, {Object}posts, {number}err
 * @date   21/sep/2012
 */
function errDisp(req, res, posts, err) {
    var args = {"req": req, "res": res, "posts": posts};
    args.errmsg = lcsAp.getMsgI18N(err);
    finSync(args);
}

/**
 * パズル/main routine
 * @module mop.main
 * @param  {Object}req
 * @param  {Object}res
 * @param  {Object}frame
 * @date   21/jun/2012
 */
exports.main = function(req, res, frame){

    var ToF = {/* Table of function for each button */
        "GET": initSend,
        "POST":{
            "send_iqy" : iqyPB,
            "*" : errDisp
        },
        "*" : errDisp
    };
    var posts = {};
    try {
        posts = lcsAp.initPosts(req, frame);
    } catch(e) {
        lcsAp.syslog( "error", "lcsAp.initPosts" );
        ToF["*"](req, res, posts, 98);
        return;
    }

    if (!lcsAp.isSession(req.session)) {
        res.redirect('/');
    }

    for (var key1 in ToF) {
        if (key1 === req.method) {
            if (typeof ToF[key1] === "function") {
                ToF[key1](req, res, posts);
                return;
            } else if (typeof ToF[key1] === "object") {
                for (var key2 in ToF[key1]) {
                    if (req.body[key2]) {
                        if (typeof ToF[key1][key2] === "function") {
                            ToF[key1][key2](req, res, posts);
                            return;
                        }
                    }
                }
                /*規定外のボタンです*/
                if (typeof ToF[key1]["*"] === "function") {
                    ToF[key1]["*"](req, res, posts, 3);
                    return;
                }
            }
        }
    }
    /*規定外のメソッドタイプです*/
    if (typeof ToF["*"] === "function") {
        ToF["*"](req, res, posts, 2);
        return;
    }
    res.redirect('/');
    return;
};

/**
 * sockMain
 * @module seq904.sockMain
 * @date   6/dec/2012
 */
exports.sockMain = function(){
    lcsSOCK.io().of('/scr/904').on('connection', function(socket) {
            /* socket.io */

            /* ここはデモ用につくった画面からの要求で値をカエル処理です */
            socket.on("buttonEvent_01", function(data) {
                });

        });

    /* イベントを起こして画面に反映させる */
    eventDisplay();
}
