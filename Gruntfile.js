module.exports = function(grunt) {
    'use strict';
    var git = require('git-rev');

    // Project configuration.
    grunt.initConfig({
        meta : {
            fingerprint : null // generated by git-rev
        },
        requirejs : require('./.grunt/requirejs'),
        uglify : {
            build : {
                files : {
                    'bundles/patterns-<%= meta.fingerprint %>.min.js' : [
                        'bundles/patterns-<%= meta.fingerprint %>.js'
                    ]
                },
                options: {
                    preserveComments: true,
                    sourceMap: "bundles/patterns-<%= meta.fingerprint %>.min.map",
                    sourceMapRoot: "http://patternslib.com"
                }
            },
            standalone : {
                files : {
                    'bundles/patterns-standalone-<%= meta.fingerprint %>.min.js' : [
                        'bundles/patterns-standalone-<%= meta.fingerprint %>.js'
                    ]
                },
                options: {
                    preserveComments: true,
                    sourceMap: "bundles/patterns-standalone-<%= meta.fingerprint %>.min.map",
                    sourceMapRoot: "http://patternslib.com"
                }
            }
        },
        clean : {
            build : [
                'bundles/patterns*.js',
                "bundles/patterns*.map"
            ],
            test: [
                "_SpecRunner.html"
            ]
        },
        jasmine: {
            src: [],
            options: {
                template: "tests/runner.tmpl",
                vendor: [
                    "lib/requireHelper.js"
                ],
                specs: [
                    "tests/*.js"
                ]
            }
        },
        jshint: {
            sources: [
                "Gruntfile.js",
                "src/*.js",
                "src/core/.js",
                "src/patterns/*.js"
            ],
            tests: {
                src: ["tests/*.js"],
                options: {
                    jquery: true,
                    predef: [
                        "define",
                        "module",
                        "describe",
                        "it",
                        "expect",
                        "spyOn",
                        "beforeEach",
                        "afterEach",
                        "requireDependencies",
                        "jasmine"
                    ]
                }
            },
            // see: http://www.jshint.com/docs/
            options: {
                indent: 4,
                eqeqeq: true,
                browser: true,
                devel: false,
                jquery: false,

                // If we enforce, I'd like to use single, as this
                // avoids quoting when inlining html or writing jquery
                // selectors that use '"'
                //quotmark: "single",

                // Why should we mix tabs with spaces, this leads to
                // problems if somebody decided that 4 spaces would be
                // good for a tab. I'd like to avoid that discussion.
                //smarttabs: true,

                trailing: true,
                undef: true,
                unused: true,
                white: false,

                //curly: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                nonew: true,
                //strict: true,

                // XXX: I think all/some of these (except "define")
                // should be declared per file.
                predef: [
                    "requirejs",
                    "require",
                    "define",
                    "module",
                    "Markdown",
                    "Modernizr",
                    "tinyMCE"
                ]
            }
        },
        symlink : {
            bundles: {
                files : [
                    { dest: 'bundles/patterns-standalone.js',
                      src: 'bundles/patterns-standalone-<%= meta.fingerprint %>.js',
                      nonull: false},
                    { dest: 'bundles/patterns-standalone.min.js',
                      src: 'bundles/patterns-standalone-<%= meta.fingerprint %>.min.js',
                      nonull: false},
                    { dest: 'bundles/patterns.js',
                      src: 'bundles/patterns-<%= meta.fingerprint %>.js',
                      nonull: false},
                    { dest: 'bundles/patterns.min.js',
                      src: 'bundles/patterns-<%= meta.fingerprint %>.min.js',
                      nonull: false}
                ]
            }
        }
        // sass : {
        //     options : {
        //         compass : true
        //     },
        //     dist : {
        //         files : {
        //             'style/main.css' : 'style/scss/main.scss'
        //         },
        //         options : {
        //             style : 'compressed'
        //         }
        //     }
        // },
    });

    grunt.registerMultiTask('symlink', 'Create symlinks.', function() {
        grunt.task.requires('git-rev');
        var fs = require('fs');
        this.files.forEach(function(f) {
            var dest = f.dest,
                src = f.src;
            try {
                if (fs.existsSync(dest)) {
                    fs.unlinkSync(dest);
                }
                fs.symlinkSync(src, dest);
                var rel = dest.substr(0, dest.lastIndexOf('/') + 1);
                grunt.log.ok('created symlink at ' + dest +
                             ' that points to ' + src +
                             ' (relative to ' + rel +')'
                            );
            } catch(e) {
                if (e.code === 'EEXIST') grunt.log.error(dest + ' already exists, skipping');
            }
        });
    });

    grunt.registerTask('git-rev',function(){
        var done = this.async();
        git.tag(function(string){
            grunt.config('meta.fingerprint', string);
            done();
        });
    });

    grunt.registerTask('localize-demo-images','Localize Demo Images',function(){
        var done = this.async();
        runCommand('tools/localize-demo-images.sh',[], done);
    });

    grunt.registerTask('doc','Build docs',function(){
        var done = this.async();
        runCommand('sphinx-build',['-b', 'html','docs','build/docs'], done);
    });

    function runCommand(command, args, done) {
        grunt.log.write('Running ' + command + '...');
        grunt.util.spawn({
            cmd: command,
            args: args
        }, function(err, result, code) {
            if (err) grunt.log.error().error(result);
            else     grunt.log.ok().writeln(result);
            done(code);
        });
    }

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask("test", ["jasmine", "jshint"]);
    grunt.registerTask("build", [
        'git-rev',
        'requirejs',
        'uglify',
        'symlink'
    ]);
    grunt.registerTask('default', ["test", "build"]);
};

