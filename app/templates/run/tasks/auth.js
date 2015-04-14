'use strict';
var AuthUtil = require('../run_auth');

module.exports = function(grunt) {

  var service = grunt.getService();

  grunt.registerTask('authTask', 'Create a set of authentication credentials', function() {
    var done = this.async();

    var hdlr = AuthUtil.handlers[service.auth.type];
    hdlr(service, function(auth) {
      AuthUtil.storeCredentials(auth);
      done();
    });
  });

  grunt.registerTask('authRefreshTask', 'Refresh an authentication', function() {
    var done = this.async();

    // Check this is oauth2
    if(service.auth.type !== 'oauth2') {
      grunt.fail.fatal('Only able to refresh OAuth2 services.');
    }

    if(!grunt.credentials) {
      grunt.fail.fatal('Unable to load existing authentication to refresh');
    }

    AuthUtil.refresh(service, grunt.credentials, function(err, newCredentials) {
      AuthUtil.storeCredentials(newCredentials);
      done();
    });
  });

  grunt.registerTask('auth', ['env', 'authTask']);
  grunt.registerTask('auth:refresh', ['env', 'authRefreshTask']);
};
