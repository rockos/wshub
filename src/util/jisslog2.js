'use strict';

var LIMIT = 1000;
var counter = 0;
var lcsDb = require("../lib/db/lcsdb").create('appServer', "../etc/db.cf");

function readDb() {
    var rand = Math.floor( Math.random() * 1400 );
    var rand2 = Math.floor( Math.random() * 3 );
    var d = new Date(2009,0,rand);
    var sql = "";
    var name = "";
    var jtim = "";
    var q_arg = [];

    if( counter >= LIMIT ) {
        lcsDb.query( "commit", function( err ) {
                console.log("completed --- count =" + counter + " ---");
                process.exit();
            });
    }

    switch(rand2) {
    case 0:name="法人";break;
    case 1:name="個人";break;
    default:name="ビジター";break;
    }
    jtim = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();

    var q_arg = [jtim,
                 name ];

    sql = ""+
        "insert into test_results (jiss_date,jiss_name) "+
        "values( ?, ? )";

    lcsDb.query( sql, q_arg, function( err ) {
            if( err ) {
                console.log("failed --- count =" + counter + " ---");
                process.exit();
            }
            console.log("add jiss --- " + jtim + ":" + name + " ---");
            counter++;

            //再帰してDataGETを繰り返す
            readDb();
        });

}

console.log('*START* inserted to mySql - jiss');
readDb();

