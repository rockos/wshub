/*
 * application library
 * date 1.jun.2012
 */


exports.isSession = function (session) {
    if (session.userid) {
		return true;
    } else {
		return false;
    }
};

/**
 * Module definitions
 * @module lcsAp
 */
module.exports = lcsAp;

/*
 * lcsAp
 */
function lcsAp(option) {
  var libfsCalled = false;

};

/*
 * Prottotype function definition
 */
lcsAp.prototype.isSession = function (session) {
    if (session.userid) {
		return true;
    } else {
		return false;
    }
};

