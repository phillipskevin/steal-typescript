var mocha = require('mocha');
var assert = require('chai').assert;
var stealTools = require('steal-tools');

describe('steal-typescript', function() {
    it('build', function() {
        return stealTools.build({
            config: __dirname + '/../package.json!npm',
            main: 'examples/greeter/exclaim.ts!steal-typescript'
        }, {
            dest: __dirname + '/../examples/greeter/dist'
        })
        .then(function() {
            assert.ok(true, 'should work');
        })
        .catch(function(err) {
            assert.ok(false, err);
        });
    });
})