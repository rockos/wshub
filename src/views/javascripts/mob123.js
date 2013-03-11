var socket123 = io.connect("/scr/123");
var ACL = {};
ACL.alive = 0;

socket123.on("massage", function (data) {
   //debugXp(data);
});
socket123.on("debugz", function (data) {
    debugXp(data);
});
function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

var mondataSet = function() {
    socket123.emit('mob_data',ACL);
    setTimeout(mondataSet, 1000);
};
/*
 *  Socket.ioのID通知
 */
socket123.on("localclientID", function (data) {
    $('#localclientID').val(data);
    //$('#debugXX').html($('#localclientID').val()); 
});

/*
 *  モニタリング開始：応答
 */
socket123.on("mob_mon", function (data) {
    //$('#debugXX').html($('#debugXX').html()+"<br>mob_mon start."); 
    ACL.alive = 1;
    //データ収集開始
    mondataSet();
    //表示を開始中にする
    $('#mob_mon').html('モニタリング中');
    $('#mob_mon').button('disable');
});

$(function() {
    /* on loading */
    $(window).bind("devicemotion", function (event) {
        var acceler = event.originalEvent;
        // ev.acceleration, ev.accelerationIncludingGravity, ev.rotationRate で取れる
        // 加速度
        //$('#acc_x').html(acceler.acceleration.x);
        //$('#acc_y').html(acceler.acceleration.y);
        //$('#acc_z').html(acceler.acceleration.z);
        /*
        $('#acg_x').html(acceler.accelerationIncludingGravity.x);
        $('#acg_y').html(acceler.accelerationIncludingGravity.y);
        $('#acg_z').html(acceler.accelerationIncludingGravity.z);
        */
        //$('#rtr_x').html(acceler.rotationRate.alpha);
        //$('#rtr_y').html(acceler.rotationRate.beta);
        //$('#rtr_z').html(acceler.rotationRate.gamma);
        //$('#dvm_interval').html(acceler.interval);

        ACL.gvt_x = Math.round(acceler.accelerationIncludingGravity.x*100)/100;
        ACL.gvt_y = Math.round(acceler.accelerationIncludingGravity.y*100)/100;
        ACL.gvt_z = Math.round(acceler.accelerationIncludingGravity.z*100)/100;
    });

    $(window).bind("deviceorientation", function (event) {
        var rotate = event.originalEvent;
        // ev.alpha, ev.beta, ev.gamma で取れる
        // 回転角
        /*
        $('#rtt_x').html(rotate.alpha);
        $('#rtt_y').html(rotate.beta);
        $('#rtt_z').html(rotate.gamma);
        */

        ACL.rtt_x = Math.round(rotate.alpha*10)/10;
        ACL.rtt_y = Math.round(rotate.beta*10)/10;
        ACL.rtt_z = Math.round(rotate.gamma*10)/10;
    });

    $('#mob_mon').bind('click', function() {
        if (ACL.alive == 0) {
            socket123.emit("mob_mon", $('localclientID').val);
        }
    });

});


