/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib');

	grunt.initConfig({
		watch: {
            options: {
                livereload: true 
            },
			files: ['grunt.js', 'lib/**', 'src/**', 'test/**', 'templates/**'],
			tasks: 'lint qunit recess'
		}
	});

	// grunt.registerTask('default', 'lint qunit');
	// grunt.registerTask('devserver', 'lint qunit server watch');
};
