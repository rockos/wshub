'use strict'
/**
 *  snowshoe-MachineResultError.htm
 */

var MachineResultError_GetSend = function() {
    var url = 'http://rockos.co.jp:3008/v1/rest/machine/result/error',
        methodType = 'GET',
        args = {};
    var pack = rcsPackedField.create();
    args.machineNo = pack.toString("#resultErrorQueryMachineNo", true);
    args.fromDate = pack.toDateTime("#resultErrorQueryFromdate", "YYYYMMDDhhmm", true);
    args.toDate = pack.toDateTime("#resultErrorQueryTodate", "YYYYMMDDhhmm", true);

    rcsRestSend({url:url, methodType:methodType, args:args}, function(err, data){
        if (err) {
            rcsErrorMessage("#resultErrorQueryEmessage", err);
            return;
        }
        /* custom menbers */
        var newdata = data;
        for (var i = 0, imax = newdata.recode.length; i < imax; i++) {
            newdata.recode[i].fmtdate = rcsFormatTime(newdata.recode[i].date);
            newdata.recode[i].decodeConfirm = rcsDecodeConfirm(newdata.recode[i].confirm);
        }
        rcsDrawTable('#MachineResultError-template', '#MachineResultError-table', data);
        return;
    });
};

var MachineResultError_PostSend = function() {
    var url = 'http://rockos.co.jp:3008/v1/rest/machine/result/error',
        methodType = 'POST',
        args = {};
    var pack = new rcsPackedField();
    args.id = $("#MachineResultError-table  input[name='resultError']:checked").val();
    args.confirmComment = pack.toString("#resultErrorConfirmComment", true);
    args.confirmUser = pack.toString("#resultErrorConfirmUser", true);

    rcsRestSend({url:url, methodType:methodType, args:args}, function(err, data){
        if (err) {
            rcsErrorMessage("#resultErrorQueryEmessage", err);
            return;
        }
        $("#resultErrorConfirmComment input").val("");
        $("#resultErrorConfirmUser input").val("");
        MachineResultError_GetSend();
        return;
    });
};

/**
 *  snowshoe-MachineRegister.htm
 */
var initRockosMachineRegister = function() {
    // Object settings
    var ss1 = rcs7seg.create('#ss1')
        .setConfig("figure", 6)
        .setConfig("ratio", 0.6)
        .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"});
    var ss2 = rcs7seg.create('#ss2')
        .setConfig("figure", 6)
        .setConfig("ratio", 0.6)
        .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"});
    var ss3 = rcs7seg.create('#ss3')
        .setConfig("figure", 6)
        .setConfig("ratio", 0.6)
        .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"});
    var ss4 = rcs7seg.create('#ss4')
        .setConfig("figure", 6)
        .setConfig("ratio", 0.6)
        .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"});

    var hex2bin = function(v) {
        var dec = parseInt(v, 16);
        var bin = [];
        var strbin = dec.toString(2);
        var len = strbin.length;
        for (var i = 0; i < 16; i++) {
            if (i >= len) {
                bin[i] = 0;
            } else {
                bin[i] = strbin.substr(-1 + (-1)*i, 1) - 0;
            }
        }
        return bin;
    };
    var hex2dec = function(v) {
        var x = parseInt(v, 16);
        return x;
    }

    var MachineRegister_GetSend = function() {
        var url = 'http://rockos.co.jp:3008/v1/rest/machine/register',
            methodType = 'GET',
            args = {
                channel : 1,
                address : "0,100",
                width : "60,60",
            };
        rcsRestSend({url:url, methodType:methodType, args:args}, function(err, data){
            if (err) {
                rcsErrorMessage("#ErrorMessage", err);
                return;
            }
            ss1.setDraw(hex2dec(data.register[3]));
            ss2.setDraw(hex2dec(data.register[4]));
            ss3.setDraw(hex2dec(data.register[5]));
            ss4.setDraw(hex2dec(data.register[6]));
            var rrr = {};
            rrr.register = [];
            var i = 0;
            for (var idx in data.register) {
                var f1 = idx % 10;
                var f10 = idx - f1;
                if (i != 0 && rrr.register[i-1].addr == f10) {
                    continue;
                }
                rrr.register[i] = {};
                rrr.register[i].addr = f10;
                i++;
            }
            for (var j = 0,jmax = rrr.register.length; j < jmax; j++) {
                for (var k = 0; k < 10; k++) {
                    if (typeof data.register[rrr.register[j].addr + k] === 'object' || 
                        typeof data.register[rrr.register[j].addr + k] === 'string') {
                        var key = 'r' + k;
                        rrr.register[j][key] = data.register[rrr.register[j].addr + k];
                    } else {
                        var key = 'r' + k;
                        rrr.register[j][key] = '----';
                    }
                }
            }
            console.log(rrr);
            rcsDrawTable('#MachineRegister-template', '#MachineRegister-table', rrr);
            return;
        });
    };

    /* ここからAjaxスタート */
    var getData = function(no) {
        MachineRegister_GetSend();
        setTimeout(function() {
            getData(no);
        }, 1000);
    }
    getData(1);
};

/**
 *  snowshoe-MachineStatus.htm
 */
var initRockosMachineStatus = function() {
    // Object settings
    var elePow = rcs7seg.create('#elePow');
    var revNum = rcs7seg.create('#revNum');
    var tempMc = rcs7seg.create('#tempMc');
    var pressMc = rcs7seg.create('#pressMc');
    var LG1 = rcsDynamicLineGraph.create("#linegraph01");
    var socket122 = io.connect("http://rockos.co.jp:3008/scr/122");

    $("#gauge01").gauge({
        min: 0,
        max: 100,
        label: '電力',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 100}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge02").gauge({
        min: 0,
        max: 100,
        label: '回転数',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 100}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge03").gauge({
        min: 0,
        max: 100,
        label: '温度',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 100}
               ]
    })
    .gauge('setValue', 0);

    $("#gauge04").gauge({
        min: 0,
        max: 100,
        label: '圧力',
        unitsLabel: '',
        majorTicks: 11,
        minorTicks: 3,
        bands: [
               {color: "#ffffff", from: 0, to: 100}
               ]
    })
    .gauge('setValue', 0);

    $('#machineSW').buttonset({
        disabled: false
    });

    $('#machineMD').buttonset({
        disabled: false
    });

    elePow.setConfig("figure", 3)
          .setConfig("ratio", 0.6)
          .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"})
          .setDraw(0);
    revNum.setConfig("figure", 3)
          .setConfig("ratio", 0.6)
          .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"})
          .setDraw(0);
    tempMc.setConfig("figure", 3)
          .setConfig("ratio", 0.6)
          .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"})
          .setDraw(0);
    pressMc.setConfig("figure", 3)
          .setConfig("ratio", 0.6)
          .setConfig("color", {face: "rgb(255,255,255)", back: "rgb(51,51,51)"})
          .setDraw(0);

    LG1.setConfig("margin", { top: 10, right: 10, bottom: 30, left: 40 })
       .setConfig("width", 850)
       .setConfig("height", 150)
       .setConfig("color", { face: "#fff", back: "#333" })
       .setConfig("yaxis", {
           min: 0,
           max: 1000,
           text: "",
           axis: { ticks: 5 },
           rule: { draw: true, ticks: 5 }
       })
       .setConfig("xaxis", {
           max: 101,
           axis: { ticks: 20 },
           rule: { draw: true, ticks: 20 }
       })
       .setConfig("dataAll", [
          {use: true, color: "#00f", width: 2},
          {use: true, color: "#f29", width: 2},
          {use: true, color: "#3b7", width: 2},
          {use: false, color: "#bb7", width: 2},
          {use: false}
       ])
       .setDraw();

    // Events

    var MachineStatus_GetSend = function() {
        var url = 'http://rockos.co.jp:3008/v1/rest/machine/status',
            methodType = 'GET',
            args = {
                'machineNo': 1,
            };
        var pack = new rcsPackedField();
        //args.machineNo = pack.toString("#resultErrorQueryMachineNo", true);

        rcsRestSend({url:url, methodType:methodType, args:args}, function(err, data){
            if (err) {
                rcsErrorMessage("#resultErrorQueryEmessage", err);
                return;
            }
            $("#gauge01").gauge('setValue',data.elePow);
            $("#gauge02").gauge('setValue',data.revNum);
            $("#gauge03").gauge('setValue',data.tempMc);
            $("#gauge04").gauge('setValue',data.pressMc);
            elePow.setDraw(data.elePow-0);
            revNum.setDraw(data.revNum-0);
            tempMc.setDraw(data.tempMc-0);
            pressMc.setDraw(data.pressMc-0);
            //LG1.setMovePoint([data.elePow,data.revNum,data.tempMc,data.pressMc]);
            $("#machineView div.errorText").html(data.errorText);
            if (data.switch == true) {
                $("#machineSW_ON").attr("checked",true);
            } else {
                $("#machineSW_OFF").attr("checked",true);
            }
            if (data.mode == 1) {
                $("#machineMD_BUSY").attr("checked", true);
            } else if (data.mode == 0) {
                $("#machineMD_IDLE").attr("checked", true);
            } else {
                $("#machineMD_EROR").attr("checked", true);
            }
            $('#machineSW').buttonset();
            $('#machineMD').buttonset();
            return;
        });
    };

    /* ここからAjaxスタート */
    var getData = function(no) {
        MachineStatus_GetSend();
        setTimeout(function() {
            getData(no);
        }, 1000);
    }
    getData(1);

    socket122.on("graph01", function (data) {
       LG1.setMovePoint([data.valueX,data.valueY,data.valueZ]);
    });
};

