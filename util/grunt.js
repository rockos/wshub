module.exports = function(grunt) {
    grunt.initConfig({
            /*
            concat: {
                dist: {
                    // 結合元となるファイル
                    src: [
                          'SyntaxHighlighter/js/shCore.js',
                          'SyntaxHighlighter/js/shBrushJScript.js',
                          'SyntaxHighlighter/js/shBrushCss.js',
                          'SyntaxHighlighter/js/shBrushXml.js',
                          'SyntaxHighlighter/js/shBrushCSharp.js',
                          'SyntaxHighlighter/js/shBrushFSharp.js',
                    'SyntaxHighlighter/js/shBrushTypeScript.js'
                          ],
                    // 結合先のファイル名
                    dest: 'SyntaxHighlighter/js/shBrushAll.js'
                }
            },
            */
            min : {
                dist : {
                    // minify元のファイル名
                    src: ['../public/javascripts/rcs/libsocket.js'],
                    // minify先のファイル名
                    dest: '../public/javascripts/rcs/libsocket.min.js'
                }
            }
        });
};
