var socket = io.connect("/error");
sockEventShowError(socket);

var socket122 = io.connect("/scr/122");

//var g2 = $.extend(true, {}, lcsBargraph);
//var g3 = $.extend(true, {}, lcsBargraph);
//var g4 = $.extend(true, {}, lcsBargraph);
var LG1 = $.extend(true, {}, lcsLinegraph);
var drc7 = $.extend(true, {}, lcs7seg);
var run7 = $.extend(true, {}, lcs7seg);
var vat7 = $.extend(true, {}, lcs7seg);
var num7 = $.extend(true, {}, lcs7seg);
var runs7 = $.extend(true, {}, lcs7seg);
var vats7 = $.extend(true, {}, lcs7seg);

/*
socket122.on("gauge01", function (data) {
   //debugXp(data);
   $("#gauge01").gauge('setValue',data.value);
});
*/

socket122.on("gauge02", function (data) {
   //debugXp(data);
   $("#gauge02").gauge('setValue',data.value);
   //g2.graphMove(data.value);
});

socket122.on("gauge03", function (data) {
   //debugXp(data);
   $("#gauge03").gauge('setValue',data.value);
   //g3.graphMove(data.value);
});

socket122.on("gauge04", function (data) {
   //debugXp(data);
   $("#gauge04").gauge('setValue',data.value);
   //g4.graphMove(data.value);
});

socket122.on("graph01", function (data) {
   //debugXp(data);
   LG1.graphMove(data.valueX,data.valueY,data.valueZ);
});

socket122.on("direction01", function (data) {
   //debugXp(data);
   drc7.draw(data.value-0);
   $("#machineView span.drcstr").html( 
        data.str );
});

socket122.on("machine01", function (data) {
   //debugXp(data.status +"|"+data.act);
   if (data.status == 1) {
       $("#machineOL_ON").attr("checked",true);
   } else {
       $("#machineOL_OFF").attr("checked",true);
   }
   if (data.act == 1) {
       $("#machineST_BUSY").attr("checked", true);
   } else if (data.act == 0) {
       $("#machineST_IDLE").attr("checked", true);
   } else {
       $("#machineST_EROR").attr("checked", true);
   }
   $('#machineOL').buttonset();
   $('#machineST').buttonset();
});

socket122.on("machine02", function (data) {
    run7.draw(data.run-0);
    vat7.draw(data.vat-0);
    num7.draw(data.num-0);
    runs7.draw(data.runs-0);
    vats7.draw(data.vats-0);
});


socket122.on("debugz", function (data) {
    debugXp(data);
});

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

$(function() {
    /* on loading */
    /*
    $("#gauge01")
    .gauge({
        min: 0,
        max: 5000,
        label: 'TEST',
        unitsLabel: '',
        majorTicks: 6,
        minorTicks: 9,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 5000}
               /*
               {color: "#ffffff", from: 0, to: 200},
               {color: "#aaddee", from: 200, to: 600},
               {color: "#ffaa00", from: 600, to: 800},
               {color: "#ff0000", from: 800, to: 1000}
               *
               ]
    })
    .gauge('setValue', 0);
    */

    $("#gauge02")
    .gauge({
        min: 0,
        max: 1000,
        label: 'X',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 1000}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge03")
    .gauge({
        min: 0,
        max: 1000,
        label: 'Y',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 1000}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge04")
    .gauge({
        min: 0,
        max: 1000,
        label: 'Z',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 1000}
               ]
    })
    .gauge('setValue', 0);

    $('#slider01').slider({
        min: 0,
        max: 100,
        animate: "fast",
        range: "min",
        value: $('#slider01Value').html(),
        change: function(event, ui){
            $('#slider01Value').html(ui.value);
            socket122.emit("accel01", {"value": ui.value});
        },
        slide: function(event, ui){
            $('#slider01Value').html(ui.value);
        }
    });

    $('#slider02').slider({
        min: 0,
        max: 100,
        animate: "fast",
        range: "min",
        value: $('#slider02Value').html(),
        change: function(event, ui){
            $('#slider02Value').html(ui.value);
            socket122.emit("accel02", {"value": ui.value});
        },
        slide: function(event, ui){
            $('#slider02Value').html(ui.value);
        }
    });

    $('#slider03').slider({
        min: 0,
        max: 300,
        animate: "fast",
        range: "min",
        value: $('#slider03Value').html(),
        change: function(event, ui){
            $('#slider03Value').html(ui.value);
            socket122.emit("accel03", {"value": ui.value});
        },
        slide: function(event, ui){
            $('#slider03Value').html(ui.value);
        }
    });

    $('#machineSw').buttonset({
    });

    $("#machineSw-auto").bind("click", function(){
        socket122.emit("swChange", {"status": 1});
    });
    $("#machineSw-manu").bind("click", function(){
        socket122.emit("swChange", {"status": 2});
    });
    $("#machineSw-mnte").bind("click", function(){
        socket122.emit("swChange", {"status": 0});
    });

    $('#machineOL').buttonset({
        disabled: false
    });

    $('#machineST').buttonset({
        disabled: false
    });

    LG1.dataInit(
        { id: "#linegraph01"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 850
         ,HEIGHT: 150
         ,yMax: 1000
         ,yText: ""
         ,dMax: 101
         ,Xaxis: {ticks: 20}
         ,Yaxis: {ticks: 5}
         ,Xrule: {draw: true, ticks: 20}
         ,Yrule: {draw: true, ticks: 5}
         ,data1: {use: true, color: "#00f", width: 2}
         ,data2: {use: true, color: "#f29", width: 2}
         ,data3: {use: true, color: "#3b7", width: 2}
         ,color: {face: "#fff", back: "#333"}
        }
    );
    LG1.graphDraw();
    /*
    g2.dataInit(
        { id: "#bargraph02"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 250
         ,HEIGHT: 150
         ,yMax: 1000
         ,yText: ""
         ,dMax: 31
        }
    );
    g2.graphDraw();
    
    g3.dataInit(
        { id: "#bargraph03"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 250
         ,HEIGHT: 150
         ,yMax: 1000
         ,yText: ""
         ,dMax: 31
        }
    );
    g3.graphDraw();

    g4.dataInit(
        { id: "#bargraph04"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 250
         ,HEIGHT: 150
         ,yMax: 1000
         ,yText: ""
         ,dMax: 31
        }
    );
    g4.graphDraw();
    */

    drc7.init({
        "id": "#machineView div.drc",
        "fig": 3,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    drc7.draw(0);

    run7.init({
        "id": "#machineView div.run",
        "fig": 7,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    run7.draw(0);

    vat7.init({
        "id": "#machineView div.vat",
        "fig": 7,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    vat7.draw(0);

    num7.init({
        "id": "#machineView div.num",
        "fig": 7,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    num7.draw(0);

    runs7.init({
        "id": "#machineView div.runs",
        "fig": 7,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    runs7.draw(0);

    vats7.init({
        "id": "#machineView div.vats",
        "fig": 7,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    vats7.draw(0);
});

