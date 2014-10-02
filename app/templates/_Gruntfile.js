module.exports = function (grunt) {

    // Configurable paths
    var config = {
        sassPath:   'assets/sass',
        cssPath:    'assets/styles',
        imagesPath: 'assets/images',
        jsPath:     'assets/scripts'
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Project paths
        config: config,

        // Compass options used to compile SASS into CSS
        compass: {
            dev: {
                options: {
                    sassDir: '<%%= config.sassPath %>',
                    cssDir: '<%%= config.cssPath %>',
                    imagesDir: '<%%= config.imagesPath %>',
                    environment: 'development',
                    httpGeneratedImagesPath: 'images'
                }
            },
            live: {
                options: {
                    sassDir: '<%%= config.sassPath %>',
                    cssDir: '<%%= config.cssPath %>',
                    imagesDir: '<%%= config.imagesPath %>',
                    environment: 'production',
                    httpGeneratedImagesPath: 'images'
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'last 4 Explorer versions']
            },
            dist: {
                files: [{
                    expand: true,
                    src: 'main.css',
                    cwd: '<%%= config.cssPath %>',
                    dest: '<%%= config.cssPath %>'
                }]
            }
        },

        // Watchs files for changes then compiles and reloads the browser
        watch: {

            html: {
                files: ['index.html','styleguide.html','template.html'],
                options: {
                    livereload: true
                }
            },

            compass: {
                files: ['<%%= config.sassPath %>/{,*/}*.{scss,sass}'],
                tasks: ['compass:dev', 'autoprefixer', 'notify:compass'],
                options: {
                    livereload: true
                }
            },

            jshint: {
                files: ['<%%= config.jsPath %>/main.js'],
                tasks: ['jshint']
            }

        },

        // Checks JS file for errors
        jshint: {
            all: ['<%%= config.jsPath %>/main.js'],
            options: {
                '-W099': true, // Stops mixed tabs and spaces error
            },
        },

        // Clean any pre-commit hooks in .git/hooks directory
        clean: {
            precommit: ['.git/hooks/pre-commit'],
            pull: ['.git/hooks/post-merge']
        },

        shell: {
            precommit: {
                command: 'cp git-hooks/pre-commit .git/hooks/'
            },
            pull: {
                command: 'cp git-hooks/post-merge .git/hooks/'
            }
        },

        notify: {
            compass: {
              options: {
                title: '<%= website_name %>', 
                message: 'Compass compiled',
              }
            }
        },


        // Reads the js files from the specified html file and generates the concat string so your js is in the right order. Run with grunt useminPrepare and it will give you the correct config for your concat, just remove the .tmp/concat/ from the destination file string -  https://github.com/yeoman/grunt-usemin
        useminPrepare: {
            html: 'template.html'
        },

        // Conatenates files
        concat: {
            build: {
                files: {
                    
                }
            }
        },

        // Minifies JS files
        uglify: {
            build: {
                files: {
                    '<%%= config.jsPath %>/plugins.min.js': ['<%%= config.jsPath %>/plugins.js'],
                    '<%%= config.jsPath %>/main.min.js': ['<%%= config.jsPath %>/main.js']
                }
            }
        },

        // Minifies CSS files
        cssmin: {
            build: {
                files: {
                    '<%%= config.cssPath %>/main.min.css': ['<%%= config.cssPath %>/main.css']
                }
            }
        }

    });

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Default task(s)
    grunt.registerTask('default', ['compass:dev', 'autoprefixer']);
    grunt.registerTask('setup', ['clean:precommit','shell:precommit','clean:pull','shell:pull']);
    grunt.registerTask('live', ['jshint', 'uglify', 'compass:live', 'autoprefixer', 'cssmin']);
};