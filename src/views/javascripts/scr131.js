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
var dataArr2 = [];
var gi = 0;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    WIDTH = 800,
    HEIGHT = 200,
    yMax = 100,
    yText = "aaa",
    width = WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom,
    xWide = 100;

var g1 = $.extend(true, {}, lcsLinegraph);

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
    var grp = lcsStaticGraph.create("#graph2");
    grp
    .setConfig({
        margin:{
            top: 30
            ,right: 100
            ,bottom: 40
            ,left: 40
        }
        ,WIDTH: 850
        ,HEIGHT: 300
        ,legend: {draw:true, posiX:750, posiY:10}
        ,yMax: 100
        ,yText: "稼働率(%)"
        ,color: {face:"#fff",back:"#000"}
        ,gCaption: {text: "グラフ　テスト", color: "#fff" }
        ,xCaption: {text: "Ｘ軸", color: "#fff" }
        ,yCaption: {text: "Ｙ軸", color: "#fff" }
    })
    .setCategorie(['2013/1','2013/2','2013/3','2013/4','2013/5','2013/6','2013/7','2013/8','2013/9','2013/10','2013/11','2013/12'])
    .setData([43,23,15,67,46,83,13,53,34,96,34,56], "Label-A")
    .setData([34,67,42,16,89,34,56,12,78,32,66,98], "Label-B")
    .setData([78,45,67,34,11,21,98,34,16,23,88,11], "Label-C")
    .draw()
    ;
    var grp2 = lcsStaticGraph.create("#graph3");
    grp2.setConfig({
        margin:{
            top: 40
            ,right: 60
            ,bottom: 30
            ,left: 40
        }
        ,WIDTH: 400
        ,HEIGHT: 200
        ,legend: {posiX:300, posiY:10}
        ,__height: 300
        ,yMax: 10
        ,yText: ""
        ,dMax: 101
        ,color: {face:"#000",back:"#fff"}
        ,caption: "グラフ　テスト"
        ,xxxx: "xxxx"
    });
    grp2.setCategorie(['blue','red','pink','sky','green']);
    grp2.setData([1,2,3,4,5], "Label-A");
    grp2.setData([2,3,4,5,6], "Label-B");
    grp2.draw();
    ;

    var seg7 = lcs7seg.create("#graph1");
    seg7.init({
        fig: 2,
        span: 6,
        ratio: 3,
        color: "#fff",
        backColor: "#000"
    });
    var test7seg = function(v) {
        seg7.draw(v);
        if (v==99) {v=0;}
        setTimeout(function(){
            v++;
            test7seg(v);
        },500);
    }
    test7seg(0);
    
    setTimeout(function(){
        grp.clear()
        .setCategorie(['2013/1','2013/2','2013/3','2013/4','2013/5','2013/6','2013/7','2013/8','2013/9','2013/10','2013/11','2013/12'])
        .setData([11,27,32,46,58,69,59,43,34,23,19,5], "Label-A")
        .setData([96,82,79,62,55,49,56,62,78,86,91,98], "Label-B")
        .draw();
    },5000);
    
},false);

/**
 *  Static graph
 */


/*
 *  折れ線グラフ
 */
var lineGraphMove = function() {
    var scaleX = d3.scale.linear()
        //.domain([0, dataArr.length])
        .domain([0, xWide])
        .range([0, width]);
    var scaleY = d3.scale.linear()
        .domain([0, 100])
        .range([height,0]);
    var line = d3.svg.line()
        .x(function(d,i) { return scaleX(i);})
        .y(function(d,i) { return scaleY(d.val);})
        .interpolate("linear");//点の繋ぎ方の指定

    d3.select("#graph1").selectAll("svg g path.line1")
        .attr("d", line(dataArr))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    d3.select("#graph1").selectAll("svg g path.line2")
        .attr("d", line(dataArr2))
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("fill", "none");
}
var lineGraph = function() {

    var canvas = d3.select("#graph1");
    var svg = canvas.append("svg")
        .attr("width",WIDTH)
        .attr("height",HEIGHT)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    /** 
     *  スケール
     */
    var scaleX = d3.scale.linear()
        .domain([0, xWide])
        .range([0, width]);
    var scaleY = d3.scale.linear()
        .domain([0, 100])
        .range([height,0]);
    /**
     *  メモリの指定
     */
    var xAxis = d3.svg.axis()
        .scale(scaleX)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(scaleY)
        .orient("left");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var ruleX = svg.selectAll("g.ruleX")
        .data(scaleX.ticks(20))
        .enter()
        .append("svg:g")
        .attr("class", "ruleX")
        .attr("transform", function(d) { return "translate(" + scaleX(d) + ",0)"; });
    ruleX.append("line")
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-dasharray", 2)
        .attr("shape-rendering", "crispEdges")
        ;
    /**
     *  Y軸 罫線
     */
    var rule = svg.selectAll("g.rule")
        .data(scaleY.ticks(5))
        .enter()
        .append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) { return "translate(0," + scaleY(d) + ")"; });
    rule.append("line")
        .attr("x2", width)
        .attr("stroke", "black")
        .attr("stroke-dasharray", 2)
        .attr("shape-rendering", "crispEdges");
    //area，lineオブジェクトでpath要素のd操作文字列を自動生成する．
    //areaによる塗りつぶし
    //var area = d3.svg.area()
    //    .x(function(d,i) { return scaleX(i) + 100/dataArr.length;})
    //    .y0(function(d,i) { return 190 - scaleY(d.val);})
    //    .y1(function(d,i) { return 190;});
    //svg.append("path")
    //    .attr("d", area(dataArr))
    //    .attr("fill", "aqua");
    //lineによる折れ線
    var line = d3.svg.line()
        .x(function(d,i) { return scaleX(i);})
        .y(function(d,i) { return scaleY(d.val);})
        .interpolate("linear");//点の繋ぎ方の指定
    svg.append("path")
        .attr("d", line(dataArr))
        .attr("class", "line1")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    svg.append("path")
        .attr("d", line(dataArr2))
        .attr("class", "line2")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("fill", "none");
}
/*
 *  table test
 */
var dataTable = function() {
    //table用のmatrixを作る
    var mtx = [];
    var i=0;
    var k=0;
    var submtx = [];
    var submtx2 = [];
    for (var j=0,jmax=dataArr.length; j<jmax; j++) {
        submtx.push(dataArr[j].i);
        submtx2.push(dataArr[j].val);
        k++;
        if(k==24 || j==jmax-1) {
            mtx[i] = [];
            for (var a=0,amax=submtx.length;a<amax;a++){mtx[i][a]=submtx[a];}
            mtx[i+1] = [];
            for (var a=0,amax=submtx2.length;a<amax;a++){mtx[i+1][a]=submtx2[a];}
            submtx.splice(0,25);
            submtx2.splice(0,25);
            k=0;
            i += 2;
        }
    }

    d3.select("#graph2").selectAll('table').remove();

    var tr = d3.select("#graph2").append("table").selectAll("tr")
        .data(mtx)
        .enter().append("tr");

    var td = tr.selectAll("td")
        .data(function(d) { return d; })
        .enter().append("td")
        .attr("style", "border:1px solid black")
        .text(function(d) { return d; });


/*
    var table = d3.select("#graph2").append("table");
    var tr = table
        //.selectAll("tr")
        //.data(dataArr)
        //.enter()
        //.attr("style", "border:1px solid black")
        .append("tr")
        .selectAll("tr")
        //.data(function(d){return d;})
        .data(dataArr)
        .enter()
        .append("td")
        .attr("style", "border:1px solid black")
        .text(function(d) { return d.i; });
    d3.select("#graph2 table")
        .append("tr")
        .selectAll("tr")
        .data(dataArr)
        .enter()
        .append("td")
        .attr("style", "border:1px solid black")
        .text(function(d) { return d.val; })
        ;
*/
}

var barGraph = function() {
    /**
     *  スケールの指定
     */
    var scaleX = d3.scale.linear()
        .domain([0, dataArr.length])
        .range([0, width]);
    var scaleY = d3.scale.linear()
        //.domain([0, d3.max(dataArr, function(d){return d.val;})])
        .domain([0, yMax])
        .range([height, 0]);
    /**
     *  メモリの指定
     */
    var xAxis = d3.svg.axis()
        .scale(scaleX)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(scaleY)
        .orient("left");
    /**
     *  描画するDIVのID
     */
    var graph1 = d3.select("#graph1");
    /**
     *  SVG Property
     */
    var svg = graph1.append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    /**
     *  X軸 
     */
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    /**
     *  Y軸 
     */
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yText);
    /**
     *  Y軸 罫線
     */
    var rule = svg.selectAll("g.rule")
        .data(scaleY.ticks(5))
        .enter()
        .append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) { return "translate(0," + scaleY(d) + ")"; });
    rule.append("line")
        .attr("x2", width);
    /**
     *  グラフ
     */
    svg.selectAll("rect")
        .data(dataArr)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i){return scaleX(i)})
        .attr("y", function(d) { return scaleY(d.val); })
        .attr("width", function(d, i){return width/dataArr.length})
        .attr("height", function(d) { return height - scaleY(d.val); });
        /*
        .attr("x", function(d, i){return scaleX(i)})
        .attr("y", function(d, i){return height - scaleY(d.val)})
        .attr("width", function(d, i){return width/dataArr.length})
        .attr("height", function(d, i){return scaleY(d.val)})
        */
}
