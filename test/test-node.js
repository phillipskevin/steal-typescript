var mocha = require('mocha');
var assert = require('chai').assert;
var stealTools = require('steal-tools');

describe('steal-typescript', function() {
    it('build - js-main', function() {
        return stealTools.build({
            config: __dirname + '/../package.json!npm',
            main: 'examples/js-main/exclaim.ts!steal-typescript'
        }, {
            dest: __dirname + '/../examples/js-main/dist'
        })
        .then(function() {
            assert.ok(true, 'should work');
        })
        .catch(function(err) {
            assert.ok(false, err);
        });
    });

    it('build - ts-main', function() {
        return stealTools.build({
            config: __dirname + '/../package.json!npm',
            main: 'examples/ts-main/src/exclaim.ts!steal-typescript'
        }, {
            dest: __dirname + '/../examples/ts-main/dist'
        })
        .then(function() {
            assert.ok(true, 'should work');
        })
        .catch(function(err) {
            assert.ok(false, err);
        });
    });
});