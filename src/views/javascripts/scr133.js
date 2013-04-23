var socket = io.connect("/error");
sockEventShowError(socket);

//var socket133 = io.connect("/scr/133");

//socket133.on("message", function (data) {
//
//});

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

$(function() {
    /* on loading */
});

