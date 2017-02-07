var mocha = require('mocha');
var assert = require('chai').assert;

var utils = require('../utils');

describe('steal-typescript - utils', function() {
  it('correctRelativeImports', function() {
    var correctRelativeImports = utils.correctRelativeImports;

    assert.deepEqual(
      correctRelativeImports(
        'define(["foo","./bar","../baz"], function(foo, bar, baz) {});',
        'abc/xyz'
      ),
      'define(["foo","abc/xyz/bar","abc/baz"], function(foo, bar, baz) {});',
      'basics work');

    assert.deepEqual(
      correctRelativeImports(
        'define(["foo","./bar","../baz"], function(foo, bar, baz) {});',
        'abc/xyz',
        'ts'
      ),
      'define(["foo","abc/xyz/bar.ts","abc/baz.ts"], function(foo, bar, baz) {});',
      'passing an extension works');

    assert.deepEqual(
      correctRelativeImports(
        "function aFunction() { console.log('blah'); }" +
        'define(["foo", "./bar", "../baz"], function(foo, bar) {});',
        'abc/xyz'
      ),
      "function aFunction() { console.log('blah'); }" +
      'define(["foo","abc/xyz/bar","abc/baz"], function(foo, bar) {});',
      'works when there is other code before define block');

    assert.deepEqual(
      correctRelativeImports(
        'define(["foo","./bar"], function(foo, bar) {});',
        ''
      ),
      'define(["foo","bar"], function(foo, bar) {});',
      './ in the root directory works');
  });

  it('normalize', function() {
    var normalize = utils.normalize;

    assert.equal(normalize('foo/bar/./baz'), 'foo/bar/baz', './ works');
    assert.equal(normalize('foo/bar/../baz'), 'foo/baz', '../ works');
    assert.equal(normalize('./foo/bar'), 'foo/bar', 'starting with ./ works');
  });


  it('dissectModuleName', function() {
    var dissectModuleName = utils.dissectModuleName;

    var path = 'examples/ts-main/src';
    var file = 'index.ts';
    var plugin = 'steal-typescript@0.4.0#typescript';
    var project = '';

    assert.deepEqual(
      // examples/ts-main/src/index.ts!steal-typescript@0.4.0#typescript
      dissectModuleName(
        project + '#' +
        path + '/' +
        file + '!' +
        plugin
      ), {
        project: project,
        path: path,
        file: path + '/' + file,
        plugin: plugin
      });
  });

  it('moduleName', function() {
    var moduleName = utils.moduleName;

    assert.equal(
      moduleName(
        '/home/kevin/dev/steal-typescript/examples/ts-main/src/exclaim.js',
        'examples/ts-main/src'
      ),
      'examples/ts-main/src/exclaim'
      );
  });

  it('removeExtension', function() {
    var removeExtension = utils.removeExtension;

    assert.equal(removeExtension('foo/bar/baz.xyz'), 'foo/bar/baz');
  });
});
