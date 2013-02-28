var socket = io.connect("/error");
sockEventShowError(socket);

var socket122 = io.connect("/scr/122");

socket122.on("gauge01", function (data) {
   //debugXp(data);
   $("#gauge01").gauge('setValue',data.value);
});

socket122.on("gauge02", function (data) {
   //debugXp(data);
   $("#gauge02").gauge('setValue',data.value);
});

socket122.on("gauge03", function (data) {
   //debugXp(data);
   $("#gauge03").gauge('setValue',data.value);
});

socket122.on("gauge04", function (data) {
   //debugXp(data);
   $("#gauge04").gauge('setValue',data.value);
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
    $("#gauge01")
    .gauge({
        min: 0,
        max: 1000,
        label: 'TEST',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 9,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 200},
               {color: "#aaddee", from: 200, to: 600},
               {color: "#ffaa00", from: 600, to: 800},
               {color: "#ff0000", from: 800, to: 1000}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge02")
    .gauge({
        min: 0,
        max: 100,
        label: 'SUB1',
        unitsLabel: '',
        majorTicks: 6,
        minorTicks: 1,
        bands: [
               {color: "#ffffff", from: 0, to: 80},
               {color: "#ff0000", from: 80, to: 100}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge03")
    .gauge({
        min: 0,
        max: 10,
        label: 'SUB2',
        unitsLabel: '',
        majorTicks: 6,
        minorTicks: 1,
        bands: [
               {color: "#ffffff", from: 0, to: 4},
               {color: "#aaddee", from: 4, to: 8},
               {color: "#ff0000", from: 8, to: 10}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge04")
    .gauge({
        min: 0,
        max: 300,
        label: 'SUB3',
        unitsLabel: '',
        majorTicks: 16,
        minorTicks: 1,
        bands: [
               {color: "#ffffff", from: 0, to: 250},
               {color: "#ff0000", from: 250, to: 300}
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

});

