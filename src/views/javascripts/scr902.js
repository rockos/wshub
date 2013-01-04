var socket = io.connect("/error");
sockEventShowError(socket);

var socket902 = io.connect("/scr/902");

socket902.on("message_bar", function (data) {
    err = document.getElementById("mesg_bar");
    err.className = "mesg_bar " + data.color;
    err.innerText = data.mesg;
});

socket902.on("changeCrane", function (data) {
    if (data.head) {
        for (var key in data) {
            switch(key) {
            case "local_switch":
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(2)").html(data[key].text);
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(2)").removeClass();
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(2)").addClass(data[key].color);
                break;
            case "online_switch":
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(3)").html(data[key].text);
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(3)").removeClass();
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(3)").addClass(data[key].color);
                break;
            case "status":
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(4)").html(data[key].text);
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(4)").removeClass();
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(4)").addClass(data[key].color);
                break;
            case "move_start":
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(5)").html(data[key]);
                break;
            case "move_end":
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(6)").html(data[key]);
                break;
            case "id":
                $("#machineView tbody#" + data.head + " tr:nth-child(1) td:nth-child(7)").html(data[key]);
                break;
            case "speed":
                $("#machineView tbody#" + data.head + " tr:nth-child(2) td:nth-child(1)").html(data[key]);
                break;
            case "h_range":
                $("#machineView tbody#" + data.head + " tr:nth-child(2) td:nth-child(2)").html(data[key]);
                break;
            case "v_range":
                $("#machineView tbody#" + data.head + " tr:nth-child(2) td:nth-child(3)").html(data[key]);
                break;
            case "count":
                $("#machineView tbody#" + data.head + " tr:nth-child(3) td:nth-child(1)").html(data[key]);
                break;
            case "h_total_distance":
                $("#machineView tbody#" + data.head + " tr:nth-child(3) td:nth-child(2)").html(data[key]);
                break;
            case "v_total_distance":
                $("#machineView tbody#" + data.head + " tr:nth-child(3) td:nth-child(3)").html(data[key]);
                break;
            case "error":
                $("#machineView tbody#" + data.head + " tr:nth-child(4) td:nth-child(1)").html(data[key].text);
                $("#machineView tbody#" + data.head + " tr:nth-child(4) td:nth-child(1)").removeClass();
                $("#machineView tbody#" + data.head + " tr:nth-child(4) td:nth-child(1)").addClass(data[key].color);
                break;
            }
        }
    }
});

socket902.on("changeConveyor", function (data) {
    if (data.head) {
        for (var key in data) {
            switch(key) {
            case "local_switch":
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(2)").html(data[key].text);
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(2)").removeClass();
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(2)").addClass(data[key].color);
                break;
            case "status":
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(3)").html(data[key].text);
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(3)").removeClass();
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(3)").addClass(data[key].color);
                break;
            case "exists_load":
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(4)").html(data[key]);
                break;
            case "direction":
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(5)").html(data[key]);
                break;
            case "h_total_distance":
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(1) td:nth-child(6)").html(data[key]);
                break;
            case "error":
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(2) td:nth-child(1)").html(data[key].text);
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(2) td:nth-child(1)").removeClass();
                $("#machineView-2 tbody#" + data.head + " tr:nth-child(2) td:nth-child(1)").addClass(data[key].color);
                break;
            }
        }
    }
});

function x() {
    $("#debugtxt").html(
        $("#debugtxt").html() + "emit!<br>");
    socket902.emit('demoevent',{"a":"a"});
};

$(function() {
    /* is loading */
});

