module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        copy : {
            main : {
                src : 'src/index.html',
                dest : 'build/index.html'
            },
            server : {
                src : 'src/server.html',
                dest : 'build/server.html'
            },
            stompjs : {
                src : 'node_modules/stompjs/lib/stomp.min.js',
                dest : 'build/stomp.min.js'
            },
            planetEditor : {
                src : 'src/planet-editor.html',
                dest : 'build/planet-editor.html'
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

        requirejs : {
            compile : {
                options : {
                    baseUrl : 'src',
                    name : 'client/Triangles',
                    optimize : 'uglify',
                    mainConfigFile : 'config/requireconfig.js',
                    out : 'build/Triangles.js',
                }
            },
            compileServer : {
                options : {
                    baseUrl : 'src',
                    name : 'server/server',
                    optimize : 'uglify',
                    mainConfigFile : 'config/requireconfig.js',
                    out : 'build/server.js',
                }
            }, compilePlanetEditor : {
                options : {
                    baseUrl : 'src',
                    name : 'editor/PlanetEdit',
                    optimize : 'uglify',
                    mainConfigFile : 'config/requireconfig.js',
                    out : 'build/PlanetEdit.js',
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
            build : {
                files : ['src/**/*.js', 'test/**/*.js'],
                tasks : ['jshint', 'requirejs', 'exec:reload'],
                options : {
                    spawn : false
                }
            },

            qunit : {
                files : ['src/**/*.js', 'test/**/*.js'],
                tasks : ['qunit'],
                options : {
                    spawn : false
                }
            }
        },

        exec : {
            reload: './reloader'
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['jshint', 'copy', 'requirejs', 'qunit']);
};
