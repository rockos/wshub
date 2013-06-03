var socket = io.connect("/error");
sockEventShowError(socket);

//var socket904 = io.connect("/scr/904");

//socket904.on("message", function (data) {
//
//});

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};
function debugXp2(obj) {
    var str = "";
    for (var i=0; i<obj.length; i++) {
        for (var key in obj[i]) {
           str += obj[i][key] + ",";        
        }
    }
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

$(function() {
    /* on loading */
    /*
    g1.dataInit(
        { id: "#graph2"
         ,margin:{
             top: 20
            ,right: 20
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 800
         ,HEIGHT: 300
         ,yMax: 100
         ,yText: ""
         ,dMax: 101
         ,color: {face:"#fff",back:"#000"}
         ,xxxx: "xxxx"
        }
    );
    g1.graphDraw();
    */
    /*
    var g2 = $.extend(true, {}, lcsBargraph);
    g2.id = "#graph3";
    g2.WIDTH = 250;
    g2.dMax = 31;
    g2.dataInit();
    g2.graphDraw();
    var scaleY = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);
    */
    $("#test1").bind("click", function(){
        test2test();
    });
});

function test2test() {
    /*
    if(gi >= xWide) {
        dataArr.shift();
    }
    dataArr.push({i:gi, val:parseInt(Math.random()*100)});
    if(gi >= xWide) {
        dataArr2.shift();
    }
    dataArr2.push({i:gi, val:parseInt(Math.random()*100)});
    gi++;
    if (gi>1000) {
        gi=0;
        return;
    }

    dataTable();
    lineGraphMove();

    g1.graphMove(parseInt(Math.random()*100),parseInt(Math.random()*100),parseInt(Math.random()*100)); 

    setTimeout(function(){
        test2test();
    },500);
    */
}

/**
 *  D3
 */
window.addEventListener("load", function(){
    /*
    for (var i=0; i < 100; i++) {
        dataArr[i] = { i:gi, val: parseInt(Math.random()*100)};
        //dataArr[i] = { i:gi, val: 0};
        gi++;
    }
    for (var i=0; i < 100; i++) {
        dataArr2[i] = { i:i, val: parseInt(Math.random()*100)};
    }
    */
    //barGraph();
    /*
    lcsBargraph.id = "#graph2";
    lcsBargraph.WIDTH = 250;
    lcsBargraph.dMax = 30;
    lcsBargraph.dataInit();
    lcsBargraph.graphDraw();
    */
    //lineGraph();
    //dataTable();
    var grp = rcsStaticGraph.create("#graph2");
    grp.setConfig("margin", { top: 30, right: 100, bottom: 40, left: 40 })
       .setConfig("width", 850)
       .setConfig("height", 300)
       .setConfig("legend", { draw: true, posiX: 750, posiY: 10 })
       .setConfig("color", { face: "#fff", back: "#000" })
       .setConfig("caption", {
           g: {text: "グラフ　テスト", color: "#fff", size: 14 },
           x: {text: "Ｘ軸", color: "#fff", size: 12 },
           y: {text: "Ｙ軸", color: "#fff", size: 12 }
       })
       .setConfig("yaxis", {
           min: 0,
           max: 100,
           text: "稼働率(%)",
           axis: { ticks: 5 },
           rule: { draw: true, ticks: 5 }
       })
       .setConfig("xaxis", {
           axis: { ticks: 20 }
       })
       .setConfig("dataAll", [
           {color: "#fff", width: 2, pointtype: "rect", pointsize: 8},
           {color: "skyblue", width: 2, pointtype: "rect", pointsize: 8},
           {color: "lightgreen", width: 2, pointtype: "rect", pointsize: 8},
           {color: "red", width: 2, pointtype: "rect", pointsize: 8}
       ])
       /*
       .setConfig("data", {
           index: 0, 
           color: "pink", 
           width: 3, 
           pointtype: "circle", 
           pointsize: 8
       })
       */
       .setCategorie(['2013/1','2013/2','2013/3','2013/4','2013/5','2013/6','2013/7','2013/8','2013/9','2013/10','2013/11','2013/12'])
       .setData([43,23,15,67,46,83,13,53,34,96,34,56], "Label-A")
       .setData([34,67,42,16,89,34,56,12,78,32,66,98], "Label-B")
       .setData([78,45,67,34,11,21,98,34,16,23,88,11], "Label-C")
       .setDraw()
       ;

    var bar = rcsDynamicBarGraph.create("#graph3");
    bar.setConfig("margin", { top: 30, right: 100, bottom: 40, left: 40 })
       .setConfig("width", 850)
       .setConfig("height", 300)
       .setConfig("legend", { draw: true, posiX: 750, posiY: 10 })
       .setConfig("color", { face: "#fff", back: "#000" })
       .setConfig("caption", {
           g: {text: "ダイナミック 棒グラフ", color: "#fff", size: 14 },
           x: {text: "Ｘ軸", color: "#fff", size: 12 },
           y: {text: "Ｙ軸", color: "#fff", size: 12 }
       })
       .setConfig("yaxis", {
           min: 0,
           max: 100,
           text: "稼働率(%)",
           axis: { ticks: 5 },
           rule: { draw: true, ticks: 5 }
       })
       .setConfig("xaxis", {
           max: 100,
           axis: { ticks: 20 },
           rule: { draw: true, ticks: 20 }
       })
       .setConfig("dataAll", [
           {use: true, color: "rgba(51,255,255,0.6)", width: 2},
           {use: true, color: "rgba(255,255,51,0.5)", width: 2},
           {use: false, color: "#4ff", width: 2}
       ])
       .setDraw();

    var BarTest = function() {
        bar.setMovePoint(
            [parseInt(Math.random()*100),
             parseInt(Math.random()*100)
        ]);
        setTimeout(function(){
            BarTest();
        },500);
    };
    BarTest();

    var lin2 = rcsDynamicLineGraph.create("#graph6");
    lin2.setDraw();

    var lin = rcsDynamicLineGraph.create("#graph4");
    lin.setConfig("margin", { top: 30, right: 100, bottom: 40, left: 40 })
       .setConfig("width", 850)
       .setConfig("height", 300)
       .setConfig("legend", { draw: true, posiX: 750, posiY: 10 })
       .setConfig("color", { face: "#fff", back: "#000" })
       .setConfig("caption", {
           g: {text: "ダイナミック折れ線グラフ", color: "#fff", size: 14 },
           x: {text: "Ｘ軸", color: "#fff", size: 12 },
           y: {text: "Ｙ軸", color: "#fff", size: 12 }
       })
       .setConfig("yaxis", {
           min: 0,
           max: 100,
           text: "稼働率(%)",
           axis: { ticks: 5 },
           rule: { draw: true, ticks: 5 }
       })
       .setConfig("xaxis", {
           max: 100,
           axis: { ticks: 20 },
           rule: { draw: true, ticks: 20 }
       })
       .setConfig("dataAll", [
           {use: true, color: "#fff", width: 2},
           {use: true, color: "#aff", width: 2},
           {use: true, color: "#faf", width: 2},
           {use: false, color: "#ffa", width: 2},
           {use: false, color: "#4ff", width: 2},
           {use: false, color: "#f4f", width: 2},
           {use: false, color: "#ff4", width: 2},
           {use: false, color: "#aaf", width: 2},
           {use: false, color: "#faa", width: 2},
           {use: false, color: "#afa", width: 2}
       ])
       .setDraw();

    var linTest = function() {
        lin.setMovePoint(
            [parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100),
             parseInt(Math.random()*100)
        ]);
        lin2.setMovePoint([parseInt(Math.random()*100)]);
        setTimeout(function(){
            linTest();
        },500);
    };
    linTest();

    var seg7 = rcs7seg.create("#graph5");
    seg7.setConfig("figure", 2)
        .setConfig("gap", 6)
        .setConfig("ratio", 3)
        .setConfig("color", { face: "#fff", back:"#000" });
    var test7seg = function(v) {
        seg7.setDraw(v);
        if (v==99) {v=0;}
        setTimeout(function(){
            v++;
            test7seg(v);
        },500);
    }
    test7seg(0);
    
},false);

