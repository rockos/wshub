'use strict'
/**
 *  snowshoe-MachineResultError.htm
 */

var MachineResultError_GetSend = function() {
    var url = 'http://rockos.co.jp:3008/v1/rest/machine/result/error',
        methodType = 'GET',
        args = {
            'machineNo': 1,
            'fromDate': '20130501',
            'toDate': '20130531'
        };
    var pack = new rockosPackedField();
    args.machineNo = pack.machineNo("#resultErrorQueryMachineNo", true);
    args.fromDate = pack.dateTimeA("#resultErrorQueryFromdate", true);
    args.toDate = pack.dateTimeA("#resultErrorQueryTodate", true);

    rockosRestSend(url, methodType, args, function(err, data){
        if (err) {
            rockosErrorMessage("#resultErrorQueryEmessage", err);
            return;
        }
        /* custom menbers */
        var newdata = data;
        for (var i = 0, imax = newdata.recode.length; i < imax; i++) {
            newdata.recode[i].fmtdate = rockosFormatTime(newdata.recode[i].date);
            newdata.recode[i].decodeConfirm = rockosDecodeConfirm(newdata.recode[i].confirm);
        }
        rockosDrawTable('#MachineResultError-template', '#MachineResultError-table', data);
        return;
    });
};

var MachineResultError_PostSend = function() {
    var url = 'http://rockos.co.jp:3008/v1/rest/machine/result/error',
        methodType = 'POST',
        args = {
            'id': null,
            'confirmComment': "",
            'confirmUser': ""
        };
    var pack = new rockosPackedField();
    args.id = $("#MachineResultError-table  input[name='resultError']:checked").val();
    args.confirmComment = pack.confirmComment("#resultErrorConfirmComment", true);
    args.confirmUser = pack.confirmUser("#resultErrorConfirmUser", true);
    console.log(args);

    rockosRestSend(url, methodType, args, function(err, data){
        if (err) {
            rockosErrorMessage("#resultErrorQueryEmessage", err);
            return;
        }
        MachineResultError_GetSend();
        return;
    });
};



