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

var dataArr = [];

$(function() {
    /* on loading */
    var scaleY = d3.scale.linear()
        //.domain([0, d3.max(dataArr, function(d){return d.val;})])
        .domain([0, 100])
        .range([0,180]);
    $("#test1").bind("click", function(){
        dataArr.shift();
        dataArr.push({val:parseInt(Math.random()*100)});
        //debugXp2(dataArr);
        d3.selectAll('#graph1 rect')
            .data(dataArr)
            //.transition()
            //.ease('bounce')
            .attr("y", function(d, i){return 190 - scaleY(d.val)})
            .attr("height", function(d, i){return scaleY(d.val)});
        d3.selectAll('#graph2').line()
            .y(function(d,i) { return 190 - scaleY(d.val);})
            .interpolate("linear")//点の繋ぎ方の指定
        .append("path")
        .attr("d", line(dataArr))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    });
});

/**
 *  D3
 */
window.addEventListener("load", function(){
    for (var i=0; i < 100; i++) {
        dataArr[i] = { val: parseInt(Math.random()*100)};
    }
    barGraph();
    oreGraph();
},false);

/*
 *   棒グラフ
 **/
var barGraph = function() {
    var scaleX = d3.scale.linear()
        .domain([0, dataArr.length])
        .range([0, 800]);
    var scaleY = d3.scale.linear()
        //.domain([0, d3.max(dataArr, function(d){return d.val;})])
        .domain([0, 100])
        .range([0,180]);
    var canvas = d3.select("#graph1");
    var svg = canvas.append("svg")
        .attr("width",800)
        .attr("height",200)
        .attr("shape-rendering", "crispEdges");    
    svg.selectAll("rect")
        .data(dataArr)
        .enter()
        .append("rect")
        .attr("x", function(d, i){return scaleX(i) + 25/dataArr.length})
        .attr("y", function(d, i){return 190 - scaleY(d.val)})
        .attr("width", function(d, i){return 800/dataArr.length})
        .attr("height", function(d, i){return scaleY(d.val)})
        .attr("fill", function(d, i){return "blue"});
}
var oreGraph = function() {
    var canvas = d3.select("#graph2");
    var svg = canvas.append("svg")
    .attr("width",800)
    .attr("height",200);
    var scaleX = d3.scale.linear()
    .domain([0, dataArr.length])
    .range([0, 800]);
    var scaleY = d3.scale.linear()
    .domain([0, 100])
    .range([0,180]);
    //area，lineオブジェクトでpath要素のd操作文字列を自動生成する．
    //areaによる塗りつぶし
    var area = d3.svg.area()
    .x(function(d,i) { return scaleX(i) + 100/dataArr.length;})
    .y0(function(d,i) { return 190 - scaleY(d.val);})
    .y1(function(d,i) { return 190;});
    svg.append("path")
    .attr("d", area(dataArr))
    .attr("fill", "aqua");
    //lineによる折れ線
    var line = d3.svg.line()
    .x(function(d,i) { return scaleX(i) + 100/dataArr.length;})
    .y(function(d,i) { return 190 - scaleY(d.val);})
    .interpolate("linear");//点の繋ぎ方の指定
    svg.append("path")
    .attr("d", line(dataArr))
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

}
