function log(objs) {
    var d = new Date,
    fmtDate = '',
    month;
    var msg = {};
    month = d.getMonth() + 1;

    fmtDate = d.getFullYear() + '/' + month + '/' + d.getDate() +
        ' ' + d.getHours() + ':' + d.getMinutes() + ':' +
        d.getSeconds() + ':' + d.getMilliseconds();

    console.log(fmtDate + ' ' + objs.title+':'+objs.info);
}

var SCR_PORT = 3013;
var scrio = require('socket.io').listen(SCR_PORT);


scrio.sockets.on('connection', function(socket) {
    // connected...
    log({'title':'screen socket','info':'bound on '+SCR_PORT});
    //scrio.sockets.emit("gauge01", {"value": 500}); 
});

var DEMO ={};
DEMO.generation = [];

var demoGauge01 = function(){
    var rand = Math.floor( Math.random() * 100 );
    DEMO.generation[1] = rand;
    setTimeout(demoGauge01,500);
};

var demoGauge02 = function(){
    var rand = Math.floor( Math.random() * 10 );
    DEMO.generation[2] = rand;
    setTimeout(demoGauge02,500);
};

var demoGauge03 = function(){
    var rand = Math.floor( Math.random() * 300 );
    DEMO.generation[3] = rand;
    setTimeout(demoGauge03,500);
};

var test_emitter = function() {
    scrio.sockets.emit("accelerating_sensor", {
        "KXM_A0":DEMO.generation[1],
        "KXM_A1":DEMO.generation[2],
        "KXM_A2":DEMO.generation[3]
    }); 
    setTimeout(function(){
        test_emitter();
    },500);
};


demoGauge01();
demoGauge02();
demoGauge03();

test_emitter();


