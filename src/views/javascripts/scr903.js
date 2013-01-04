var socket = io.connect("/error");
sockEventShowError(socket);

var socket903 = io.connect("/scr/903");

socket903.on("message_bar", function (data) {
    err = document.getElementById("mesg_bar");
    err.className = "mesg_bar " + data.color;
    err.innerText = data.mesg;
});

socket903.on("buttonEvent_01", function(data) {
    for (var key in data) {
        if (key == 'value_v') {
            $('#opeMachine tbody tr:nth-child(3) td:nth-child(4)').html(data[key]);
        }
        if (key == 'value_h') {
            $('#opeMachine tbody tr:nth-child(4) td:nth-child(2)').html(data[key]);
        }
        if (key == 'limit') {
            if (data.move == 1) {
                if (data.limit == 1) {
                    $('#opeMachine tbody tr:nth-child(1) td:nth-child(3) div').addClass("limit");
                } else {
                    $('#opeMachine tbody tr:nth-child(1) td:nth-child(3) div').removeClass("limit");
                }
            }
            if (data.move == 2) {
                if (data.limit == 1) {
                    $('#opeMachine tbody tr:nth-child(6) td:nth-child(3) div').addClass("limit");
                } else {
                    $('#opeMachine tbody tr:nth-child(6) td:nth-child(3) div').removeClass("limit");
                }
            }
            if (data.move == 4) {
                if (data.limit == 1) {
                    $('#opeMachine tbody tr:nth-child(3) td:nth-child(1) div').addClass("limit");
                } else {
                    $('#opeMachine tbody tr:nth-child(3) td:nth-child(1) div').removeClass("limit");
                }
            }
            if (data.move == 8) {
                if (data.limit == 1) {
                    $('#opeMachine tbody tr:nth-child(3) td:nth-child(6) div').addClass("limit");
                } else {
                    $('#opeMachine tbody tr:nth-child(3) td:nth-child(6) div').removeClass("limit");
                }
            }
        }
        if (key == 'color') {
            if (data.move == 1) {
                if (data.color == 1) {
                    $('#opeMachine #craneUp').addClass("move");
                } else {
                    $('#opeMachine #craneUp').removeClass("move");
                }
            }
            if (data.move == 2) {
                if (data.color == 1) {
                    $('#opeMachine #craneDown').addClass("move");
                } else {
                    $('#opeMachine #craneDown').removeClass("move");
                }
            }
            if (data.move == 4) {
                if (data.color == 1) {
                    $('#opeMachine #craneFore').addClass("move");
                } else {
                    $('#opeMachine #craneFore').removeClass("move");
                }
            }
            if (data.move == 8) {
                if (data.color == 1) {
                    $('#opeMachine #craneBack').addClass("move");
                } else {
                    $('#opeMachine #craneBack').removeClass("move");
                }
            }
        }
    }/* for(key in data) */
});

socket903.on("buttonEvent_02", function(data) {
    for (var key in data) {
        if (key == 'value_h') {
            $('#opeMachine-2 tbody tr:nth-child(1) td:nth-child(4)').html(data[key]);
        }
        if (key == 'limit') {
            if (data.move == 1) {
                if (data.limit == 1) {
                    $('#opeMachine-2 tbody tr:nth-child(1) td:nth-child(1) div').addClass("limit");
                } else {
                    $('#opeMachine-2 tbody tr:nth-child(1) td:nth-child(1) div').removeClass("limit");
                }
            }
            if (data.move == 2) {
                if (data.limit == 1) {
                    $('#opeMachine-2 tbody tr:nth-child(1) td:nth-child(6) div').addClass("limit");
                } else {
                    $('#opeMachine-2 tbody tr:nth-child(1) td:nth-child(6) div').removeClass("limit");
                }
            }
        }
        if (key == 'color') {
            if (data.move == 1) {
                if (data.color == 1) {
                    $('#opeMachine-2 #cartFore').addClass("move");
                } else {
                    $('#opeMachine-2 #cartFore').removeClass("move");
                }
            }
            if (data.move == 2) {
                if (data.color == 1) {
                    $('#opeMachine-2 #cartBack').addClass("move");
                } else {
                    $('#opeMachine-2 #cartBack').removeClass("move");
                }
            }
        }
    }/* for(key in data) */
});

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

$(function() {
    /* on loading */
    $("#craneUp").bind( {
        "mousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "UP"
                ,"event": "ON"
            });
            //debugXp("Up ON");
        }
        ,"mouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "UP"
                ,"event": "OFF"
            });
            //debugXp("Up OFF");
        }
    });
    $("#craneDown").bind( {
        "mousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "DOWN"
                ,"event": "ON"
            });
            //debugXp("Down ON");
        }
        ,"mouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "DOWN"
                ,"event": "OFF"
            });
            //debugXp("Down OFF");
        }
    });
    $("#craneFore").bind( {
        "mousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "FORE"
                ,"event": "ON"
            });
            //debugXp("Left ON");
        }
        ,"mouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "FORE"
                ,"event": "OFF"
            });
            //debugXp("Left OFF");
        }
    });
    $("#craneBack").bind( {
        "mousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "BACK"
                ,"event": "ON"
            });
            //debugXp("Right ON");
        }
        ,"mouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "BACK"
                ,"event": "OFF"
            });
            //debugXp("Right OFF");
        }
    });

    $("#cartFore").bind( {
        "mousedown": function() {
            socket903.emit("buttonEvent_02", {
                "action": "FORE"
                ,"event": "ON"
            });
        }
        ,"mouseup": function() {
            socket903.emit("buttonEvent_02", {
                "action": "FORE"
                ,"event": "OFF"
            });
        }
    });
    $("#cartBack").bind( {
        "mousedown": function() {
            socket903.emit("buttonEvent_02", {
                "action": "BACK"
                ,"event": "ON"
            });
        }
        ,"mouseup": function() {
            socket903.emit("buttonEvent_02", {
                "action": "BACK"
                ,"event": "OFF"
            });
        }
    });

});

