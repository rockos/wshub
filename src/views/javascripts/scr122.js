var socket = io.connect("/error");
sockEventShowError(socket);

var socket122 = io.connect("/scr/122");

//var g2 = $.extend(true, {}, lcsBargraph);
//var g3 = $.extend(true, {}, lcsBargraph);
//var g4 = $.extend(true, {}, lcsBargraph);
var LG1 = $.extend(true, {}, lcsLinegraph);

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
   $("#direction01").html( 
        data.str + ":" + data.value );
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
        max: 10,
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

    LG1.dataInit(
        { id: "#linegraph01"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 750
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

});

