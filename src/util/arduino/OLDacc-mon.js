var ASC_STX = '\x02';
var ASC_ETX = '\x03';
/*
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var sp = new SerialPort("/dev/ttyUSB0", { 
    baudrate: 9600,
    //parser: serialport.parsers.readline("\x02")
    //parser: serialport.parsers.raw
});
*/
var SerialPort = require("serialport").SerialPort
var sp = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600
});

sp.on("open", function () {
    console.log('open');
/*
    setTimeout(function() {
        sp.write("ls\n", function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        }); 
    }, 1000); 
*/
});
var SaveBuf = [10];
var SaveCnt = 0;
var Stx = false;

function init() {
            SaveBuf.splice(0,3);
            SaveCnt = 0;
            Stx = false;

}
function log(buf) {
    var d = new Date,
    fmtd = "", dmsg = "",
        month;

        month = d.getMonth() + 1;

    fmtd = d.getFullYear() + '/' + month + '/' + d.getDate() +
        ' ' + d.getHours() + ':' + d.getMinutes() + ':' +
        d.getSeconds();
    dmsg = fmtd + " " + buf;
    console.log(dmsg);
}
/**
 *
 */
var BaseX = 125, BaseY = 128, BaseZ = 176;

sp.on('data', function(msg) {
    //console.log(msg);
    var buf = "";
    var sqrtX = 0.0, x = 0, y = 0, z = 0;
    for (var i = 0; i < msg.length; i++) {
        if (msg[i] == 2) {
         debugger;
            init();
            Stx = true;
        } else if (msg[i] == 3) {
         debugger;
         /*
            buf = "{KXM_A0:" + SaveBuf[0];
            buf +=",KXM_A1:" + SaveBuf[1];
            buf +=",KXM_A2:" + SaveBuf[2];
            buf += "}";
           */
            x = SaveBuf[0] - BaseX;
            y = SaveBuf[1] - BaseY;
            z = SaveBuf[2] - BaseZ;
            /*
            sqrtX= Math.sqrt(Math.pow(x, 2) +
                             Math.pow(y, 2) +
                             Math.pow(z, 2))
            */
            sqrtX = Math.round(Math.sqrt(Math.pow(x, 2) +
                             Math.pow(y, 2))); 
            buf = "sqrt: " + sqrtX + " x: " + x +
                " y: " + y + " z: " + z;
            log(buf);
            //console.log("sqrt: " + Math.round(sqrtX));
            init();
            setTimeout(function() {
                sp.write(6, function(err, results) {
                    //console.log('err ' + err);
                    // console.log('results ' + results);
                }); 
            }, 1000); 
        } else {
         debugger;
            if (!Stx) continue;
            if (SaveCnt >= 3) continue; 
            debugger;
            SaveBuf[SaveCnt] = msg[i];
            SaveCnt++;
        }

    }
});

sp.on('error', function(err) {
    console.log('err ' + err);
});
