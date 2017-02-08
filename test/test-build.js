var mocha = require('mocha');
var assert = require('chai').assert;
var spawn = require('child_process').spawn;
var stealTools = require('steal-tools');
var sinon = require('sinon');

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

    it('build - unreachable-code', function() {
      var warnSpy = sinon.spy(console, 'warn');

      return stealTools.build({
        config: __dirname + '/../package.json!npm',
        main: 'examples/unreachable-code/src/index.ts!steal-typescript'
      }, {
      })
      .then(function() {
        assert.equal(warnSpy.callCount, 0, 'no warnings given for unreachable code');
        assert.ok(true, 'build successful');
      })
      .catch(function(err) {
        assert.ok(false, err);
      });
    });
});
