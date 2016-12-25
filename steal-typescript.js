var ts = require('typescript');
var loader = require('@loader');
var assign = require('object-assign');

// translate hook will transpile TypeScript to JavaScript
// will only be called for .ts files
exports.translate = function(load) {
  const result = ts.transpileModule(load.source, {
    fileName: load.name.slice(0, load.name.indexOf('!')),
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      sourceMap: true
    }
  });

  var sourceMap = JSON.parse(result.sourceMapText);
  load.source = result.outputText + '\n//# sourceMappingURL=' + formatSourceMap(sourceMap, load.source);
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
  var parentIsTypeScript = parentParts && parentParts[1] && parentParts[1].indexOf('steal-typescript') === 0;

  return _normalize
    .apply(this, arguments)
    .then(function(moduleName) {

      // modules with !steal-typescript plugin in their moduleName seem to be normalized incorrectly
      return parentIsTypeScript ?
        moduleName.split('#')[0] + '#' + parentPath + moduleName.split('#')[1] :
        // if the parent isn't typescript, treat it normally
        moduleName
    });
};

// Try to fetch files as `.ts` before `.js`
var _fetch = loader.fetch;
loader.fetch = function(load) {
  var l = this;
  var args = arguments;

  var tsLoad = assign({}, load, {
    address: load.address.split('.')[0] + '.ts'
  });

  return _fetch
    .apply(this, [ tsLoad ])
    .catch(function(err) {
      return _fetch.apply(l, args);
    });
};
