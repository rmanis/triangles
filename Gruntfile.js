module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),

        copy : {
            main : {
                src : 'src/index.html',
                dest : 'build/index.html'
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['jshint', 'uglify', 'qunit', 'copy']);
};
