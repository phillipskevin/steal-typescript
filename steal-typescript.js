var ts = require('typescript');
var loader = require('@loader');
var assign = require('object-assign');


// translate hook will transpile TypeScript to JavaScript
// hook will only be called for .ts files
exports.translate = function(load) {
  var useSourceMap = loader.isPlatform('window');
  var sourceMapDelimiter = '//# sourceMappingURL=';

  var result = ts.transpileModule(load.source, {
    fileName: load.name.slice(0, load.name.indexOf('!')),
    compilerOptions: {
      module: ts.ModuleKind.ES2015,
      sourceMap: useSourceMap
    }
  });

  load.source = result.outputText;

  if (useSourceMap) {
    // remove default source map
    load.source = load.source.slice(0, load.source.indexOf(sourceMapDelimiter));
    // add inline sourcemap
    load.source += sourceMapDelimiter + formatSourceMap(JSON.parse(result.sourceMapText), load.source);
  }
};

// convert source map from V3 format to base64
// source map formatting taken from
// https://github.com/ilyavf/steal-coffee/blob/master/main.js#L27-L38
function formatSourceMap(sourceMap, orig){
  sourceMap.sourcesContent = [orig];
  sourceMap = JSON.stringify(sourceMap);
  return 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(sourceMap)));
}


// handle TypeScript files importing other Typescript files
var _normalize = loader.normalize;
loader.normalize = function(moduleIdentifier, parentName) {
  var parentParts = parentName && parentName.split('!');
  var parentPath = parentParts && parentParts[0].slice(0, parentParts[0].lastIndexOf('/') + 1);
  var parentIsTypeScript = parentParts && parentParts[1] &&
    parentParts[1].indexOf('steal-typescript') === 0;
  var isRelativePath = moduleIdentifier.indexOf('./') === 0 ||
    moduleIdentifier.indexOf('../') === 0;

  return _normalize
    .apply(this, arguments)
    .then(function(moduleName) {

      // relative imports from typescript files are normalized incorrectly by steal
      return parentIsTypeScript && isRelativePath ?
        moduleName.split('#')[0] + '#' + parentPath + moduleName.split('#')[1] :
        moduleName
    });
};

// Try to fetch files as `.ts` before `.js`
var _fetch = loader.fetch;
loader.fetch = function(load) {
  var l = this;
  var args = arguments;

  var dotJsIndex = load.address.indexOf('.js');
  var isJavaScriptFile = dotJsIndex === load.address.length - 3;
  var address = isJavaScriptFile ? load.address.slice(0, dotJsIndex) + '.ts' : load.address;

  var tsLoad = assign({}, load, {
    address: address
  });

  return _fetch
    .apply(this, [ tsLoad ])
    .catch(function(err) {
      return _fetch.apply(l, args);
    });
};
