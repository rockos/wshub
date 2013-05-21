'use strict'
/**
 *  rockos rest API client common functions
 */

/**
 *  module: rockosRestSend
 *  parameter:
 *      url: rest URL
 *      methodType: GET, POST, PUT, DELETE
 *      args: rest Arguments object
 *      callback:
 *          OK function(null, data)
 *          NG function(errors)
 */
var rockosRestSend = function(url, methodType, args, callback) {
    var Xobj = $.ajax({
        scriptCharset: 'utf-8',
        dataType: 'json',
        url: url,
        type: methodType,
        data: args,
        success: function(data) {
            callback(null, data);
        },
        error: function(XHR,stt,err) {
            callback(JSON.parse(XHR.responseText));
            console.log(XHR.responseText);
            console.log(XHR.status);
            console.log(stt);
            console.log(err);
        }
    });
};

/**
 *  use Hogan of drawing
 */
var rockosDrawTable = function(templateID, drawID, jsonData) {
    var template = Hogan.compile($(templateID).text());
    $(drawID +' *').remove();
    $(drawID).append(template.render(jsonData));
    return;
};

/**
 *  packed Field
 */
var rockosPackedField = function() {
    rockosPackedField.prototype.machineNo = function(id, returnVal) {
        var machineNo = "",
            rVal = false,
            JQobj = $(id + " input.no");
        if (typeof returnVal !== "undefined") {
            if (returnVal != 0 && returnVal != "0" && returnVal != false) {
                rVal = true;
            }
        }
        if (JQobj.val().length <= 0) {
            machineNo = "1";
        } else {
            machineNo = JQobj.val();
        }
        if (rVal) {
            JQobj.val(machineNo);
        }
        return machineNo;
    };
    rockosPackedField.prototype.dateTimeA = function(id, returnVal) {
        var nowDate = new Date,
            dateTime = "",
            dateTimePack = "",
            rVal = false,
            JQobjYear = $(id + " input.year"),
            JQobjMonth = $(id + " input.month"),
            JQobjDay = $(id + " input.day"),
            JQobjHour = $(id + " input.hour"),
            JQobjMinute = $(id + " input.minute");
        if (typeof returnVal !== "undefined") {
            if (returnVal != 0 && returnVal != "0" && returnVal != false) {
                rVal = true;
            }
        }
        switch(JQobjYear.val().length) {
            case 0:
                dateTime = "" + nowDate.getFullYear();
                break;
            case 1:
                dateTime = "200" + JQobjYear.val();
                break;
            case 2:
                dateTime = "20" + JQobjYear.val();
                break;
            case 3:
                dateTime = "2" + JQobjYear.val();
                break;
            default:
                dateTime = JQobjYear.val().slice(0,4);
        }
        if (rVal) {
            JQobjYear.val(dateTime);
        }
        dateTimePack += dateTime;
        dateTime = "";

        if (JQobjMonth.val().length <= 0) {
            dateTime += ("00" + (nowDate.getMonth() + 1)).slice(-2);
        } else {
            dateTime = ("00" + JQobjMonth.val()).slice(-2);
        }
        if (rVal) {
            JQobjMonth.val(dateTime);
        }
        dateTimePack += dateTime;
        dateTime = "";

        if (JQobjDay.val().length <= 0) {
            dateTime += ("00" + nowDate.getDate()).slice(-2);
        } else {
            dateTime = ("00" + JQobjDay.val()).slice(-2);
        }
        if (rVal) {
            JQobjDay.val(dateTime);
        }
        dateTimePack += dateTime;
        dateTime = "";

        if (JQobjHour.val().length + JQobjMinute.val().length > 0) {
            if (JQobjHour.val().length <= 0) {
                dateTime = "00";
            } else {
                dateTime = ("00" + JQobjHour.val()).slice(-2);
            }
            if (rVal) {
                JQobjHour.val(dateTime);
            }
            dateTimePack += dateTime;
            dateTime = "";

            if (JQobjMinute.val().length <= 0) {
                dateTime = "00";
            } else {
                dateTime = ("00" + JQobjMinute.val()).slice(-2);
            }
            if (rVal) {
                JQobjMinute.val(dateTime);
            }
            dateTimePack += dateTime;
            dateTime = "";
        }
        return dateTimePack;
    };
    rockosPackedField.prototype.confirmComment = function(id, returnVal) {
        var comment = "",
            rVal = false,
            JQobj = $(id + " input.comment");
        if (typeof returnVal !== "undefined") {
            if (returnVal != 0 && returnVal != "0" && returnVal != false) {
                rVal = true;
            }
        }
        if (JQobj.val().length <= 0) {
            comment = "";
        } else {
            comment = JQobj.val();
        }
        if (rVal) {
            JQobj.val(comment);
        }
        return comment;
    };
    rockosPackedField.prototype.confirmUser = function(id, returnVal) {
        var user = "",
            rVal = false,
            JQobj = $(id + " input.user");
        if (typeof returnVal !== "undefined") {
            if (returnVal != 0 && returnVal != "0" && returnVal != false) {
                rVal = true;
            }
        }
        if (JQobj.val().length <= 0) {
            user = "";
        } else {
            user = JQobj.val();
        }
        if (rVal) {
            JQobj.val(user);
        }
        return user;
    };
};

/**
 *  create Field
 */
var rockosCreateField = function() {
    rockosCreateField.prototype.machineNo = function(id, string) {
        $(id).text("");
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-machineNo")
            .text(string)
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "2")
            .attr("class", "rockos-rest-machineNo no")
            ; 
        return this;
    };
    rockosCreateField.prototype.dateTimeA = function(id, string) {
        $(id).text("");
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-dateTimeA")
            .text(string)
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "4")
            .attr("class", "rockos-rest-dateTimeA year")
            ;
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-dateTimeA")
            .text("/")
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "2")
            .attr("class", "rockos-rest-dateTimeA month")
            ;
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-dateTimeA")
            .text("/")
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "2")
            .attr("class", "rockos-rest-dateTimeA day")
            ;
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-dateTimeA")
            .text(" ")
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "2")
            .attr("class", "rockos-rest-dateTimeA hour")
            ;
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-dateTimeA")
            .text(":")
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "2")
            .attr("class", "rockos-rest-dateTimeA minute")
            ;
        return this;
    };
    rockosCreateField.prototype.confirmComment = function(id, string) {
        $(id).text("");
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-confirmComment")
            .text(string)
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "50")
            .attr("class", "rockos-rest-confirmComment comment")
            ; 
        return this;
    };
    rockosCreateField.prototype.confirmUser = function(id, string) {
        $(id).text("");
        d3.select(id)
            .append("span")
            .attr("class", "rockos-rest-confirmUser")
            .text(string)
            ;
        d3.select(id)
            .append("input")
            .attr("type", "text")
            .attr("maxlength", "25")
            .attr("class", "rockos-rest-confirmUser user")
            ; 
        return this;
    };
};

var rockosErrorMessage = function(id, message) {
    $(id).html("<p>" + message.message + "</p>");
    $(id).dialog({
        modal: false,
        buttons: {
            'OK': function() {
                $( this ).dialog( "close" );
            }
        }
    });
};

var rockosFormatTime = function(time) {
    var fmt = "";
    fmt = time.substr(0,4) + "/" +
          time.substr(4,2) + "/" +
          time.substr(6,2) + " " +
          time.substr(8,2) + ":" +
          time.substr(10,2);
    return fmt;
};

var rockosDecodeConfirm = function(confirm) {
    var decode = "";
    if (confirm) {
        decode = "◯";
    }
    return decode;
}
