function releaseGrunt(grunt) {
    var proDir = '/home/locos/project/rel_v0.1.3/';
    var devDir = '/home/locos/project/somali/';
    var gruntCmd = {};
    var subDir = "";

    /* minify 指定 */
    gruntCmd.min = {};

    /* ディレクトリ階層を再帰的にサーチ */
    var hierSearch = function(dir,next) {
        var files = require('fs').readdirSync(devDir + dir + '/');
        for (var i=0, imax=files.length; i < imax; i++) {
            var fstat = require('fs').statSync(devDir + dir + '/' + files[i]);
            if (fstat.isFile()) {
                var regx = new RegExp('\\.js$', 'i');
                if (files[i].match(regx)) {
                    gruntCmd.min[files[i]] = {};
                    gruntCmd.min[files[i]].src = [];
                    gruntCmd.min[files[i]].src[0] = devDir + dir + '/' + files[i];
                    gruntCmd.min[files[i]].dest = proDir + dir + '/' + files[i];
                }
            }
            if (fstat.isDirectory()) {
                hierSearch(dir + '/' + files[i], function() {

                });
            }
        }
        next(); 
    }

    /* root 配下 */
    var files = require('fs').readdirSync(devDir);
    for (var i=0, imax=files.length; i < imax; i++) {
        var fstat = require('fs').statSync(devDir + files[i]);
        if (fstat.isFile()) {
            var regx = new RegExp('\\.js$', 'i');
            if (files[i].match(regx)) {
                gruntCmd.min[files[i]] = {};
                gruntCmd.min[files[i]].src = [devDir + files[i]];
                gruntCmd.min[files[i]].dest = proDir + files[i];
            }
        }
        if (fstat.isDirectory()) {
            //filters
            var regx = new RegExp('(controller|lib)', 'i');
            if (files[i].match(regx)) {
                hierSearch(files[i], function() {

                });
            }
        }
    }

    grunt.initConfig(gruntCmd);


}
/**
 * このファイルはリリース版の/utilに置いて下さい
 */
module.exports = function(grunt) {
    /* example */
    grunt.initConfig({
            min : {
                libsocket : {
                    // minify元のファイル名
                    src: ['../../std/public/javascripts/rcs/libsocket.js'],
                    // minify先のファイル名
                    dest: '../../std/public/javascripts/rcs/libsocket.min.js'
                }
                ,scr901 : {
                    // minify元のファイル名
                    src: ['../views/javascripts/scr901.js'],
                    // minify先のファイル名
                    dest: '../views/javascripts/min/scr901.min.js'
                }
                ,scr902 : {
                    // minify元のファイル名
                    src: ['../views/javascripts/scr902.js'],
                    // minify先のファイル名
                    dest: '../views/javascripts/min/scr902.min.js'
                }
                ,scr903 : {
                    // minify元のファイル名
                    src: ['../views/javascripts/scr903.js'],
                    // minify先のファイル名
                    dest: '../views/javascripts/min/scr903.min.js'
                }
                ,scr904 : {
                    // minify元のファイル名
                    src: ['../views/javascripts/scr904.js'],
                    // minify先のファイル名
                    dest: '../views/javascripts/min/scr904.min.js'
                }
                ,scr104 : {
                    // minify元のファイル名
                    src: ['../views/javascripts/scr104.js'],
                    // minify先のファイル名
                    dest: '../views/javascripts/min/scr104.min.js'
                }
                ,scr103 : {
                    // minify元のファイル名
                    src: ['../views/javascripts/scr103.js'],
                    // minify先のファイル名
                    dest: '../views/javascripts/min/scr103.min.js'
                }
            }
        });
   /* */
   //releaseGrunt(grunt);
};
