var socket = io.connect("/error");
sockEventShowError(socket);

var socket123 = io.connect("/scr/123");

socket123.on("message", function (data) {

});

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

socket123.on("acl_data", function (data) {
   /*
   for(var key in data){
       debugXp(key);
       for(var key2 in data[key]){
           debugXp(key2);
           debugXp(data[key][key2]);
       }
   }
   */
   var dsp = 0;
   for(var key in data){
       if (key === $('#mobclientID').val()) {
           $("#gg_gvt_x").gauge('setValue',data[key].ACL.gvt_x);
           $("#gg_gvt_y").gauge('setValue',data[key].ACL.gvt_y);
           $("#gg_gvt_z").gauge('setValue',data[key].ACL.gvt_z);
           $("#gg_rtt_x").gauge('setValue',data[key].ACL.rtt_x);
           $("#gg_rtt_y").gauge('setValue',data[key].ACL.rtt_y);
           $("#gg_rtt_z").gauge('setValue',data[key].ACL.rtt_z);
           dsp = 1;
           break;
       }
   }
   if (!dsp) {
       $("#gg_gvt_x").gauge('setValue',0);
       $("#gg_gvt_y").gauge('setValue',0);
       $("#gg_gvt_z").gauge('setValue',0);
       $("#gg_rtt_x").gauge('setValue',0);
       $("#gg_rtt_y").gauge('setValue',0);
       $("#gg_rtt_z").gauge('setValue',0);
   }
});

$(function() {
    /* on loading */
    $("#gg_rtt_x")
    .gauge({
        min: 0,
        max: 360,
        label: '軸Ｘ',
        unitsLabel: '°',
        majorTicks: 9,
        minorTicks: 8,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 360}
               ]
    })
    .gauge('setValue', 0);

    $("#gg_rtt_y")
    .gauge({
        min: -180,
        max: 180,
        label: '軸Ｙ',
        unitsLabel: '°',
        majorTicks: 9,
        minorTicks: 8,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 360}
               ]
    })
    .gauge('setValue', 0);

    $("#gg_rtt_z")
    .gauge({
        min: -180,
        max: 180,
        label: '軸Ｚ',
        unitsLabel: '°',
        majorTicks: 9,
        minorTicks: 8,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 360}
               ]
    })
    .gauge('setValue', 0);

    $("#gg_gvt_x")
    .gauge({
        min: -20,
        max: 20,
        label: '加速度Ｘ',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 360}
               ]
    })
    .gauge('setValue', 0);

    $("#gg_gvt_y")
    .gauge({
        min: -20,
        max: 20,
        label: '加速度Ｙ',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 360}
               ]
    })
    .gauge('setValue', 0);

    $("#gg_gvt_z")
    .gauge({
        min: -20,
        max: 20,
        label: '加速度Ｚ',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        majorTickLabel: true,
        bands: [
               {color: "#ffffff", from: 0, to: 360}
               ]
    })
    .gauge('setValue', 0);

    $('#sock_start').bind('click',function() {
        socket123.emit("sock_start", {"mobclientID":$('#mobclientID').val()});
    });
    $('#sock_start').bind('click',function() {
        socket123.emit("sock_end", "");
    });

});

