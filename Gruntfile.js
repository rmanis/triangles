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
            all : ['Gruntfile.js', 'src/**/*.js']
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
                dest : 'build/client.min.js'
            },
            server : {
                src : 'src/server/**/*.js',
                dest: 'build/server.min.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'uglify', 'copy']);
};
