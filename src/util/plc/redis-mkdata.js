#!/usr/bin/env node
var redis = require("redis"),
    client = redis.createClient();

var key = 'PLC-SRC', val = '';
for (var i = 0; i <= 100; i++) {
    val += ('000' + i).slice(-4); 
}
console.log('set ' + key + ':' + val);
client.set(key, val, redis.print);

client.quit(function (err, res) {
        console.log("Exiting from quit command.");
        });
