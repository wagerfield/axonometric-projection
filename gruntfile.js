module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    // Package Data
    pkg: grunt.file.readJSON('package.json'),

    // Source Files
    sourceFiles: [
      'source/Core.js',
      'source/Math.js',
      'source/Matrix.js',
      'source/Quaternion.js',
      'source/Scene.js',
      'source/Node.js'
    ],

    // Concat Tasks
    concat: {
      deploy: {
        src: '<%= sourceFiles %>',
        dest: 'deploy/<%= pkg.name %>.js'
      }
    },

    // Uglify Tasks
    uglify: {
      deploy: {
        src: '<%= concat.deploy.dest %>',
        dest: 'deploy/<%= pkg.name %>.min.js'
      }
    },

    // Watch Tasks
    watch: {
      build: {
        files: ['gruntfile.js', '<%= sourceFiles %>'],
        tasks: ['build']
      }
    }
  });

  // Register Tasks
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['build', 'watch']);
};
