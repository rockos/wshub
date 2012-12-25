var addr = {};

addr = JSON.parse(require('fs').readFileSync(ROOTDIR + '/src/ini/data/seq901-test1.json'));

/**
 *  GET index.
 */
exports.index = {
    html: function(req, res){
        var data = "";
        for (key in addr) {
            data += "<div><p>" + key + "</p><p>" + addr[key] + "</p></div>\n";
        }
        res.send(data);
    },

    json: function(req, res){
        res.send(addr);
    },

    xml: function(req, res){
        var data = "";
        data += "<address>";
        for (key in addr) {
            data += "<" + key + ">" + addr[key] + "</" + key + ">\n";
        }
        data += "</address>";
        res.send(data);
    }
};

/**
 * POST create.
 */

exports.create = function(req, res){
    res.send('created');
};

/**
 * GET show.
 */

exports.show = function(req, res) {
    res.send('show');
};

