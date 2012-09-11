/*
 *  definition of position
 */
var posi = { 
    "karasu": [370,295],      // 烏森口
    "zaging": [470,270],      // 銀座口
    "mzbank": [120,475],      // 銀行の近く
    "jra001": [340,730],
    "laps01": [345,120],

    "gdu001": [375,310],      // ガード下の信号
    "gdu002": [440,345],
    "gdu003": [400,415],

    "rts001": [350,190],      // 駅前ロータリー
    "rts002": [480,300],

    "crs001": [350,380],      // 交差点
    "crs002": [255,265],
    "crs003": [330,430],
    "crs004": [205,375],
    "crs005": [300,170],
    "crs006": [375,450],
    "crs007": [160,490],
    "crs008": [280,540],
    "crs009": [305,550],
    "crs010": [285,590],
    "crs011": [265,580],
    "crs012": [145,530],
    "crs013": [120,600],
    "crs014": [215,645],
    "crs015": [240,660],
    "crs016": [320,125],

    "odr001": [ 25,560],      // 西の大通り
    "odr002": [ 50,490],
    "odr003": [110,340],
    "odr004": [160,225],
    "odr005": [230, 45],
    "odr006": [330, 80],

    "sdm001": [330,715],      // 汐留のほう
    "sdm002": [375,640],

    "khu001": [275,675],      // 第一京浜のぼり
    "khu002": [325,605],
    "khu003": [405,470],
    "khu004": [480,365],
    "khu005": [505,325],

    "khd001": [290,690],      // 第一京浜くだり
    "khd002": [335,615],
    "khd003": [525,340],
    "khd004": [420,490],

    "crs999": [999,999]
};
/* 
 * route definition
 * map_curent[i].posi[x,y] スタート位置
 * map_curent[i].next[j][x,y] 向かう場所
 */
var map_curent = 
[
{ 
    "posi": posi.karasu,
    "next": [posi.gdu001, posi.rts001] 
},{ 
    "posi": posi.zaging,
    "next": [posi.rts002] 
},{ 
    "posi": posi.mzbank,
    "next": [posi.crs007] 
},{ 
    "posi": posi.jra001,
    "next": [posi.sdm001] 
},{ 
    "posi": posi.laps01,
    "next": [posi.crs016] 
},{ 
    "posi": posi.rts001,
    "next": [posi.gdu001, posi.crs005] 
},{ 
    "posi": posi.rts002,
    "next": [posi.gdu002, posi.khd003] 
},{ 
    "posi": posi.gdu001,
    "next": [posi.rts001, posi.gdu002, posi.gdu003, posi.crs001, posi.crs002] 
},{
    "posi": posi.gdu002,
    "next": [posi.gdu001, posi.gdu003, posi.khu004] 
},{ 
    "posi": posi.gdu003,
    "next": [posi.gdu001, posi.gdu002, posi.crs001, posi.crs006, posi.khu003, posi.khd004] 
},{ 
    "posi": posi.crs001,
    "next": [posi.gdu001, posi.gdu003, posi.crs003] 
},{ 
    "posi": posi.crs002,
    "next": [posi.gdu001, posi.crs004, posi.crs005, posi.odr004] 
},{ 
    "posi": posi.crs003,
    "next": [posi.crs001, posi.crs004, posi.crs006, posi.crs008] 
},{ 
    "posi": posi.crs004,
    "next": [posi.crs002, posi.crs003, posi.crs007, posi.odr003] 
},{ 
    "posi": posi.crs005,
    "next": [posi.crs002, posi.rts001, posi.crs016] 
},{ 
    "posi": posi.crs006,
    "next": [posi.crs003, posi.gdu003, posi.crs009, posi.khu003, posi.khd004] 
},{ 
    "posi": posi.crs007,
    "next": [posi.crs004, posi.crs008, posi.crs012] 
},{ 
    "posi": posi.crs008,
    "next": [posi.crs003, posi.crs007, posi.crs009, posi.crs011] 
},{ 
    "posi": posi.crs009,
    "next": [posi.crs006, posi.crs008, posi.crs010] 
},{ 
    "posi": posi.crs010,
    "next": [posi.crs009, posi.crs011, posi.crs015, posi.khu002, posi.khd002, posi.sdm002] 
},{ 
    "posi": posi.crs011,
    "next": [posi.crs008, posi.crs010, posi.crs012, posi.crs014] 
},{ 
    "posi": posi.crs012,
    "next": [posi.crs007, posi.crs011, posi.crs013, posi.odr002] 
},{ 
    "posi": posi.crs013,
    "next": [posi.crs012, posi.crs014] 
},{ 
    "posi": posi.crs014,
    "next": [posi.crs011, posi.crs013, posi.crs015] 
},{ 
    "posi": posi.crs015,
    "next": [posi.crs010, posi.crs014, posi.sdm001] 
},{ 
    "posi": posi.crs016,
    "next": [posi.crs005, posi.laps01] 
},{ 
    "posi": posi.odr001,
    "next": [posi.crs013] 
},{ 
    "posi": posi.odr002,
    "next": [posi.crs012, posi.odr005, posi.odr001] 
},{ 
    "posi": posi.odr003,
    "next": [posi.crs004, posi.odr005, posi.odr001] 
},{ 
    "posi": posi.odr004,
    "next": [posi.crs002, posi.odr005, posi.odr001] 
},{ 
    "posi": posi.odr005,
    "next": [posi.odr006] 
},{ 
    "posi": posi.odr006,
    "next": [posi.crs016] 
},{ 
    "posi": posi.sdm001,
    "next": [posi.sdm002, posi.jra001] 
},{ 
    "posi": posi.sdm002,
    "next": [posi.crs010, posi.khu002, posi.khd002, posi.sdm001] 
},{ 
    "posi": posi.khu001,
    "next": [posi.khu002] 
},{ 
    "posi": posi.khu002,
    "next": [posi.crs010, posi.khu003, posi.sdm002] 
},{ 
    "posi": posi.khu003,
    "next": [posi.crs006, posi.gdu003, posi.khu004] 
},{ 
    "posi": posi.khu004,
    "next": [posi.gdu002, posi.khu005] 
},{ 
    "posi": posi.khu005,
    "next": [posi.rts002] 
},{ 
    "posi": posi.khd001,
    "next": [posi.sdm001] 
},{ 
    "posi": posi.khd002,
    "next": [posi.khd001] 
},{ 
    "posi": posi.khd003,
    "next": [posi.khd002] 
},{ 
    "posi": posi.khd004,
    "next": [posi.khd002] 
},{ 
    "posi": posi.crs999,      // end mark.
    "next": [posi.crs999] 
}
];
/*
 * definition of Global
 */
var X=0,Y=1;
var BASE_PX = 3.0;
var MOVE_TIME = 100;
var CHARGE_TIME = 200;
var CHARGE_SPEED = 6;

/*
 *  To emit data to the client (Broadband)
 */
function emiter( srct, x, y, err, errorStr, chargeStr ) {
    var emit_name = "scr103_mapie" + "_" + srct;

    var text = String(x) + "," + String(y) + ","+
        err + "," + errorStr + "," + chargeStr;
    sck_io.sockets.emit( emit_name, text );
}

/*
 *  Moving objects look like delayed
 */
function mover( stepo, trc, srct, callback ) {

    var err = 0;
    var errorStr = "";
    var timer = MOVE_TIME;
    var e_stepo = 0;

    if( stepo < trc.length ) {
        // ダミーでエラーを起こす
        var rand = Math.floor( Math.random() * 2000 );
        if( rand == 11 ) {
            err = rand;
            errorStr = "重故障";
            e_stepo = Math.floor( Math.random() * 100 );
            if( e_stepo < 20 ) e_stepo=20;
        }else if( rand == 1 ) {
            err = rand;
            errorStr = "非常停止";
            e_stepo = Math.floor( Math.random() * 50 );
            if( e_stepo < 20 ) e_stepo=20;
        }
        if( err ) {
            error_v( e_stepo, trc[stepo], srct, err, errorStr, function( ){ 
                    setTimeout( function() {
                            emiter( srct, trc[stepo][X], trc[stepo][Y], 0, "", "" );
                            stepo++;
                            mover( stepo, trc, srct, callback );
                        }, timer);
                });
        }else{
            setTimeout( function() {
                    emiter( srct, trc[stepo][X], trc[stepo][Y], 0, "", "" );
                    stepo++;
                    mover( stepo, trc, srct, callback );
                }, timer);
        }
    }else{
        // 終わり
        callback( stepo );
    }
}

function error_v( stepo, loc, srct, err, errorStr, callback ) {

    var timer = MOVE_TIME;

    if( stepo > 0 ) {
        setTimeout( function() {
                emiter( srct, loc[X], loc[Y], err, errorStr, "" );
                stepo--;
                error_v( stepo, loc, srct, err, errorStr, callback );
            }, timer);
    }else{
        // 終わり
        callback( stepo );
    }
}

function charge( stepo, loc, srct, callback ) {

    var err = 0;
    var errorStr = "";
    var chargeStr = "チャージ中 " + stepo + "%";
    //var chargeStr = stepo + "%";
    var chargeNum = 100;

    if( stepo <= chargeNum ) {
        setTimeout( function() {
                emiter( srct, loc[X], loc[Y], err, errorStr, chargeStr );
                stepo += CHARGE_SPEED;
                charge( stepo, loc, srct, callback );
            }, CHARGE_TIME);
    }else{
        // 終わり
        callback( stepo );
    }
}

/*
 *  ルート決定する
 */
function route( srct, sflc, prev, goal ) {

    var floc = [],
        tloc = [];
    var stepo = 0;


    if( sflc === goal ) {
        /*到着です*/
        stepo = 0;
        charge( stepo, sflc, srct, function( stepo ){
                if( goal === posi.laps01 ) {
                    goal = posi.jra001;
                    route( srct, posi.crs016, posi.laps01, goal );
                }else if( goal === posi.jra001 ) {
                    goal = posi.laps01;
                    route( srct, posi.sdm001, posi.jra001, goal );
                }else{
                    goal = posi.laps01;
                    route( srct, posi.sdm001, posi.jra001, goal );
                }
                return;
            } );
        return;
    }

    // 次の経路を決める
    for( var i = 0, imax = map_curent.length; i<imax; i++ ) {
        if( map_curent[i].posi[X] == sflc[X] && map_curent[i].posi[Y] == sflc[Y] ) {
            // goalに行きやすいように導く
            var rand = null, rand2;
            for( var j=0, jmax=map_curent[i].next.length; j<jmax; j++ ) {
                if( map_curent[i].next[j] === goal ) {
                    rand=j;
                    break;
                } 
            }
            if( rand == undefined || rand == null ) {
                if( goal === posi.laps01 ) {
                    if( 0 ) rand=0; /* dummy */
                    else if( sflc === posi.rts002 ) rand=0;
                    else if( sflc === posi.gdu002 ) rand=0;
                    else if( sflc === posi.gdu003 ) rand=0;
                    else if( sflc === posi.crs002 ) rand=2;
                    else if( sflc === posi.crs004 ) rand=3;
                    else if( sflc === posi.crs005 ) rand=2;
                    else if( sflc === posi.crs006 ) rand=0;
                    else if( sflc === posi.crs010 ) rand=1;
                    else if( sflc === posi.crs012 ) rand=3;
                    else if( sflc === posi.crs013 ) rand=0;
                    else if( sflc === posi.sdm002 ) rand=1;
                    else if( sflc === posi.odr002 ) rand=1;
                    else if( sflc === posi.odr003 ) rand=1;
                    else if( sflc === posi.odr004 ) rand=1;

                }else if( goal === posi.jra001 ) {
                    if( 0 ) rand=0; /* dummy */
                    else if( sflc === posi.rts002 ) rand=1;
                    else if( sflc === posi.gdu001 ) rand=3;
                    else if( sflc === posi.gdu003 ) rand=5;
                    else if( sflc === posi.crs002 ) rand=1;
                    else if( sflc === posi.crs003 ) rand=3;
                    else if( sflc === posi.crs004 ) rand=2;
                    else if( sflc === posi.crs006 ) rand=4;
                    else if( sflc === posi.crs010 ) rand=4;
                    else if( sflc === posi.crs013 ) rand=1;
                    else if( sflc === posi.crs015 ) rand=2;
                    else if( sflc === posi.odr002 ) rand=2;
                    else if( sflc === posi.odr003 ) rand=2;
                    else if( sflc === posi.odr004 ) rand=2;

                }
            }
            if( rand == undefined || rand == null ) {
                rand2 = Math.floor( Math.random() * map_curent[i].next.length );
            }
            floc = sflc;
            if( rand == undefined || rand == null ) {
                tloc = map_curent[i].next[rand2];
                if( tloc[X] == prev[X] && tloc[Y] == prev[Y] && map_curent[i].next.length > 1 ) {
                    //前に来たとこへは戻らないようにする
                    i=0;
                    continue;
                }
            }else{
                tloc = map_curent[i].next[rand];
            }
            break;
        }
    }

    // from-to間のプロットを作成する
    var trc = [];
    prot_map( floc, tloc, trc );

    // from-to を動かす
    stepo = 0;
    mover( stepo, trc, srct, function( stepo ){
            route( srct, tloc, sflc, goal );
        } );
}

/*
 * from-to間のプロットを決定する
 */
function prot_map( floc, tloc, trc ) {
    var lng=[],stp;
    var mst,slv;

    if( Math.abs( floc[X]-tloc[X] ) >= Math.abs( floc[Y]-tloc[Y] ) ) {
        mst = X;
        slv = Y;
    }else{
        mst = Y;
        slv = X;
    }
    stp = Math.floor( Math.abs( floc[mst]-tloc[mst] ) / BASE_PX );
    if( floc[mst] <= tloc[mst] ) {
        lng[mst] = BASE_PX;
    }else{
        lng[mst] = (-1) * BASE_PX;
    }
    if( !stp ) {
        lng[slv] = 0.0;
    }else{
        lng[slv] = ( tloc[slv]-floc[slv] ) / stp;
    }
    for( var j=0; j < stp; j++ ) {
        trc.push( [ Math.round( floc[X]+(lng[X]*j) ), Math.round( floc[Y]+(lng[Y]*j) ) ] );
    }
}

/**
 * 作業モニタ デモ/main routine
 * @module mgragv.main
 * @param  none
 * @date   25/jul/2012
 */
exports.main = function() {

    lcsAp.log('--- MgrAgv background process start');
    route( 1, posi.karasu, [-1,-1], posi.jra001);
    route( 2, posi.zaging, [-1,-1], posi.laps01);
    route( 3, posi.mzbank, [-1,-1], posi.jra001);
    //route( 4, posi.crs001, [-1,-1], posi.jra001);
    //route( 5, posi.crs004, [-1,-1], posi.jra001);
    //route( 6, posi.crs007, [-1,-1], posi.jra001);
    //route( 7, posi.crs010, [-1,-1], posi.jra001);
    //route( 8, posi.sdm002, [-1,-1], posi.jra001);
    //route( 9, posi.crs005, [-1,-1], posi.jra001);
    //route( 10, posi.crs006, [-1,-1], posi.jra001);

};
