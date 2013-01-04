var socket = io.connect("/error");
sockEventShowError(socket);

var socket904 = io.connect("/scr/904");

socket904.on("message_bar", function (data) {
    err = document.getElementById("mesg_bar");
    err.className = "mesg_bar " + data.color;
    err.innerText = data.mesg;
});

function debugXp(str) {
    $("#debugtxt").html(
        $("#debugtxt").html() + str + "<br>");
};

var XMAX = 0;
var YMAX = 0;
var LIMWIDTH = 0;
var LIMHEIGHT = 0;
var PANELSIZE = {};

socket904.on("zaika", function (data) {
    var objfilter = 'div[panel="' + data.id + '"] p';
    if (data.act == 'dead') {
        $(objfilter).fadeOut("slow", function() {
            $(this).removeClass('zaika');
        });
    }
    if (data.act == 'born') {
        $(objfilter).fadeIn("slow", function() {
            $(this).addClass('zaika');
        });
    }
});
socket904.on("move", function (data) {
    var movey = "+=0px",
        movex = "+=0px",
        objfilter = 'div[panel="' + data.id + '"]';
    if (data.act == 'up') {
        movey = "-=" + PANELSIZE.width + "px";
    }
    if (data.act == 'down') {
        movey = "+=" + PANELSIZE.width + "px";
    }
    if (data.act == 'left') {
        movex = "-=" + PANELSIZE.width + "px";
    }
    if (data.act == 'right') {
        movex = "+=" + PANELSIZE.width + "px";
    }
    $(objfilter).animate({
        top: movey,
        left: movex
    }, {
        "duration": "1000",
        "easing": "swing",
        "complete": function() {
            /*Todo:終了後の処理*/
        }
    });
});
/*アニメーションテスト*/
function test1(movey, movex) {

    setTimeout(function() {
        if (parseInt($('[panel="pn001"]').css("top")) + PANELSIZE.width >= YMAX * PANELSIZE.width) {
            movey = "-=" + PANELSIZE.width + "px";
        } else if (parseInt($('[panel="pn001"]').css("top")) <= 0 ) {
            movey = "+=" + PANELSIZE.width + "px";
        }
        $('div[panel="pn001"]').animate({
            top: movey,
            left: movex
        }, {
            "duration": "1000",
            "easing": "swing",
            "complete": function() {
                /*Todo:終了後の処理*/
            }
        });
        test1(movey, movex);
    },2000);
}

$(function() {
    /* on loading */
    /* デフォルト値を読み込んで描画 */
    XMAX = $('input[name="xMax"]').get(0).value;
    YMAX = $('input[name="yMax"]').get(0).value;
    LIMWIDTH = parseInt($('div.puzzle').css("width"));
    LIMHEIGHT = parseInt($('div.puzzle').css("height"));
    $('#main_body div.caption').html(
        $('#main_body div.caption').html() +
        ' ' + XMAX + ' x ' + YMAX);
    PANELSIZE.type = $('input[name="panelsize"]').get(0).value;
    switch (PANELSIZE.type) {
    case 'S':
        PANELSIZE.width = 50;
        break;
    case 'M':
        PANELSIZE.width = 100;
        break;
    case 'L':
        PANELSIZE.width = 200;
        break;
    case 'XL':
        PANELSIZE.width = 300;
        break;
    default:
        PANELSIZE.type = 'M';
        PANELSIZE.width = 100;
        break;
    }
    if (XMAX * PANELSIZE.width > LIMWIDTH) {
        $('#mesg_bar').html('描画エラー');
        $('#mesg_bar').addClass('operationPanel_fatal');
        return;
    }
    if (YMAX * PANELSIZE.width > LIMHEIGHT) {
        $('#mesg_bar').html('描画エラー');
        $('#mesg_bar').addClass('operationPanel_fatal');
        return;
    }
    for (var i = 0; i < XMAX; i++) {
        for (var j = 0; j < YMAX; j++) {
            var obj = $('input[x=' + i + '][y=' + j + ']').get(0);
            if (obj) {
                debugXp(obj.id + ':' + obj.name + ':' + obj.value); 
                var zaika = "";
                if (obj.value == "1") {
                    zaika = '<p class="zaika"></p>';
                } else {
                    zaika = '<p></p>';
                }
                $('#main_body div.puzzle').html(
                    $('#main_body div.puzzle').html() +
                    '<div panel="' + obj.id + '" type="' + obj.name + '" class="' + obj.name + '">' + 
                    zaika + '</div>');
                $('#main_body div.puzzle p:last').css( {
                    "width": (PANELSIZE.width/2) + "px",
                    "height":  (PANELSIZE.width/2) + "px",
                    "margin-left" : (PANELSIZE.width/4-2) + "px",
                    "margin-top": (PANELSIZE.width/4-2) + "px"
                });
                $('#main_body div.puzzle div:last').css( {
                    "width": (PANELSIZE.width - 3) + "px",
                    "height":  (PANELSIZE.width - 3) + "px",
                    "position": "absolute",
                    "left" : (i*PANELSIZE.width) + "px",
                    "top": (j*PANELSIZE.width) + "px",
                    "border": "1px none black"
                });
            }
        }
    } /* パネルの描画 */

    /*テスト
    var movey = "+=0px",
        movex = "+=0px";
    test1(movey, movex);
    */
});

