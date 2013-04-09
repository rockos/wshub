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
var gi = 0;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    WIDTH = 800,
    HEIGHT = 200,
    yMax = 100,
    yText = "aaa",
    width = WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom;

$(function() {
    /* on loading */
    var g1 = $.extend(true, {}, lcsBargraph);
    g1.id = "#graph2";
    g1.WIDTH = 250;
    g1.dMax = 31;
    g1.dataInit();
    g1.graphDraw();
    var g2 = $.extend(true, {}, lcsBargraph);
    g2.id = "#graph3";
    g2.WIDTH = 250;
    g2.dMax = 31;
    g2.dataInit();
    g2.graphDraw();
    var scaleY = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);
    $("#test1").bind("click", function(){
        dataArr.shift();
        dataArr.push({i:gi, val:parseInt(Math.random()*100)});
        gi++;
        //debugXp2(dataArr);
        // @bar modify
        d3.selectAll('#graph1 rect')
            .data(dataArr)
            //.transition()
            //.ease('bounce')
            .attr("y", function(d) { return scaleY(d.val); })
            .attr("height", function(d) { return height - scaleY(d.val); });

        g1.graphMove(parseInt(Math.random()*100));
        g2.graphMove(parseInt(Math.random()*100));
        // @line modify
        /*
        var line = d3.svg.line()
            .x(function(d,i) { return scaleX(i) + 100/dataArr.length;})
            .y(function(d,i) { return 190 - scaleY(d.val);})
            .interpolate("linear");//点の繋ぎ方の指定
        d3.selectAll("#graph2 path")
            .attr("d", line(dataArr))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        */
    });
});

/**
 *  D3
 */
window.addEventListener("load", function(){
    for (var i=0; i < 100; i++) {
        //dataArr[i] = { i:gi, val: parseInt(Math.random()*100)};
        dataArr[i] = { i:gi, val: 0};
        gi++;
    }
    barGraph();
    /*
    lcsBargraph.id = "#graph2";
    lcsBargraph.WIDTH = 250;
    lcsBargraph.dMax = 30;
    lcsBargraph.dataInit();
    lcsBargraph.graphDraw();
    */
    //lineGraph();
    //dataTable();
},false);

/**
 *   棒グラフ
 */
var lcsBargraph = {
    // Paramaters
    id: "#graph2",
    margin: {top: 20, right: 20, bottom: 30, left: 40},
    WIDTH: 800,
    HEIGHT: 200,
    yMax: 100,
    yText: "",
    width: this.WIDTH - this.margin.left - this.margin.right,
    height: this.HEIGHT - this.margin.top - this.margin.bottom,
    dMax: 100,
    // data
    dataArr: [],
    gi: 0,

    dataInit: function() {
        for (var i = 0; i < this.dMax; i++) {
            this.dataArr[i] = { i:i, val: 0};
            this.gi++;
        }
        this.width = this.WIDTH - this.margin.left - this.margin.right;
        this.height = this.HEIGHT - this.margin.top - this.margin.bottom;
    },
    graphDraw: function() {
        //debugXp2(this.dataArr);
        var www = this.width,
            hhh = this.height,
            lll = this.dataArr.length;
        /**
         *  スケールの指定
         */
        var scaleX = d3.scale.linear()
            .domain([this.dataArr.length-1, -1])
            .range([0, this.width]);
        var scaleY = d3.scale.linear()
            .domain([0, this.yMax])
            .range([this.height, 0]);
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
        var graph1 = d3.select(this.id);
        /**
         *  SVG Property
         */
        var svg = graph1.append("svg")
            .attr("width", this.WIDTH)
            .attr("height", this.HEIGHT)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
            .style("font","10px sans-serif");
        /**
         *  X軸 
         */
        svg.append("g")
            //.attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering","crispEdges")
            .call(xAxis);
        /**
         *  Y軸 
         */
        svg.append("g")
            //.attr("class", "y axis")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering","crispEdges")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.yText);
        /**
         *  Y軸 罫線
         */
        var rule = svg.selectAll("g.rule")
            .data(scaleY.ticks(5))
            .enter()
            .append("g")
            //.attr("class", "rule")
            .style("fill", "none")
            .style("stroke", "#000")
            .attr("transform", function(d) { return "translate(0," + scaleY(d) + ")"; });
        rule.append("line")
            .attr("x2", this.width);
        /**
         *  グラフ
         */
        svg.selectAll("rect")
            .data(this.dataArr)
            .enter()
            .append("rect")
            //.attr("class", "bar")
            .style("fill", "steelblue")
            .style("stroke", "#fff")
            .attr("x", function(d, i){return scaleX(i)})
            .attr("y", function(d) { return scaleY(d.val); })
            .attr("width", function(d, i){return www/lll; })
            .attr("height", function(d) { return hhh - scaleY(d.val); });
    },
    graphMove: function(v) {
        var www = this.width,
            hhh = this.height,
            lll = this.dataArr.length;
        this.dataArr.pop();
        this.dataArr.unshift({i:0, val:v});
        //this.gi++;
        var scaleY = d3.scale.linear()
            .domain([0, this.yMax])
            .range([this.height, 0]);
        d3.selectAll(this.id + ' rect')
            .data(this.dataArr)
            .attr("y", function(d) { return scaleY(d.val); })
            .attr("height", function(d) { return hhh - scaleY(d.val); });
    }

};




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
/*
 *  折れ線グラフ
 */
var lineGraph = function() {
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
    //var area = d3.svg.area()
    //    .x(function(d,i) { return scaleX(i) + 100/dataArr.length;})
    //    .y0(function(d,i) { return 190 - scaleY(d.val);})
    //    .y1(function(d,i) { return 190;});
    //svg.append("path")
    //    .attr("d", area(dataArr))
    //    .attr("fill", "aqua");
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
var dataTable = function() {
    var table = d3.select("#graph3");
    var tr = table.append("table")
        .selectAll("tr")
        .data(dataArr)
        .enter()
        .append("tr");
    var td = tr.selectAll("td")
        .data(dataArr)//function(d) { return d.val; })
        .enter()
        .append("td")
        .text(function(d) { return d.val; });

}

