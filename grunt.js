module.exports = function(grunt) {
  grunt.initConfig({
    typescript: {
      base: {
        src: ['./src/ts/**/*.ts'],
        dest: './src/scripts/',
        options: {
          module: 'amd'
        }
      }
    }
  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', 'typescript');
};