var mocha = require('mocha');
var assert = require('chai').assert;
var spawn = require('child_process').spawn;

describe('steal-typescript', function() {
    it('build - js-main', function(done) {
      var build = spawn('node', ['examples/js-main/build.js']);

      build.on('close', function(code) {
        assert.equal(code, 0, 'should complete successfully');
        done();
      });
    });

    it('build - ts-main', function(done) {
      var build = spawn('node', ['examples/ts-main/build.js']);

      build.on('close', function(code) {
        assert.equal(code, 0, 'should complete successfully');
        done();
      });
    });
});
