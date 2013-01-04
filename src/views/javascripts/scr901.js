var socket = io.connect("/error");
sockEventShowError(socket);

var socket901 = io.connect("/scr/901");

socket901.on("message_bar", function (data) {
    err = document.getElementById("mesg_bar");
    err.className = "mesg_bar " + data.color;
    err.innerText = data.mesg;
    /*
    debugtxt = document.getElementById("debugtxt");
    if( typeof data==="object" ) {
        for( var key in data ) {
            debugtxt.innerHTML += (data[key]+"<br>");
        }
    }else{
        debugtxt.innerHTML += data;
    }
    */
});

socket901.on("Heartbeat", function (data) {
    reg = document.getElementById("D0000");
    reg.innerText = ('0000'+data.D0000.toString(16).toUpperCase()).slice(-4);
});

socket901.on("regChange", function (data) {
    reg = document.getElementById(data.reg);
    reg.innerText = ('0000'+data.val.toString(16).toUpperCase()).slice(-4);

    if (document.getElementById("recv_dreg").innerHTML == data.reg) {
        document.getElementById("recv_dreg_val16").innerHTML = reg.innerHTML;
        document.getElementById("recv_dreg_val10").innerHTML = parseInt(reg.innerHTML,16);
        document.getElementById("recv_dreg_val2").innerHTML = 
            ('0000000000000000' + parseInt(reg.innerHTML,16).toString(2)).slice(-16);
    }
});

var recvOn = function(my) {
    if (my.className == "selected") {
        document.getElementById("recv_dreg").innerHTML = "";
        document.getElementById("recv_dreg_val16").innerHTML = "";
        document.getElementById("recv_dreg_val10").innerHTML = "";
        document.getElementById("recv_dreg_val2").innerHTML = "";
    } else {
        document.getElementById("recv_dreg").innerHTML = my.id;
        document.getElementById("recv_dreg_val16").innerHTML = my.innerHTML;
        document.getElementById("recv_dreg_val10").innerHTML = parseInt(my.innerHTML,16);
        document.getElementById("recv_dreg_val2").innerHTML = 
            ('0000000000000000' + parseInt(my.innerHTML,16).toString(2)).slice(-16);
    }
    searchDreg("recv_reg",document.getElementById("recv_dreg").innerHTML);
}

var sendOn = function(my) {
    if (my.className == "selected") {
        /* cancel */
        document.getElementById("send_dreg").value = "";
        document.getElementById("send_dreg_value").value = "";
    } else {
        document.getElementById("send_dreg").value = my.id;
        if (document.getElementById("radix_bin").checked) {
            document.getElementById("send_dreg_value").value = 
                ('0000000000000000' + parseInt(my.innerHTML,16).toString(2)).slice(-16);
        } else if (document.getElementById("radix_dec").checked) {
            document.getElementById("send_dreg_value").value = parseInt(my.innerHTML,16);
        } else if (document.getElementById("radix_hex").checked) {
            document.getElementById("send_dreg_value").value = my.innerHTML;
        } else {
            document.getElementById("radix_hex").checked = true;
            document.getElementById("send_dreg_value").value = my.innerHTML;
        }
    }
    searchDreg("send_reg",document.getElementById("send_dreg").value);
}

var radixChange = function(my) {
    //debugtxt = document.getElementById("debugtxt");
    //debugtxt.innerHTML += dreg + "<br>";

    var dreg = document.getElementById("send_dreg").value;
    if (!dreg) {
        document.getElementById("send_dreg_value").value = "";
        return;
    }
    var dreg_val_hex = document.getElementById(dreg).innerHTML;
    if (!dreg_val_hex) {
        document.getElementById("send_dreg_value").value = "";
        return;
    }
    switch (my.id) {
        case "radix_bin":
            document.getElementById("send_dreg_value").value = 
                ('0000000000000000' + parseInt(dreg_val_hex,16).toString(2)).slice(-16);
            break;
        case "radix_dec":
            document.getElementById("send_dreg_value").value = parseInt(dreg_val_hex,16);
            break;
        case "radix_hex":
            document.getElementById("send_dreg_value").value = dreg_val_hex;
            break;
        default:
            document.getElementById("send_dreg_value").value = "";
    }
}

/*
 *  D-register から対象のアドレスを探して背景を黒くする
 */
var searchDreg = function(func,dreg) {

    var target = document.getElementById(func).childNodes;
    for ( var i=0; i < target.length; i++) {
        if (target[i].nodeName === 'TABLE') {
            var columns = target[i].getElementsByTagName("td");
            for ( var j=0; j < columns.length; j++) {
                if (columns[j].id == dreg) {
                    if (columns[j].className == "selected") {
                        columns[j].className = "";
                    } else {
                        columns[j].className = "selected";
                    }
                } else {
                    columns[j].className = "";
                }
            }
            break;
        }
    } 
}

