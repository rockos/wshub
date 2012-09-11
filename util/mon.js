'use strict';

var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('MON');
var lcsMo = require(rootdir + 'lib/db/lcsmo').create('MON', rootdir+'etc/mongo.cf');


function readDb() {
    console.log('read from MongoDB');
                
    
    //    lcsMo.find( ({mc_date:{$gt:ISODate("2012-07-17")}}), function(err, docs) {
        lcsMo.find({"mc_date":{$gte:ISODate("2012-07-17T04:39:00Z")}}, function(err, docs) {
    //lcsMo.findAll( function(err, docs) {
            if (!err || docs.length != "undefined") {
                debugger;
                for (var i = 0; i < docs.length; i++ ) {
                    console.log(docs[i]);
                }
            }
            process.exit();
        
        });
}

readDb();