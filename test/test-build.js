var mocha = require('mocha');
var assert = require('chai').assert;
var spawn = require('child_process').spawn;
var stealTools = require('steal-tools');

describe('steal-typescript - build', function() {
    it('build - js-main', function() {
      return stealTools.build({
        config: __dirname + '/../package.json!npm',
        main: 'examples/js-main/index'
      }, {
      })
      .then(function() {
        assert.ok(true, 'build successful');
      })
      .catch(function(err) {
        assert.ok(false, err);
      });
    });

    it('build - ts-main', function() {
      return stealTools.build({
        config: __dirname + '/../package.json!npm',
        main: 'examples/ts-main/src/index.ts!steal-typescript'
      }, {
      })
      .then(function() {
        assert.ok(true, 'build successful');
      })
      .catch(function(err) {
        assert.ok(false, err);
      });
    });
});
