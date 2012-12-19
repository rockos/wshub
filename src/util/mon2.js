'use strict';
var mongoose = require('mongoose');

var rootdir = process.env.LOCOS_DEV;
var lcsAp = require(rootdir + 'lib/ap/lcsap').create('MON');



function readDb() {
    console.log('read from MongoDB');
                
    mongoose.connect('mongodb://localhost/pigmo');
    var _schema_gndlog = new mongoose.Schema({
            mc_begin: String,
            mc_name: String,
            mc_state: String,
            mc_date: Date
        });
    
    var  _model_gndlog = mongoose.model('gndlog', _schema_gndlog);

    //    lcsMo.find( ({mc_date:{$gt:ISODate("2012-07-17")}}), function(err, docs) {
    //    lcsMo.find({mc_state:{$gt:"17:16"}}, function(err, docs) {
    _model_gndlog.find( {},function(err, docs) {
            if (!err) {

                for (var i = 0; i < docs.length; i++ ) {
                    console.log(docs[i]);
                }
            }
        
            process.exit();
        });

}

readDb();
/* process.exit(); */