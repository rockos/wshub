
function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

$(function() {
    /* on loading */
    var socket903 = io.connect("/scr/903");

    var vhchangeStr_v = $('#VHchangeStr_v').html(),
        vhchangeStr_h = $('#VHchangeStr_h').html();

    $('#horizon').css('display','none');
    $('#VHchange').html(vhchangeStr_v);

    socket903.on("buttonEvent_01", function(data) {
        for (var key in data) {
            if (key == 'value_v') {
                /*上昇・下降 値*/
                $("#v_verticalDistanceStr").html(data[key]);
                $("#h_verticalDistanceStr").html(data[key]);
                //debugXp(data[key]);
            }
            if (key == 'value_h') {
                /*前進・後退 値*/
                $("#v_horizonDistanceStr").html(data[key]);
                $("#h_horizonDistanceStr").html(data[key]);
            }
            if (key == 'limit') {
                if (data.move == 1) {
                    if (data.limit == 1) {
                        /* 上昇限界 */
                        $('#craneUpStr').addClass('limit');
                    } else {
                        $('#craneUpStr').removeClass('limit');
                    }
                }
                if (data.move == 2) {
                    if (data.limit == 1) {
                        /* 下降限界 */
                        $('#craneDownStr').addClass('limit');
                    } else {
                        $('#craneDownStr').removeClass('limit');
                    }
                }
                if (data.move == 4) {
                    if (data.limit == 1) {
                        /* 前進限界 */
                        $('#craneForeStr').addClass('limit');
                    } else {
                        $('#craneForeStr').removeClass('limit');
                    }
                }
                if (data.move == 8) {
                    if (data.limit == 1) {
                        /* 後退限界 */
                        $('#craneBackStr').addClass('limit');
                    } else {
                        $('#craneBackStr').removeClass('limit');
                    }
                }
            }
            if (key == 'color') {
                if (data.move == 1) {
                    if (data.color == 1) {
                        $('#craneUp').addClass('move');
                    } else {
                        $('#craneUp').removeClass('move');
                    }
                }
                if (data.move == 2) {
                    if (data.color == 1) {
                        $('#craneDown').addClass('move');
                    } else {
                        $('#craneDown').removeClass('move');
                    }
                }
                if (data.move == 4) {
                    if (data.color == 1) {
                        $('#craneFore').addClass('move');
                    } else {
                        $('#craneFore').removeClass('move');
                    }
                }
                if (data.move == 8) {
                    if (data.color == 1) {
                        $('#craneBack').addClass('move');
                    } else {
                        $('#craneBack').removeClass('move');
                    }
                }
            }
        }/* for(key in data) */
    });
    $("#craneUp").bind( {
        "tap taphold swipe vclick swipeleft swiperight vmousemove doubleclick": function() {
            return false;
        }
        ,"vmousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "UP"
                ,"event": "ON"
            });
            //debugXp("Up ON");
        }
        ,"vmouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "UP"
                ,"event": "OFF"
            });
            //debugXp("Up OFF");
        }
    });
    $("#craneDown").bind( {
        "tap taphold swipe vclick swipeleft swiperight vmousemove doubleclick": function() {
            return false;
        }
        ,"vmousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "DOWN"
                ,"event": "ON"
            });
            //debugXp("Down ON");
        }
        ,"vmouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "DOWN"
                ,"event": "OFF"
            });
            //debugXp("Down OFF");
        }
    });
    $("#craneFore").bind( {
        "tap taphold swipe vclick swipeleft swiperight vmousemove doubleclick": function() {
            return false;
        }
        ,"vmousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "FORE"
                ,"event": "ON"
            });
            //debugXp("Left ON");
        }
        ,"vmouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "FORE"
                ,"event": "OFF"
            });
            //debugXp("Left OFF");
        }
    });
    $("#craneBack").bind( {
        "tap taphold swipe vclick swipeleft swiperight vmousemove doubleclick": function() {
            return false;
        }
        ,"vmousedown": function() {
            socket903.emit("buttonEvent_01", {
                "action": "BACK"
                ,"event": "ON"
            });
            //debugXp("Right ON");
        }
        ,"vmouseup": function() {
            socket903.emit("buttonEvent_01", {
                "action": "BACK"
                ,"event": "OFF"
            });
            //debugXp("Right OFF");
        }
    });
    $("#VHchange").bind( {
        "tap taphold swipe vclick vmousemove doubleclick": function() {
            return false;
        }
        ,"swipeleft": function() {
            $(this).html(vhchangeStr_v);
            $('#vertical').css('display','block');
            $('#horizon').css('display','none');
        }
        ,"swiperight": function() {
            $(this).html(vhchangeStr_h);
            $('#vertical').css('display','none');
            $('#horizon').css('display','block');
        }
    });
});
