

/**
 *  snowshoe-MachineResultError.htm
 */

// use D3.js drawing table
var drawTable = function(data) {
    d3.select("#resultError").selectAll('table').remove(); 
    var tbl = d3.select("#resultError")
        .append("table");

    tbl.append("thead")
        .append("tr")
        .selectAll("thead td")
        .data(function(d){ return ["", "エラー日時", "コード", "エラー内容", "確認", "確認内容", "確認者"]; })
        .enter()
        .append("td")
        .attr("style", "border:1px solid black")
        .text(function(d) { return d; });

    var trs = tbl.append("tbody")
        .selectAll("tbody tr")
        .data(data.tbl)
        .enter()
        .append("tr")
        .attr("class", function(d) { return "id_" + d.id; });

    trs.append("td")
        .attr("style", "border:1px solid black")
        .append("input")
        .attr("type", "radio")
        .attr("name", "resultError")
        .attr("class", "radio")
        .attr("value", function(d) { return d.id; });

    trs.selectAll("tbody td.cell")
        .data(function(d){ 
            var dateFormat = d.date.substr(0,4) + "/" + d.date.substr(4,2) + "/" + d.date.substr(6,2) + 
                " " + d.date.substr(8,2) + ":" + d.date.substr(10,2);
            var confirmFormat = d.confirm ? "○" : "";
            return [dateFormat, d.code, d.errorText, confirmFormat, d.confirmComment, d.confirmUser]; 
        })
        .enter()
        .append("td")
        .attr("class", "cell")
        .attr("style", "border:1px solid black")
        .text(function(d) { return d; });
};

/**
*  getRockosMachineResultError() を呼び出せばAjaxでWebAPIに問い合わせ
*/
var getRockosMachineResultError = function(no, fromDate, toDate) {
    var Xobj = $.ajax({
        scriptCharset: 'utf-8',
        type: 'GET',
        url: 'http://rockos.co.jp:3008/v1/rest/machine/result/error.json',
        data: {
            'machineNo': no,
            'fromDate': fromDate,
            'toDate': toDate
        },
        dataType: 'json',
        success: function(data) {
            drawTable(data);
        },
        error: function(XHR,stt,err) {
            console.log(XHR.responseText);
            console.log(XHR.status);
            console.log(stt);
            console.log(err);
        }
    });
};
var getRockosMachineResultError2 = function(no, fromDate, toDate, callback) {
    var Xobj = $.ajax({
        scriptCharset: 'utf-8',
        type: 'GET',
        url: 'http://rockos.co.jp:3008/v1/rest/machine/result/error.json',
        data: {
            'machineNo': no,
            'fromDate': fromDate,
            'toDate': toDate
        },
        dataType: 'json',
        success: function(data) {
            callback(null, data);
        },
        error: function(XHR,stt,err) {
            callback({err:XHR.responseText});
            console.log(XHR.responseText);
            console.log(XHR.status);
            console.log(stt);
            console.log(err);
        }
    });
};
var postRockosMachineResultError = function(id, comment, user) {
    var Xobj = $.ajax({
        scriptCharset: 'utf-8',
        type: 'POST',
        url: 'http://rockos.co.jp:3008/v1/rest/machine/result/error',
        data: {
            'id': id,
            'confirmComment': comment,
            'confirmUser': user
        },
        dataType: 'json',
        success: function(data) {
            resultErrorGetPack();
            //console.log(data);
        },
        error: function(XHR,stt,err) {
            console.log(XHR.responseText);
            console.log(XHR.status);
            console.log(stt);
            console.log(err);
        }
    });
};

var resultErrorGetPack = function() {
    var machineNo = "";
    var nowDate = new Date;
    var fromDate = "";
    var toDate = "";
    if ($("#machineNo").val().length <= 0) {
        machineNo = "1";
    } else {
        machineNo = $("#machineNo").val();
    }
    switch($("#fromYear").val().length) {
        case 0:
            fromDate += "" + nowDate.getFullYear();
        break;
        case 1:
            fromDate += "200" + $("#fromYear").val();
        break;
        case 2:
            fromDate += "20" + $("#fromYear").val();
        break;
        case 3:
            fromDate += "2" + $("#fromYear").val();
        break;
        default:
            fromDate += $("#fromYear").val().slice(0,4);
    }
    if ($("#fromMonth").val().length <= 0) {
        //fromDate += ("00" + (nowDate.getMonth() + 1)).slice(-2);
        //@demo
        fromDate += "05";
    } else {
        fromDate += ("00" + $("#fromMonth").val()).slice(-2);
    }
    if ($("#fromDay").val().length <= 0) {
        //fromDate += ("00" + nowDate.getDate()).slice(-2);
        //@Demo
        fromDate += "01";
    } else {
        fromDate += ("00" + $("#fromDay").val()).slice(-2);
    }
    if ($("#fromHour").val().length + $("#fromMinute").val().length > 0) {
        if ($("#fromHour").val().length <= 0) {
            fromDate += "00";
        } else {
            fromDate += ("00" + $("#fromHour").val()).slice(-2);
        }
        if ($("#fromMinute").val().length <= 0) {
            fromDate += "00";
        } else {
            fromDate += ("00" + $("#fromMinute").val()).slice(-2);
        }
    }
    switch($("#toYear").val().length) {
        case 0:
            toDate += "" + nowDate.getFullYear();
        break;
        case 1:
            toDate += "200" + $("#toYear").val();
        break;
        case 2:
            toDate += "20" + $("#toYear").val();
        break;
        case 3:
            toDate += "2" + $("#toYear").val();
        break;
        default:
            toDate += $("#toYear").val().slice(0,4);
    }
    if ($("#toMonth").val().length <= 0) {
        //toDate += ("00" + (nowDate.getMonth() + 1)).slice(-2);
        //@Demo
        toDate += "05";
    } else {
        toDate += ("00" + $("#toMonth").val()).slice(-2);
    }
    if ($("#toDay").val().length <= 0) {
        //toDate += ("00" + nowDate.getDate()).slice(-2);
        //@Demo
        toDate += "31";
    } else {
        toDate += ("00" + $("#toDay").val()).slice(-2);
    }
    if ($("#toHour").val().length + $("#toMinute").val().length > 0) {
        if ($("#toHour").val().length <= 0) {
            toDate += "00";
        } else {
            toDate += ("00" + $("#toHour").val()).slice(-2);
        }
        if ($("#toMinute").val().length <= 0) {
            toDate += "00";
        } else {
            toDate += ("00" + $("#toMinute").val()).slice(-2);
        }
    }
    getRockosMachineResultError(machineNo, fromDate, toDate);
};
var resultErrorGetPack2 = function() {
    var machineNo = "";
    var nowDate = new Date;
    var fromDate = "";
    var toDate = "";
    if ($("#machineNo").val().length <= 0) {
        machineNo = "1";
    } else {
        machineNo = $("#machineNo").val();
    }
    switch($("#fromYear").val().length) {
        case 0:
            fromDate += "" + nowDate.getFullYear();
        break;
        case 1:
            fromDate += "200" + $("#fromYear").val();
        break;
        case 2:
            fromDate += "20" + $("#fromYear").val();
        break;
        case 3:
            fromDate += "2" + $("#fromYear").val();
        break;
        default:
            fromDate += $("#fromYear").val().slice(0,4);
    }
    if ($("#fromMonth").val().length <= 0) {
        //fromDate += ("00" + (nowDate.getMonth() + 1)).slice(-2);
        //@demo
        fromDate += "05";
    } else {
        fromDate += ("00" + $("#fromMonth").val()).slice(-2);
    }
    if ($("#fromDay").val().length <= 0) {
        //fromDate += ("00" + nowDate.getDate()).slice(-2);
        //@Demo
        fromDate += "01";
    } else {
        fromDate += ("00" + $("#fromDay").val()).slice(-2);
    }
    if ($("#fromHour").val().length + $("#fromMinute").val().length > 0) {
        if ($("#fromHour").val().length <= 0) {
            fromDate += "00";
        } else {
            fromDate += ("00" + $("#fromHour").val()).slice(-2);
        }
        if ($("#fromMinute").val().length <= 0) {
            fromDate += "00";
        } else {
            fromDate += ("00" + $("#fromMinute").val()).slice(-2);
        }
    }
    switch($("#toYear").val().length) {
        case 0:
            toDate += "" + nowDate.getFullYear();
        break;
        case 1:
            toDate += "200" + $("#toYear").val();
        break;
        case 2:
            toDate += "20" + $("#toYear").val();
        break;
        case 3:
            toDate += "2" + $("#toYear").val();
        break;
        default:
            toDate += $("#toYear").val().slice(0,4);
    }
    if ($("#toMonth").val().length <= 0) {
        //toDate += ("00" + (nowDate.getMonth() + 1)).slice(-2);
        //@Demo
        toDate += "05";
    } else {
        toDate += ("00" + $("#toMonth").val()).slice(-2);
    }
    if ($("#toDay").val().length <= 0) {
        //toDate += ("00" + nowDate.getDate()).slice(-2);
        //@Demo
        toDate += "31";
    } else {
        toDate += ("00" + $("#toDay").val()).slice(-2);
    }
    if ($("#toHour").val().length + $("#toMinute").val().length > 0) {
        if ($("#toHour").val().length <= 0) {
            toDate += "00";
        } else {
            toDate += ("00" + $("#toHour").val()).slice(-2);
        }
        if ($("#toMinute").val().length <= 0) {
            toDate += "00";
        } else {
            toDate += ("00" + $("#toMinute").val()).slice(-2);
        }
    }
    getRockosMachineResultError2(machineNo, fromDate, toDate, function(err, data) {
        var templ = Hogan.compile($('#templ').text());
        $('#resultError *').remove();
        $('#resultError').append(templ.render(data));
        console.log(data);
    });
};

var resultErrorPostPack = function() {
    var id = $("input.radio[name='resultError']:checked").val();
    var comment = $("#comment").val();
    var user = $("#user").val();
    postRockosMachineResultError(id, comment, user);
};



/**
 *  snowshoe-Machinestatus.htm
 */


var initRockosMachineStatus = function() {
    var elePow = lcs7seg.create('#machineView div.elePow');
    var revNum = lcs7seg.create('#machineView div.revNum');
    var tempMc = lcs7seg.create('#machineView div.tempMc');
    var pressMc = lcs7seg.create('#machineView div.pressMc');
    var LG1 = $.extend(true, {}, lcsLinegraph);

    var socket122 = io.connect("http://rockos.co.jp:3008/scr/122");

    socket122.on("graph01", function (data) {
       //console.log(data);
       //debugXp(data);
       LG1.graphMove(data.valueX,data.valueY,data.valueZ);
    });

    var getRockosMachineStatus = function(no) {
        var Xobj = $.ajax({
            scriptCharset: 'utf-8',
            type: 'GET',
            url: 'http://rockos.co.jp:3008/v1/rest/machine/status.json',
            data: {
                'machineNo' : no
            },
            success: function(data) {
                $("#gauge01").gauge('setValue',data.elePow);
                $("#gauge02").gauge('setValue',data.revNum);
                $("#gauge03").gauge('setValue',data.tempMc);
                $("#gauge04").gauge('setValue',data.pressMc);
                elePow.draw(data.elePow-0);
                revNum.draw(data.revNum-0);
                tempMc.draw(data.tempMc-0);
                pressMc.draw(data.pressMc-0);
                //LG1.graphMove(data.elePow,data.revNum,data.tempMc,data.pressMc);
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
            },
            error: function(XHR,stt,err) {
                console.log(XHR.responseText);
                console.log(XHR.status);
                console.log(stt);
                console.log(err);
            },
            dataType: 'json'
        });
    };

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

    elePow.init({
        "fig": 3,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    elePow.draw(0);

    revNum.init({
        "fig": 3,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    revNum.draw(0);

    tempMc.init({
        "fig": 3,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    tempMc.draw(0);

    pressMc.init({
        "fig": 3,
        "ratio": 0.6,
        "backColor": "rgb(51,51,51)",
        "color": "rgb(255,255,255)"
    });
    pressMc.draw(0);

    LG1.dataInit(
        { id: "#linegraph01"
         ,margin:{
             top: 10
            ,right: 10
            ,bottom: 30
            ,left: 40
          }
         ,WIDTH: 850
         ,HEIGHT: 150
         ,yMax: 1000
         ,yText: ""
         ,dMax: 101
         ,Xaxis: {ticks: 20}
         ,Yaxis: {ticks: 5}
         ,Xrule: {draw: true, ticks: 20}
         ,Yrule: {draw: true, ticks: 5}
         ,data1: {use: true, color: "#00f", width: 2}
         ,data2: {use: true, color: "#f29", width: 2}
         ,data3: {use: true, color: "#3b7", width: 2}
         ,data4: {use: true, color: "#bb7", width: 2}
         ,color: {face: "#fff", back: "#333"}
        }
    );
    LG1.graphDraw();

    /* ここからAjaxスタート */
    var getData = function(no) {
        getRockosMachineStatus(no);
        setTimeout(function() {
            getData(no);
        }, 1000);
    }
    getData(1);
};

