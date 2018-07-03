module.exports = function(grunt){

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    notify_hooks: {
      options: {
        enabled: true,
        title: "OvR Trip Lists",
        success: true
      }
    },
    manifest: {
      generate: {
        options:{
          basePath: "/",
          network:["/api", "/login","*"],
          timestamp: true,
          verbose: true,
          hash: true,
        },
      src: ["js/*.js",
            "images/*.gif",
            "images/*.jpg",
            "images/*.png",
            "images/ios/*.png",
            "images/ios/iconset/*.png",
            "fonts/*",
            "css/application.min.css",
            "*.html",
            "*.php",
            "lists.version"],
      dest: "manifest.appcache"
      },
    },
    csslint: {
      strict: {
        options: {
          ids: false,
          "box-model": false,
          important: false
        },
        src: ['lists/css/lists.css', 'css/simple-sidebar.css']
      },
    },
    jshint: {
      grunt: {
        src: ['Gruntfile.js'],
      },
      admin: {
        src: ['js/partials/_admin.js'],
      },
      common: {
        src: ['js/partials/_common.js'],
      },
      lists: {
        src: ['js/partials/_lists.js'],
      },
      message: {
        src: ['js/partials/_message.js'],
      },
      reports: {
        src: ['js/partials/_reports.js'],
      },
      settings: {
        src: ['js/partials/_settings.js'],
      },
      summary: {
        src: ['js/partials/_summary.js'],
      },
    },
    phplint: {
      api: {
        src: ['api/index.php'],
      },
      main: {
        src: ['index.php', 'list.php', 'message.php', 'reports.php', 'summary.php'],
      },
    },
    cssmin: {
      target: {
        src: ['css/application.css'],
        dest: 'css/application.min.css',
      }
    },
    concat: {
      css: {
        src: ['css/bootstrap.css','css/fontawesome-all.css','css/simple-sidebar.css','css/lists.css'],
        dest: 'css/application.css',
      },
      vendor: {
        options: {
          separator: ';',
        },
        src: ['js/vendor/jquery.js','js/vendor/bootstrap.js','js/vendor/jquery.storageapi.min.js', 'js/vendor/moment.min.js',
              'js/vendor/jquery.chained.js','js/vendor/jquery.tinysort.min.js', 'js/vendor/detectmobilebrowser.js'],
        dest: 'js/partials/_vendor.js',
      },
      lists: {
        options: {
          separator: ';',
        },
        src: ['js/partials/_vendor.js','js/partials/_common.js', 'js/partials/_lists.js'],
        dest: 'js/lists.min.js',
      },
      message: {
        options: {
          separator: ';',
        },
        src: ['js/partials/_vendor.js','js/partials/_common.js','js/partials/_message.js'],
        dest: 'js/message.min.js',
      },
      reports: {
        options: {
          separator: ';',
        },
        src: ['js/partials/_vendor.js', 'js/partials/_common.js', 'js/partials/_reports.js'],
        dest: 'js/reports.min.js',
      },
      settings: {
        options: {
          separator: ';',
        },
        src: ['js/partials/_vendor.js', 'js/partials/_common.js', 'js/partials/_settings.js'],
        dest: 'js/settings.min.js',
      },
      summary: {
        options: {
          separator: ';',
        },
        src: ['js/partials/_vendor.js', 'js/partials/_common.js', 'js/partials/_summary.js'],
        dest: 'js/summary.min.js',
      },
      admin: {
        options: {
          separator: ';',
        },
        src: ['js/partials/_vendor.js', 'js/partials/_common.js', 'js/partials/_admin.js'],
        dest: 'js//admin.min.js',
      },
    },
    uglify: {
      admin: {
        options: {
          mangle: false,
          preserveComments: false,
          title: 'Admin Uglify',
          message: 'admin uglify complete',
        },
        files: {
          'js/admin.min.js': ['js/admin.min.js']
        }
      },
      lists: {
        options: {
          mangle: false,
          preserveComments: false
        },
        files: {
          'js/lists.min.js': ['js/lists.min.js']
        }
      },
      message: {
        options: {
          mangle: false,
          preserveComments: false
        },
        files: {
          'js/message.min.js': ['js/message.min.js']
        }
      },
      reports: {
        options: {
          mangle: false,
          preserveComments: false
        },
        files: {
          'js/reports.min.js': ['js/reports.min.js']
        }
      },
      settings: {
        options: {
          mangle: false,
          preserveComments: false
        },
        files: {
          'js/settings.min.js': ['js/settings.min.js']
        }
      },
      summary: {
        options: {
          mangle: false,
          preserveComments: false
        },
        files: {
          'js/summary.min.js': ['js/summary.min.js']
        }
      },
    },
    watch: {
      grunt: {
        files: ['Gruntfile.js'],
      },
      admin: {
        files: ['js/partials/_admin.js'],
        tasks: ['jshint:admin','concat:admin', 'uglify:admin','manifest'],
      },
      api: {
        files: ['api/index.php'],
        tasks: ['phplint','manifest'],
      },
      common: {
        files: ['js/partials/_common.js'],
        tasks: ['jshint:common', 'concat', 'uglify', 'manifest'],
      },
      css: {
        files: ['css/lists.css', 'css/simple-sidebar.css'],
        tasks: ['csslint','concat:css', 'cssmin','manifest'],
      },
      html: {
        files: ['*.html'],
        tasks: ['manifest'],
      },
      lists: {
        files: ['js/partials/_lists.js'],
        tasks: ['jshint:lists','concat:lists', 'uglify:lists','manifest'],
      },
      message: {
        files: ['js/partials/_message.js'],
        tasks: ['jshint:message','concat:message', 'uglify:message','manifest'],
      },
      reports: {
        files: ['js/partials/_reports.js'],
        tasks: ['jshint:reports','concat:reports', 'uglify:reports','manifest'],
      },
      settings: {
        files: ['js/partials/_settings.js'],
        tasks: ['jshint:settings','concat:settings', 'uglify:settings','manifest'],
      },
      summary: {
        files: ['js/partials/_summary.js'],
        tasks: ['jshint:summary','concat:summary', 'uglify:summary','manifest'],
      },
      vendor: {
        files: ['js/vendor/*.js'],
        tasks: ['concat:vendor','concat', 'uglify', 'manifest'],
      },
      mainPHP: {
        files: ['admin.php','index.php', 'list.php', 'message.php', 'reports.php', 'summary.php'],
        tasks: ['phplint:main', 'manifest'],
      },
      version: {
        files: ['lists.version'],
        tasks: ['manifest'],
      },
    },
    less: {
      development:{
        options: {
          paths: ["wp-content/themes/ovr/less"],
        },
        files: {"wp-content/themes/ovr/summer.css": "wp-content/themes/ovr/less/summer.less",
        "wp-content/themes/ovr/winter.css":"wp-content/themes/ovr/less/winter.less",
        "wp-content/themes/ovr/philly.css":"wp-content/themes/ovr/less/philly.less"}
        }
      }
  });


  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-phplint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-contrib-less');
  // Tasks
  grunt.registerTask('default', ['csslint','jshint','concat','uglify','cssmin','phplint', 'manifest']);

};
