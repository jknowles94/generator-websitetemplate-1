// To check for new package updates see https://www.npmjs.com/package/npm-check-updates
module.exports = function (grunt) {

    // Configurable options
    var config = {
        sassPath:       'assets/sass',
        cssPath:        'assets/styles',
        imagesPath:     'assets/images',
        jsPath:         'assets/scripts',
        sourcemap:      false,
        outputStyle:    'expanded' // Used for SASS, expanded is for development, compressed is for live
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Project options
        config: config,

        // Compass options used to compile SASS into CSS
        compass: {
            dev: {
                options: {
                    sassDir: '<%%= config.sassPath %>',
                    cssDir: '<%%= config.cssPath %>',
                    environment: 'development',
                    sourcemap: '<%%= config.sourcemap %>'
                }
            },
            live: {
                options: {
                    sassDir: '<%%= config.sassPath %>',
                    cssDir: '<%%= config.cssPath %>',
                    environment: 'production'
                }
            }
        },


        // Compile SASS using grunt-sass(libsass)
        sass: {
            options: {
                sourceMap: '<%= config.sourcemap %>',
                outputStyle: '<%= config.outputStyle %>'
            },
            dist: {
                files: {
                    '<%= config.cssPath %>/main.css': '<%= config.sassPath %>/main.scss'
                }
            }
        },


        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'last 3 Explorer versions'], 
                map: '<%%= config.sourcemap %>'
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
            options: {
                livereload: true
            },

            html: {
                files: ['index.html','styleguide.html','template.html']
            },

            // compass: {
            //     files: ['<%%= config.sassPath %>/{,*/}*.{scss,sass}'],
            //     tasks: ['compass:dev', 'autoprefixer', 'notify:compass']
            // },

            sass: {
                files: ['<%= config.sassPath %>/{,*/}*.{scss,sass}'],
                tasks: ['sass', 'autoprefixer', 'notify:sass']
            },

            jshint: {
                files: ['<%%= config.jsPath %>/main.js'],
                tasks: ['jshint']
            }

        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : '<%%= config.cssPath %>/main.css'
                },
                options: {
                    proxy: '<%= local_address %>',
                    watchTask: true
                }
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
            },

            sass: {
              options: {
                title: '<%= website_name %>',
                message: 'SASS compiled',
              }
            }
        },


        // Reads the js files from the specified html file and generates the concat & uglify config, run with grunt buildJS
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
                    '<%%= config.jsPath %>/main.min.js': ['<%%= config.jsPath %>/main.js'],
                    '<%%= config.jsPath %>/modernizr.min.js': ['<%%= config.jsPath %>/modernizr.js']
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
    grunt.registerTask('default', ['sass', 'autoprefixer']);
    grunt.registerTask('watchsync', ['browserSync', 'watch']);
    grunt.registerTask('setup', ['clean:precommit','shell:precommit','clean:pull','shell:pull']);
    grunt.registerTask('live', ['jshint', 'uglify', 'compass:live', 'autoprefixer', 'cssmin']);
    grunt.registerTask('buildJS', ['useminPrepare','concat:generated']);
};