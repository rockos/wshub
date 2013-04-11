var ASC_STX = 2; 
var ASC_ETX = 3;
var ASC_ACK = 6;
/*
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var sp = new SerialPort("/dev/ttyUSB0", { 
    baudrate: 9600,
    //parser: serialport.parsers.readline("\x02")
    //parser: serialport.parsers.raw
});
*/
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var sp = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: serialport.parsers.readline('\n')
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
            // SaveBuf.splice(0,10);
            for (var i=0; i < SaveBuf.length; i++)
              SaveBuf[i] = 0;
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
function fnRound(val, p) {
    var prod = Math.pow(10, p);
    if (prod == 0) return 0;
   return (Math.round(val * prod) / prod)
}
/**
 *
 */
var Vdd = 3.3; /* Input voltage 3.3v */
var Vzero = Vdd / 2; /* 1.65v */
var Drange = 1024
var Dzero = 511; /* */
var Kand = Vdd / 5; /* 0.66v */
var VperBit = Vdd / Drange; /* 0.003 */
//var BaseX = 513, BaseY = 495, BaseZ = 705;
var BaseX = 0, BaseY = 0, BaseZ = 0;
function cnv2acc(msg) {
    var dx = 0, dy = 0, dz = 0, dc = 0;
    var Vx = 0.0, Vy = 0.0, Vz = 0.0;
    var sqrtX = 0.0, x = 0, y = 0, z = 0;
   var Lmax = 1.016, Lmin = 0.98;
   var Lmaxz = 1.07, Lminz = 0.95;
    /* string to int */
    dx = parseInt(msg.substring(1, 5), 10); /* value of 3-axiss accelaratoin */
    dy = parseInt(msg.substring(5, 9), 10);
    dz = parseInt(msg.substring(9, 13), 10);
    dc = parseInt(msg.substring(13, 16), 10); /* value of degital compass */

    Vx = dx * VperBit;
    Vy = dy * VperBit;
    Vz = (dz - 200) * VperBit; /* Dzer/2 mean 1g */
    //Vz = dz * VperBit;
    if ((Vx < ((Dzero * VperBit) * Lmax)) &&
        (Vx > ((Dzero * VperBit) * Lmin))) {
        Vx = 0;
    } else {
      Vx -= Vzero;
    }
    if ((Vy < ((Dzero * VperBit) * Lmax)) &&
        (Vy > ((Dzero * VperBit) * Lmin))) {
        Vy = 0;
    } else {
      Vy -= Vzero;
    }
    if ((Vz < ((Dzero * VperBit) * Lmaxz)) &&
        (Vz > ((Dzero * VperBit) * Lminz))) {
        Vz = 0;
    } else {
      Vz -= Vzero;
    }
   /*
    if ((Vz < (((Dzero-(Dzero/2)) * VperBit) * Lmaxz)) &&
        (Vz > (((Dzero-(Dzero/2)) * VperBit) * Lminz))) {
        Vz = 0;
    } else {
      Vz -= Vzero;
    }
    */
    Vlx = fnRound(((Vx / Kand) * 9.8), 2);
    Vly = fnRound(((Vy / Kand) * 9.8), 2);
    Vlz = fnRound(((Vz / Kand) * 9.8), 2);

    sqrtMove = fnRound((Math.sqrt(Math.pow(Vlx, 2) +
                                 Math.pow(Vly, 2))), 2); 
    /* loggin */
    buf = "sqrt: " + sqrtMove + " x: " + Vlx +"("+dx+")" +
        " y: " + Vly + "("+dy+")"+" z: " + Vlz+"("+dz+")" +
        " c: " + dc;
     log(buf);
    //log(sqrtMove + ' ' + dc);
}
sp.on('data', function(msg) {
    /*
    if (msg[0] == 2) {
        log("RECV:STX "+"len:"+msg.length+" Data: "+msg);
    } else {
        log("RECV:    "+"len:"+msg.length+" Data: "+msg);
    }
    */
    cnv2acc(msg);
    /* send response */
    setTimeout(function() {
        sp.write(ASC_ACK, function(err, results) {
            //console.log('err ' + err);
            // console.log('results ' + results);
        }); 
    }, 1000); 
});

sp.on('dataX', function(msg) {
    //console.log(msg);
    var buf = "";
    var sqrtX = 0.0, x = 0, y = 0, z = 0;
    var ax = 0, ay = 0, az = 0;
    for (var i = 0; i < msg.length; i++) {
        if (msg[i] == 2) {
         debugger;
            init();
            Stx = true;
        } else if (msg[i] == 3) {
         debugger;
         /*
            x = SaveBuf[0] - BaseX;
            y = SaveBuf[1] - BaseY;
            z = SaveBuf[2] - BaseZ;
        */
          //cnv2Acc(SaveBuf[0], x);
          ax = SaveBuf[0] + SaveBuf[1]<<8;
          ay = SaveBuf[2] + SaveBuf[3]<<8;
          az = SaveBuf[4] + SaveBuf[5]<<8;
         x = Math.round((((ax * VperBit) - Vdd) / Kand) * 9.8);
         y = Math.round((((ay * VperBit) - Vdd) / Kand) * 9.8);
         z = Math.round((((az * VperBit) - Vdd) / Kand) * 9.8);
         var bb="";
         for (var i = 0; i < 6; i++) {
            bb += SaveBuf[i];
         }
            bb = SaveBuf[0] + SaveBuf[1]+ SaveBuf[2] ;
            bb += SaveBuf[3] + SaveBuf[4]+ SaveBuf[5] ;
         //log(SaveBuf);
          /*
         x = Math.round((((SaveBuf[0] * VperBit) - Vdd) / Kand) * 9.8);
         y = Math.round((((SaveBuf[1] * VperBit) - Vdd) / Kand) * 9.8);
         z = Math.round((((SaveBuf[2] * VperBit) - Vdd) / Kand) * 9.8);
         */
         sqrtX = Math.round(Math.sqrt(Math.pow(x, 2) +
                             Math.pow(y, 2))); 
                             buf = "sqrt: " + sqrtX + " x: " + ax +
                " y: " + ay + " z: " + az;
            // log(buf);
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
            if (SaveCnt >= 6) continue; 
            debugger;
            SaveBuf[SaveCnt] = msg[i];
            SaveCnt++;
        }

    }
});

sp.on('error', function(err) {
    console.log('err ' + err);
});
