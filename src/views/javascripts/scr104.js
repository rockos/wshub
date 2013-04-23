var LG1 = $.extend(true, {}, lcsLinegraph);
var BG1 = $.extend(true, {}, lcsBargraph);
var temp7seg = $.extend(true, {}, lcs7seg);
var work7seg = $.extend(true, {}, lcs7seg);

var socket = io.connect("/scr/104");

socket.on("scr104_tmplog", function (text) { 
    //document.getElementById("tmplog").innerHTML = text;
    //$("#tmplog").html(text);
    temp7seg.draw(text-0);

    LG1.graphMove(text);
    //bar_draw( text, 0, 0 );
});

socket.on("scr104_worklog", function (text) { 
    //document.getElementById("worklog").innerHTML = text;
    //$("#worklog").html(text);
    work7seg.draw(text-0);

    BG1.graphMove(text);
    //bar_draw( text, 1, 0 );
});

$(function() {
    LG1.dataInit(
        { id: "#linegraph01"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 750
         ,HEIGHT: 200
         ,yMax: 40
         ,yText: ""
         ,dMax: 101
         ,Xaxis: {ticks: 20}
         ,Yaxis: {ticks: 5}
         ,Xrule: {draw: true, ticks: 20}
         ,Yrule: {draw: true, ticks: 5}
         ,data1: {use: true, color: "#f29", width: 2}
         ,data2: {use: false, color: "#f29", width: 2}
         ,data3: {use: false, color: "#3b7", width: 2}
         ,color: {face: "#000", back: "#fff"}
        }
    );
    LG1.graphDraw();

    BG1.dataInit(
        { id: "#bargraph01"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 750
         ,HEIGHT: 200
         ,yMax: 100
         ,yText: ""
         ,dMax: 101
        }
    );
    BG1.graphDraw();

    temp7seg.init({
        "id": "#tmplog",
        "fig": 2,
        "ratio": 1.2,
        "backColor": "#f0f0f0",
        "color": "#f29"
    });
    work7seg.init({
        "id": "#worklog",
        "fig": 2,
        "ratio": 1.2,
        "backColor": "#f0f0f0",
        "color": "#4682b4"
    });
});


function canvas_test() {
//*グラフの座標データを格納*/
var drawbar = [[],[]];

//*Canvas node*/
var cvs = [];
//*Canvas context*/
var ctx = [];
//*Canvas context property"canvas"*/
var cv = [];

//*グラフ描画の準備が整えば"1"となる*/
var rdy = [0,0];

/*グラフ描画情報*/
var data = [{}];
data = [
{
    /*描画領域(Canvasのプロパティから取得)*/
    "w" : 0,
    "h" : 0,

    /*グラフ描画 幅、高さ*/
    "inr_w" : 600,
    "inr_h" : 150,

    /*グラフ上下左右 余白*/
    "top_sp" : 25,
    "bottom_sp" : 25,
    "right_sp" : 150,
    "left_sp" : 50,

    /*y軸情報*/
    "seq" : [ 
        {
        /*最低値*/
        "min" : 10,  
        /*最高値*/
        "max" : 40,  
        /*メモリスパン*/
        "span" : 10, 
        /*データ単位におけるメモリpx数(inr_h/max-min)*/
        "onevalPx" : 0
        } 
    ],

    /*x軸情報*/
    "base" : { 
        "min" : 0,  
        "max" : 100,  
        "span" : 10, 
        "onevalPx" : 0 
    },

    /*棒のスタイル*/
    "style" : [
        {
        /*枠線*/
        "stroke" : "rgb(0, 0, 0)",
        /*塗り潰し*/
        "fill" : "rgb(255, 0, 0)"
        }
    ],

    "zzz" : 0 /*end mark.*/
},
{
    /*描画領域(Canvasのプロパティから取得)*/
    "w" : 0,
    "h" : 0,

    /*グラフ描画 幅、高さ*/
    "inr_w" : 600,
    "inr_h" : 150,

    /*グラフ上下左右 余白*/
    "top_sp" : 25,
    "bottom_sp" : 25,
    "right_sp" : 150,
    "left_sp" : 50,

    /*y軸情報*/
    "seq" : [ 
        {
        /*最低値*/
        "min" : 00,  
        /*最高値*/
        "max" : 100,  
        /*メモリスパン*/
        "span" : 10, 
        /*データ単位におけるメモリpx数(inr_h/max-min)*/
        "onevalPx" : 0
        } 
    ],

    /*x軸情報*/
    "base" : { 
        "min" : 0,  
        "max" : 100,  
        "span" : 10, 
        "onevalPx" : 0 
    },

    /*棒のスタイル*/
    "style" : [
        {
        /*枠線*/
        "stroke" : "rgb(0, 0, 0)",
        /*塗り潰し*/
        "fill" : "rgb(0, 0, 255)"
        }
    ],

    "zzz" : 0 /*end mark.*/
}
];

/*
onload = function() {
    cvs[0] = document.getElementById("glp001");
    cvs[1] = document.getElementById("glp002");
    if( cvs[0].getContext ) {
        ctx[0] = cvs[0].getContext("2d");
        canvas_draw(0);
    }

    if( cvs[1].getContext ) {
        ctx[1] = cvs[1].getContext("2d");
        canvas_draw(1);
    }

};
*/
/**
 *  グラフ描画のための初期設定(枠や目盛りをつける)
 *  canvas_draw()
 *  p : canvasのエリア
 */
var canvas_draw = function(p) {

    /*描画領域の情報*/
    cv[p] = ctx[p].canvas;
    data[p].w = cv[p].width;
    data[p].h = cv[p].height;

    /*グラフの外周*/
    ctx[p].lineWidth = 2;
    ctx[p].strokeStyle = "rgb(0, 0, 0)";
    ctx[p].beginPath();
    ctx[p].moveTo( data[p].left_sp, data[p].top_sp );
    ctx[p].lineTo( data[p].left_sp, data[p].top_sp + data[p].inr_h  );
    ctx[p].lineTo( data[p].left_sp + data[p].inr_w, data[p].top_sp + data[p].inr_h  );
    ctx[p].lineTo( data[p].left_sp + data[p].inr_w, data[p].top_sp  );
    ctx[p].closePath();
    ctx[p].stroke();

    /* y-軸 */
    for( var i=0, lim=data[p].seq.length; i < lim; i++ ) {
        ctx[p].font = "bold 12px 'ＭＳ 明朝'";
        ctx[p].textBaseline = "middle";

        if( i==1 ) {
            ctx[p].textAlign = "end";
            ctx[p].fillText( data[p].seq[i].min, data[p].left_sp - 5, data[p].top_sp + data[p].inr_h  );
            ctx[p].fillText( data[p].seq[i].max, data[p].left_sp - 5, data[p].top_sp  );
        }else{
            ctx[p].textAlign = "start";
            ctx[p].fillText( 
                data[p].seq[i].min, 
                data[p].left_sp + data[p].inr_w + 5 + (i*20), 
                data[p].top_sp + data[p].inr_h  );
            ctx[p].fillText( data[p].seq[i].max, data[p].left_sp + data[p].inr_w + 5 + (i*20), data[p].top_sp );
        }

        var min = data[p].seq[i].min,
            max = data[p].seq[i].max;
        data[p].seq[i].onevalPx = data[p].inr_h/(max-min);

        ctx[p].font = "normal 10px 'ＭＳ ゴシック'";
        ctx[p].textBaseline = "middle";
        for( var j = min+data[p].seq[i].span; j < max; j+=data[p].seq[i].span ) {
            if( i==1 ) {
                ctx[p].fillText( j, 
                    data[p].left_sp - 5, 
                    data[p].top_sp + data[p].inr_h - ((j-min)*data[p].seq[i].onevalPx)  );
            }else{
                ctx[p].fillText( j, 
                    data[p].left_sp + data[p].inr_w + 5 + (i*20), 
                    data[p].top_sp + data[p].inr_h - ((j-min)*data[p].seq[i].onevalPx)  );
            }
        }
    }

    /* x-軸 */
    ctx[p].font = "bold 12px 'ＭＳ 明朝'";
    ctx[p].textBaseline = "top";

    ctx[p].textAlign = "center";
    ctx[p].fillText( data[p].base.min, data[p].left_sp + data[p].inr_w , data[p].top_sp + data[p].inr_h +3  );
    ctx[p].fillText( data[p].base.max, data[p].left_sp, data[p].top_sp + data[p].inr_h +3  );

    var xmin = data[p].base.min,
        xmax = data[p].base.max;
    data[p].base.onevalPx = data[p].inr_w/(xmax-xmin);

    ctx[p].font = "normal 10px 'ＭＳ ゴシック'";
    for( var j = xmin+data[p].base.span; j < xmax; j+=data[p].base.span ) {
        ctx[p].fillText( j, 
            data[p].left_sp + data[p].inr_w - ((j-xmin)*data[p].base.onevalPx), 
            data[p].top_sp + data[p].inr_h +3 );
    }

    /*グラフ座標情報(drawbar)の初期化 (配列の領域を作成する)*/
    for( var i=0, max=data[p].base.max; i<max; i++ ) {
        var tmp = {
            "x": data[p].left_sp + data[p].inr_w - (data[p].base.onevalPx*(i+1)),
            "y": data[p].top_sp + data[p].inr_h,
            "w": data[p].base.onevalPx,
            "h": 0
        };
        drawbar[p].push(tmp);
    }

    rdy[p] = 1;
}

/**
 *  棒グラフを描画する
 *  bar_draw()
 *  text : データの値(もちろん数字であること 型は文字列で良い)
 *  p    : canvasのエリアに対応
 *  type : deta.seqの配列番号に対応
 */
var bar_draw = function(text,p,type) {

    if( type < 0 || type >= data[p].seq.length ) return;

    if(ctx[p] && rdy[p]) {
        ctx[p].strokeStyle = data[p].style[type].stroke;
        ctx[p].fillStyle = data[p].style[type].fill;

        drawbar[p][0].y = data[p].top_sp + data[p].inr_h - 
                          ( parseInt(text) - data[p].seq[type].min ) * data[p].seq[type].onevalPx;
        drawbar[p][0].h = ( parseInt(text) - data[p].seq[type].min ) * data[p].seq[type].onevalPx;

        var els_y = data[p].top_sp,
            els_h = data[p].inr_h;
        /*描画*/
        for( var i=0,max=data[p].base.max; i<max; i++ ) {
            ctx[p].clearRect(drawbar[p][i].x, els_y, drawbar[p][i].w, els_h);
            ctx[p].fillRect(drawbar[p][i].x, drawbar[p][i].y, drawbar[p][i].w, drawbar[p][i].h);
            ctx[p].strokeRect(drawbar[p][i].x, drawbar[p][i].y, drawbar[p][i].w, drawbar[p][i].h);
        }

        /*グラフデータをシフトする*/
        for( var i=data[p].base.max-1, min=0; i>=min; i-- ) {
            if( i===0 ) {
                drawbar[p][i].y = data[p].top_sp + data[p].inr_h;
                drawbar[p][i].h = 0;
            }else{
                drawbar[p][i].y = drawbar[p][i-1].y;
                drawbar[p][i].h = drawbar[p][i-1].h;
            }
        }
    }
}
}


