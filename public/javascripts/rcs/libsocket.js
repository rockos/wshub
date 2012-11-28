/**
 *
 */
var sockEventShowError = function(socket) {

    socket.on("errmsg", function (data) {
            err = document.getElementById("mesg_bar");
            err.className = "mesg_bar " + data.color;
            //err.className = data.color;
            err.innerText = data.mesg;
        });

    socket.on("conn-conf", function (data) {
            var clientID = document.getElementById("clientID");
            var nameSpace = document.getElementById("nameSpace");
            if (!clientID) {
                alert("clientID not defined.");
                return;
            }
            if (!nameSpace) {
                alert("nameSpace not defined.");
                return;
            }
            clientID.value = data.clientID;
            nameSpace.value = data.nameSpace;
            
            /*
            var debugtxt = document.getElementById("debugtxt");
            if( typeof data==="object" ) {
                for( var key in data ) {
                    debugtxt.innerHTML += (key+"::"+data[key]+"<br>");
                }
            }else{
                debugtxt.innerHTML += data + "<br>";
            }
            */
        });
}
