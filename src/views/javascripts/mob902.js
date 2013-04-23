
var socket902 = io.connect("/scr/902");
var g1 = $.extend(true, {}, lcsLinegraph);
var v7seg = $.extend(true, {}, lcs7seg);
var h7seg = $.extend(true, {}, lcs7seg);

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

socket902.on("graph01", function (data) {
   //debugXp(data);
   g1.graphMove(data.value,data.value2,data.value3);
});

socket902.on("crane_mob01_1", function (data) {
   var data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if ($('#cr01').attr('checked') != 'checked') {
       return;
   }
   //debugXp(data);
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.local_switch.value == "1") {
       data_theme = "ui-btn-up-g";
   }
   $("#craneSw a:nth-child(1)").removeClass("ui-btn-up-g ui-btn-up-h");
   $("#craneSw a:nth-child(1)").addClass(data_theme);
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.local_switch.value == "0") {
       data_theme = "ui-btn-up-f";
   }
   $("#craneSw a:nth-child(2)").removeClass("ui-btn-up-f ui-btn-up-h");
   $("#craneSw a:nth-child(2)").addClass(data_theme);
   
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.status.value == "1") {
       data_theme = "ui-btn-up-g";
   }
   $("#craneStat a:nth-child(1)").removeClass("ui-btn-up-g ui-btn-up-h");
   $("#craneStat a:nth-child(1)").addClass(data_theme);
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.status.value == "9") {
       data_theme = "ui-btn-up-f";
   }
   $("#craneStat a:nth-child(2)").removeClass("ui-btn-up-f ui-btn-up-h");
   $("#craneStat a:nth-child(2)").addClass(data_theme);
});

socket902.on("crane_mob01_2", function (data) {
   var data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if ($('#cr02').attr('checked') != 'checked') {
       return;
   }
   //debugXp(data);
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.local_switch.value == "1") {
       data_theme = "ui-btn-up-g";
   }
   $("#craneSw a:nth-child(1)").removeClass("ui-btn-up-g ui-btn-up-h");
   $("#craneSw a:nth-child(1)").addClass(data_theme);
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.local_switch.value == "0") {
       data_theme = "ui-btn-up-f";
   }
   $("#craneSw a:nth-child(2)").removeClass("ui-btn-up-f ui-btn-up-h");
   $("#craneSw a:nth-child(2)").addClass(data_theme);
   
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.status.value == "1") {
       data_theme = "ui-btn-up-g";
   }
   $("#craneStat a:nth-child(1)").removeClass("ui-btn-up-g ui-btn-up-h");
   $("#craneStat a:nth-child(1)").addClass(data_theme);
   data_theme = "ui-btn-up-h"; // h:gray f:red g:blue
   if (data.status.value == "9") {
       data_theme = "ui-btn-up-f";
   }
   $("#craneStat a:nth-child(2)").removeClass("ui-btn-up-f ui-btn-up-h");
   $("#craneStat a:nth-child(2)").addClass(data_theme);
});

socket902.on("crane_mob02_1", function (data) {
   //debugXp(data);
   if ($('#cr01').attr('checked') != 'checked') {
       return;
   }
   /*
   $("#craneHo").html(
       data.h_range
   );
   $("#craneVt").html(
       data.v_range
   );
   */
   h7seg.draw(data.h_range-0);
   v7seg.draw(data.v_range-0);
});

socket902.on("crane_mob02_2", function (data) {
   //debugXp(data);
   if ($('#cr02').attr('checked') != 'checked') {
       return;
   }
   /*
   $("#craneHo").html(
       data.h_range
   );
   $("#craneVt").html(
       data.v_range
   );
   */
   h7seg.draw(data.h_range-0);
   v7seg.draw(data.v_range-0);
});

$(function() {
    /* on loading */
    socket902.on("buttonEvent_01", function(data) {
    });

    g1.dataInit(
        { id: "#graph01"
         ,margin:{
             top: 5
            ,right: 10
            ,bottom: 20
            ,left: 40
          }
         ,WIDTH: 280
         ,HEIGHT: 110
         ,yMax: 200
         ,yText: ""
         ,dMax: 31
         ,Xaxis: {ticks: 5}
         ,Yaxis: {ticks: 5}
         ,Xrule: {draw: true, ticks: 5}
         ,Yrule: {draw: true, ticks: 5}
         ,data1: {use: true, color: "#00f", width: 2}
         ,data2: {use: true, color: "#f29", width: 2}
         ,data3: {use: true, color: "#3b7", width: 2}
         ,color: {face: "#fff", back: "#333"}
        }
    );
    g1.graphDraw();

    h7seg.init({
        "id": "#H7seg",
        "fig": 4,
        "ratio": 0.4,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    v7seg.init({
        "id": "#V7seg",
        "fig": 4,
        "ratio": 0.4,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
});


