
function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

$(function() {
    /* on loading */
    var socket903 = io.connect("/scr/902");

    socket902.on("buttonEvent_01", function(data) {
    });
});
