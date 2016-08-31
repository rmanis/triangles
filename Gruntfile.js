module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        copy : {
            main : {
                src : 'src/index.html',
                dest : 'build/index.html'
            },
            stompjs : {
                src : 'node_modules/stompjs/lib/stomp.min.js',
                dest : 'build/stomp.min.js'
            },
            requirejs : {
                src : 'node_modules/requirejs/require.js',
                dest : 'build/require.js'
            }
        },

        jshint : {
            all : ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options : {
                reporterOutput : ""
            }
        },

        uglify : {
            options : {
                sourceMap : true
            },
            common : {
                src : 'src/common/**/*.js',
                dest: 'build/common.min.js'
            },
            client : {
                src : 'src/client/**/*.js',
                dest: 'build/client.min.js'
            },
            server : {
                src : 'src/server/**/*.js',
                dest: 'build/server.min.js'
            }
        },

        requirejs : {
            compile : {
                options : {
                    baseUrl : 'src',
                    name : 'client/Triangles',
                    optimize : 'uglify',
                    mainConfigFile : 'config/requireconfig.js',
                    out : 'build/Triangles.js',
                }
            }
        },

        qunit : {
            all : ['test/**/*.html']
        },

        connect : {
            server : {
                options : {
                    keepalive : true,
                    port : 8000,
                    base : 'build'
                }
            }
        },

        watch : {
            scripts : {
                files : ['**/*.js'],
                tasks : ['jshint', 'uglify'],
                options : {
                    spawn : false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'copy', 'requirejs', 'qunit']);
};
