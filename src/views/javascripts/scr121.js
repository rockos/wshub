var socket = io.connect("/error");
sockEventShowError(socket);

var socket121 = io.connect("/scr/121");

var socket_unosrv = io.connect("http://rockos.co.jp:3012");

socket_unosrv.on("gauge01", function (data) {
   //debugXp(data);
   $("#gauge01").gauge('setValue',data.value);
});

socket121.on("gauge01", function (data) {
   //debugXp(data);
   $("#gauge01").gauge('setValue',data.value);
});

socket121.on("debugz", function (data) {
    //debugXp(data);
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
        label: '照度',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 4,
        bands: [
               {color: "#ffffff", from: 0, to: 200},
               {color: "#cccccc", from: 200, to: 600},
               {color: "#aaaaaa", from: 600, to: 800},
               {color: "#333333", from: 800, to: 1000}
               ]
    })
    .gauge('setValue', 0);
});

