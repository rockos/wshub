'use strict';
var fs = require('fs');

/* デモ用グローバル */
var DEMO_01 = {};
var DEMO_02 = {};
var UP_LIMIT = 10,
    DOWN_LIMIT = 0,
    LEFT_LIMIT = -5,
    RIGHT_LIMIT = 5;
var UP_MOVE = 1,
    DOWN_MOVE = 2,
    LEFT_MOVE = 4,
    RIGHT_MOVE = 8,
    NONE_MOVE = 0;
var FORE_LIMIT = 25,
    BACK_LIMIT = 0;
var FORE_MOVE = 1,
    BACK_MOVE = 2;

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
 * デモ２
 * @module demo02
 * @param  
 * @date   10/dec/2012
 */
function demo02(cart) {
    setTimeout( function() {
            if (cart.flag != cart.prev) {
                /* ボタン ON / OFF の切替 */
                if (cart.flag) {
                    lcsSOCK.io().of('/scr/903').emit("buttonEvent_02", {
                        "color": 1
                        ,"move": cart.move
                    });
                } else {
                    lcsSOCK.io().of('/scr/903').emit("buttonEvent_02", {
                        "color": 0
                        ,"move": cart.move
                    });
                }
                cart.prev = cart.flag;
            } /* .End ボタン ON / OFF の切替 */

            if (cart.flag) {
                /* ボタン ON の時 */

                if (cart.move == FORE_MOVE && cart.h >= FORE_LIMIT) {
                    /* 前 限界 */
                } else if (cart.move == BACK_MOVE && cart.h <= BACK_LIMIT) {
                    /* 後 限界 */
                } else if(cart.move == FORE_MOVE || cart.move == BACK_MOVE) {
                    if (cart.move == FORE_MOVE) {
                        if (cart.h <= BACK_LIMIT) {
                            /* 後退 限界 解除 */
                            lcsSOCK.io().of('/scr/903').emit("buttonEvent_02", {
                                "limit": 0
                                ,"move": BACK_MOVE
                            });
                        }
                        cart.h += 1;
                    }
                    if (cart.move == BACK_MOVE) {
                        if (cart.h >= FORE_LIMIT) {
                            /* 前進 限界 */
                            lcsSOCK.io().of('/scr/903').emit("buttonEvent_02", {
                                "limit": 0
                                ,"move": FORE_MOVE
                            });
                        }
                        cart.h -= 1;
                    }
                    if (cart.h <= BACK_LIMIT || cart.h >= FORE_LIMIT) {
                        lcsSOCK.io().of('/scr/903').emit("buttonEvent_02", {
                            "limit": 1
                            ,"move": cart.move
                        });
                    }
                }
                lcsSOCK.io().of('/scr/903').emit("buttonEvent_02", {
                    "value_h":cart.h
                });
            }
            demo02(cart);
        }, 600);
}

/**
 * デモ１
 * @module demo01
 * @param  
 * @date   10/dec/2012
 */
function demo01(crane) {
    setTimeout( function() {
            if (crane.flag != crane.prev) {
                /* ボタン ON / OFF の切替 */
                if (crane.flag) {
                    lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                        "color": 1
                        ,"move": crane.move
                    });
                } else {
                    lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                        "color": 0
                        ,"move": crane.move
                    });
                }
                crane.prev = crane.flag;
            } /* .End ボタン ON / OFF の切替 */

            if (crane.flag) {
                /* ボタン ON の時 */

                if ( crane.move == UP_MOVE && crane.v >= UP_LIMIT) {
                    /* 上昇 Limit中 */
                } else if (crane.move == DOWN_MOVE && crane.v <= DOWN_LIMIT) {
                    /* 下降 Limit中 */
                } else if(crane.move == UP_MOVE || crane.move == DOWN_MOVE) {
                    if (crane.move == UP_MOVE) {
                        if (crane.v <= DOWN_LIMIT) {
                            /* 下降 Limit 解除 */
                            lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                                "limit": 0
                                ,"move": DOWN_MOVE
                            });
                        }
                        crane.v += 1;
                    }
                    if (crane.move == DOWN_MOVE) {
                        if (crane.v >= UP_LIMIT) {
                            /* 上昇 Limit 解除 */
                            lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                                "limit": 0
                                ,"move": UP_MOVE
                            });
                        }
                        crane.v -= 1;
                    }
                    if (crane.v >= UP_LIMIT || crane.v <= DOWN_LIMIT) {
                        /* 限界 */
                        lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                            "limit": 1
                            ,"move": crane.move
                        });
                    }
                }

                if (crane.move == LEFT_MOVE && crane.h <= LEFT_LIMIT) {
                    /* 左 限界 */
                } else if (crane.move == RIGHT_MOVE && crane.h >= RIGHT_LIMIT) {
                    /* 右 限界 */
                } else if(crane.move == LEFT_MOVE || crane.move == RIGHT_MOVE) {
                    if (crane.move == LEFT_MOVE) {
                        if (crane.h >= RIGHT_LIMIT) {
                            /* 右 限界 解除 */
                            lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                                "limit": 0
                                ,"move": RIGHT_MOVE
                            });
                        }
                        crane.h -= 1;
                    }
                    if (crane.move == RIGHT_MOVE) {
                        if (crane.h <= LEFT_LIMIT) {
                            /* 左 限界 */
                            lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                                "limit": 0
                                ,"move": LEFT_MOVE
                            });
                        }
                        crane.h += 1;
                    }
                    if (crane.h >= RIGHT_LIMIT || crane.h <= LEFT_LIMIT) {
                        lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                            "limit": 1
                            ,"move": crane.move
                        });
                    }
                }
                lcsSOCK.io().of('/scr/903').emit("buttonEvent_01", {
                    "value_v":crane.v
                    ,"value_h":crane.h
                });
            }
            demo01(crane);
        }, 200);
}

/**
 * イベントを受けて画面を更新
 * @module eventDisplay
 * @param  
 * @date   6/dec/2012
 */
function eventDisplay() {
    /*デモ用*/
    DEMO_01 = {
        "v":0,
        "h":0,
        "flag":0,
        "prev":0,
        "move":0    /* 1:上 2:下 4:左 8:右 */
    };
    demo01(DEMO_01);

    DEMO_02 = {
        "h":10,
        "flag":0,
        "prev":0,
        "move":0    /* 1:前 2:後 */
    };
    demo02(DEMO_02);

}

/**
 * デモ 初期表示
 * @module demoInitial
 * @param  {Object}req, {Object}res, {Object}posts
 * @date   21/sep/2012
 */
function demoInitial(args, nextDo) {
    args.posts.machineView = DEMO_01;
    args.posts.machineView.limit_def = {"u":UP_LIMIT,"d":DOWN_LIMIT,"l":LEFT_LIMIT,"r":RIGHT_LIMIT};
    args.posts.machineView2 = DEMO_02;
    args.posts.machineView2.limit_def = {"f":FORE_LIMIT,"b":BACK_LIMIT};
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
                  demoInitial,
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
                  demoInitial,
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
 * 機械操作/main routine
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
 * @module seq902.sockMain
 * @date   6/dec/2012
 */
exports.sockMain = function(){
    lcsSOCK.io().of('/scr/903').on('connection', function(socket) {
            /* socket.io */

            /* ここはデモ用につくった画面からの要求で値をカエル処理です */
            socket.on("buttonEvent_01", function(data) {
                    if (data.event == "ON") {
                        DEMO_01.flag = 1;
                        if (data.action == "UP") {
                            DEMO_01.move = UP_MOVE;
                        } else if (data.action == "DOWN") {
                            DEMO_01.move = DOWN_MOVE;
                        } else if (data.action == "LEFT") {
                            DEMO_01.move = LEFT_MOVE;
                        } else if (data.action == "RIGHT") {
                            DEMO_01.move = RIGHT_MOVE;
                        }
                    } else {
                        DEMO_01.flag = 0;
                    }
                });

            /* ここはデモ用につくった画面からの要求で値をカエル処理です */
            socket.on("buttonEvent_02", function(data) {
                    if (data.event == "ON") {
                        DEMO_02.flag = 1;
                        if (data.action == "FORE") {
                            DEMO_02.move = FORE_MOVE;
                        } else if (data.action == "BACK") {
                            DEMO_02.move = BACK_MOVE;
                        }
                    } else {
                        DEMO_02.flag = 0;
                    }
                });
        });

    /* イベントを起こして画面に反映させる */
    eventDisplay();
}
