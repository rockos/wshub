'use strict';
var fs = require('fs');

/*デモ用グローバル*/

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
 *  デモ1
 */
function demo1() {
    setTimeout( function() {
            lcsSOCK.io().of('/scr/902').emit("changeCrane",
                {
                    "head": "m-cr-01"
                        ,"local_switch" : decodeCrane.local_switch(Math.floor(Math.random() * 2))
                        ,"online_switch" : decodeCrane.online_switch(Math.floor(Math.random() * 2))
                        ,"status" : decodeCrane.status(Math.floor(Math.random() * 2))
                        ,"move_start" : Math.floor(Math.random() * 10000)
                        ,"move_end" : Math.floor(Math.random() * 10000)
                        ,"id" : Math.floor(Math.random() * 10000)
                        ,"error" : decodeCrane.error(Math.floor(Math.random() * 2))
                        });
            demo1();
        }, 5000);
}
function demo2(a,b) {
    if (a == undefined) {
        a=0;
    }
    if (b == undefined) {
        b=0;
    }
    setTimeout( function() {
            lcsSOCK.io().of('/scr/902').emit("changeCrane", {
                    "head": "m-cr-02"
                        ,"speed" : a
                        ,"h_range" : a
                        ,"v_range" : a
                        ,"count" : b
                        ,"h_total_distance" : b*15+a
                        ,"v_total_distance" : b*15+a
                        });
            a++;
            if (a>15) {
                b++;
                a=0;
            }
            if (b>1000) {
                b=0;
            }
            demo2(a,b);
        }, 500);
}
function demo3() {
    setTimeout( function() {
            lcsSOCK.io().of('/scr/902').emit("changeConveyor",
            {
                "head": "m-cv-ns01"
                    ,"local_switch" : decodeConveyor.local_switch(Math.floor(Math.random() * 2))
                    ,"status" : decodeConveyor.status(Math.floor(Math.random() * 2))
                    ,"exists_load" : decodeConveyor.exists_load(Math.floor(Math.random() * 15),4)
                    ,"direction" : decodeConveyor.direction(Math.floor(Math.random() * 2))
                    ,"h_total_distance" : Math.floor(Math.random() * 10000)
                    ,"error" : decodeCrane.error(Math.floor(Math.random() * 2))
                    });
            lcsSOCK.io().of('/scr/902').emit("changeConveyor",
            {
                "head": "m-cv-ns02"
                    ,"local_switch" : decodeConveyor.local_switch(Math.floor(Math.random() * 2))
                    ,"status" : decodeConveyor.status(Math.floor(Math.random() * 2))
                    ,"exists_load" : decodeConveyor.exists_load(Math.floor(Math.random() * 16),4)
                    ,"direction" : decodeConveyor.direction(Math.floor(Math.random() * 2))
                    ,"h_total_distance" : Math.floor(Math.random() * 10000)
                    ,"error" : decodeCrane.error(Math.floor(Math.random() * 2))
                    });
            demo3();
        }, 4000);
}

/**
 * イベントを受けて画面を更新
 * @module eventDisplay
 * @param  
 * @date   6/dec/2012
 */
function eventDisplay() {

    /**** デモ *****/
    demo1();
    demo2();
    demo3();

    /*** サンプル
    // クレーンデータを書き換える
    lcsSOCK.io().of('/scr/902').emit("changeCrane",
    {
        "head": "m-cr-01"                                // かならず必要 posts.table.crane[i].head と同じもの
        ,"local_switch" : decodeCrane.local_switch(0)    // ココから下は必要に応じてパラメータを選択
        ,"online_switch" : decodeCrane.online_switch(0)
        ,"status" : decodeCrane.status(0)
        ,"move_start" : "　"
        ,"move_end" : "　"
        ,"id" : "　"
        ,"speed" : "123"
        ,"h_range" : "456"
        ,"v_range" : "789"
        ,"count" : "0"
        ,"h_total_distance" : "0"
        ,"v_total_distance" : "0"
        ,"error" : decodeCrane.error(0)
        });
    // コンベヤデータを書き換える
    lcsSOCK.io().of('/scr/902').emit("changeConveyor",
    {
        "head": "m-cv-ns01"                                // かならず必要 
        ,"local_switch" : decodeConveyor.local_switch(0)    // ココから下は必要に応じてパラメータを選択
        ,"status" : decodeConveyor.status(0)
        ,"exists_load" : decodeConveyor.exists_load("0000")
        ,"direction" : decodeConveyor.direction(0)
        ,"h_total_distance" : "0"
        ,"error" : decodeCrane.error(0)
        });
    ***/
}

/**
 * コンベヤ デコード
 * @module decodeConveyor
 * @param  
 * @date   6/dec/2012
 */
var decodeConveyor = {
    "local_switch" : function(code) {
        if (code==1) {
            return {"text":"ON","color":"blue"};
        } else if (code==0) {
            return {"text":"OFF","color":"red"};
        } else {
            return {"text":"OFF","color":"red"};
        }
    },
    "status" : function(code) {
        if (code==1) {
            return {"text":"動作中","color":"blue"};
        } else if (code==0) {
            return {"text":"待機中","color":"gray"};
        } else {
            return {"text":"エラー","color":"red"};
        }
    },
    "exists_load" : function(code, len) {
        var str = "",
        strcode = "";
        if (typeof code === 'string') {
            strcode = code;
        } else if (typeof code === 'number') {
            strcode = code.toString(2);
            for (var i = len - strcode.length; i > 0; i--) {
                strcode = "0" + strcode;
            }
        } else if (typeof code === 'object') {
            for (var key in code) {
                strcode += code[key].toString();
            }
        } else if (typeof code === 'array') {
            for (var i = 0, imax = code.length; i < imax; i++) {
                strcode += code[i].toString();
            }
        } else {
            var strcode = code;
        }
        for (var i = 0, imax = strcode.length; i < imax; i++) {
            if (strcode.substr(i,1) == "1") { 
                str += "●";
            } else {
                str += "○";
            }
        }
        return str;
    },
    "direction" : function(code) {
        if (code==1) {
            return "→";
        } else if (code==0) {
            return "←";
        } else {
            return "←";
        }
    },
    "error" : function(code) {
        if (code==101) {
            return {"text":code+":エラー","color":"red"};
        } else if (code==102) {
            return {"text":code+":エラー","color":"red"};
        } else if (code==0) {
            return {"text":"　","color":""};
        } else {
            return {"text":code+":その他エラー","color":"red"};
        }
    }
};

/**
 * コンベヤ デモ
 * @module demoConveyor
 * @param  {Object}args, {Function}nextDo
 * @date   6/dec/2012
 */
function demoConveyor(args, nextDo) {
    var cv = [];
    /*** デモ コンベヤの情報を格納 ***/
    /* CV-1 */
    cv[0] = {};
    cv[0].head = "m-cv-ns01"; /*ユニークな識別*/
    cv[0].name = "NS01";
    cv[0].local_switch = decodeConveyor.local_switch(1);
    cv[0].status = decodeConveyor.status(9);
    /* decodeConveyor.exists_load() 引数はどれでもよい */
    cv[0].exists_load = decodeConveyor.exists_load("1011");
    //cv[0].exists_load = decodeConveyor.exists_load(11,4);
    //cv[0].exists_load = decodeConveyor.exists_load({"a":1,"b":0,"c":1,"d":1});
    //cv[0].exists_load = decodeConveyor.exists_load([1,0,1,1]);

    cv[0].direction = decodeConveyor.direction(1);
    cv[0].h_total_distance = "16751";
    cv[0].error = decodeConveyor.error(101);

    /* CV-2 */
    cv[1] = {};
    cv[1].head = "m-cv-ns02"; /*ユニークな識別*/
    cv[1].name = "NS02";
    cv[1].local_switch = decodeConveyor.local_switch(1);
    cv[1].status = decodeConveyor.status(1);
    /* 引数はどれでもよい */
    cv[1].exists_load = decodeConveyor.exists_load("0001");
    //cv[1].exists_load = decodeConveyor.exists_load(1,4);
    //cv[1].exists_load = decodeConveyor.exists_load({"a":0,"b":0,"c":0,"d":1});
    //cv[1].exists_load = decodeConveyor.exists_load([0,0,0,1]);

    cv[1].direction = decodeConveyor.direction(1);
    cv[1].h_total_distance = "7923";
    cv[1].error = decodeConveyor.error(0);

    /**** ここまでデモ ****/
    args.posts.table.conveyor = cv;

    nextDo(null, args);
}

/**
 * クレーン デコード
 * @module decodeCrane
 * @param  
 * @date   6/dec/2012
 */
var decodeCrane = {
    "name" : function(code) {
        if (code==1) {
            return {"text":"１号機"};
        } else if (code==2) {
            return {"text":"２号機"};
        } else {
            return {"text":code};
        }
    },
    "local_switch" : function(code) {
        if (code==1) {
            return {"text":"ON","color":"blue"};
        } else if (code==0) {
            return {"text":"OFF","color":"red"};
        } else {
            return {"text":"OFF","color":"red"};
        }
    },
    "online_switch" : function(code) {
        if (code==1) {
            return {"text":"自動","color":"blue"};
        } else if (code==0) {
            return {"text":"手動","color":"red"};
        } else {
            return {"text":"手動","color":"red"};
        }
    },
    "status" : function(code) {
        if (code==1) {
            return {"text":"動作中","color":"blue"};
        } else if (code==0) {
            return {"text":"待機中","color":"gray"};
        } else {
            return {"text":"エラー","color":"red"};
        }
    },
    "error" : function(code) {
        if (code==101) {
            return {"text":code+":エラー","color":"red"};
        } else if (code==102) {
            return {"text":code+":エラー","color":"red"};
        } else if (code==0) {
            return {"text":"　","color":""};
        } else {
            return {"text":code+":その他エラー","color":"red"};
        }
    }
};

/**
 * クレーン デモ
 * @module demoCrane
 * @param  {Object}args, {Function}nextDo
 * @date   6/dec/2012
 */
function demoCrane(args, nextDo) {
    var cr = [];
    /*** デモ クレーンの情報を格納(１号機) ***/
    cr[0] = {};
    cr[0].head = "m-cr-01"; /*ユニークな識別*/
    cr[0].name = decodeCrane.name(1).text;
    cr[0].local_switch = decodeCrane.local_switch(1);
    cr[0].online_switch = decodeCrane.online_switch(1);
    cr[0].status = decodeCrane.status(9);
    cr[0].move_start = "A-987";
    cr[0].move_end = "DP-03-02";
    cr[0].id = "CTN-29431";
    cr[0].speed = "0";
    cr[0].h_range = "0";
    cr[0].v_range = "0";
    cr[0].count = "2896";
    cr[0].h_total_distance = "47592";
    cr[0].v_total_distance = "3292";
    cr[0].error = decodeCrane.error(101);
    /**** ここまでデモ ****/
    /*** デモ クレーンの情報を格納(２号機) ***/
    cr[1] = {};
    cr[1].head = "m-cr-02";
    cr[1].name = decodeCrane.name(2).text;
    cr[1].local_switch = decodeCrane.local_switch(1);
    cr[1].online_switch = decodeCrane.online_switch(1);
    cr[1].status = decodeCrane.status(1);
    cr[1].move_start = "X-258";
    cr[1].move_end = "DP-01-01";
    cr[1].id = "CTN-36901";
    cr[1].speed = "0";
    cr[1].h_range = "0";
    cr[1].v_range = "0";
    cr[1].count = "1479";
    cr[1].h_total_distance = "36974";
    cr[1].v_total_distance = "1674";
    cr[1].error = decodeCrane.error(0);
    /**** ここまでデモ ****/
    args.posts.table.crane = cr;

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
                  demoCrane,
                  demoConveyor,
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
                  demoCrane,
                  demoConveyor,
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
 * 出庫予約画面/main routine
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
    lcsSOCK.io().of('/scr/902').on('connection', function(socket) {
            /* socket.io */

            /* ここはデモ用につくった画面からの要求で値をカエル処理です */
            socket.on("demoevent", function(data) {
                });
        });

    /* イベントを起こして画面に反映させる */
    eventDisplay();
}
