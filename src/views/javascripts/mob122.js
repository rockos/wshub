var socket122 = io.connect("/scr/122");

socket122.on("gauge01", function (data) {
   //debugXp(data);
   $("#gauge01").gauge('setValue',data.value);
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



});

