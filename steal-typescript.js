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

// relative imports from typescript files are normalized incorrectly
// so normalize as if the parent is a `.js` file and then correct
var _normalize = loader.normalize;
loader.normalize = function(moduleIdentifier, parentName) {
  var parentParts = parentName && parentName.split('!');
  var parentPlugin = parentParts && parentParts[1] || '';
  var isRelativePath = moduleIdentifier.indexOf('./') === 0 ||
    moduleIdentifier.indexOf('../') === 0;

  return _normalize
    .call(loader, moduleIdentifier, parentName)
    .then(function(moduleName) {
      if (parentPlugin.includes('steal-typescript') && isRelativePath) {
        // normalize as if the parent is a `.js` file,
        // then change the extension and add plugin
        var parentNameAsJs = parentParts[0].slice(0, -3) + '.js';

        return _normalize.call(loader, moduleIdentifier, parentNameAsJs)
          .then(function(moduleName) {
            return moduleName + '.ts!' + parentPlugin;
          });
      }

      return moduleName;
    });
};

// Try to fetch files as `.ts` before `.js`
var _fetch = loader.fetch;
loader.fetch = function(load) {
  var args = arguments;

  var dotJsIndex = load.address.indexOf('.js');
  // make sure file is .js and not .json
  var isJavaScriptFile = dotJsIndex === load.address.length - 3;
  // if we are loading a .js file, try loading a .ts file first
  var address = isJavaScriptFile ? load.address.slice(0, dotJsIndex) + '.ts' : load.address;

  var tsLoad = assign({}, load, {
    address: address
  });

  return _fetch
    .call(loader, tsLoad)
    .catch(function() {
      return _fetch.apply(loader, args);
    });
};
