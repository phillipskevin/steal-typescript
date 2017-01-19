var loader = require('@loader');
var ts = require('typescript');
var assign = require('object-assign');

// translate hook will transpile TypeScript to JavaScript
// hook will only be called for .ts files
exports.translate = function(load) {
  var useSourceMap = loader.isPlatform('window');
  var compilerOptions = {
    module: ts.ModuleKind.AMD,
    sourceMap: useSourceMap
  };

  if (loader.isEnv('build')) {
    // compile an entire TypeScript program for production mode
    return loader.import('steal-typescript/createProgram')
    .then(function(createProgram) {
      return createProgram(load, compilerOptions);
    });
  } else {
    // transpile a single TypeScript module for development mode
    transpileModule(load, compilerOptions, useSourceMap);
  }
};

function transpileModule(load, compilerOptions, useSourceMap) {
  var sourceMapDelimiter = '//# sourceMappingURL=';

  var result = ts.transpileModule(load.source, {
    fileName: load.name.slice(0, load.name.indexOf('!')),
    compilerOptions: compilerOptions
  });

  load.source = result.outputText;

  if (useSourceMap) {
    // remove default source map
    load.source = load.source.slice(0, load.source.indexOf(sourceMapDelimiter));
    // add inline sourcemap
    load.source += sourceMapDelimiter + formatSourceMap(JSON.parse(result.sourceMapText), load.source);
  }
}

// convert source map from V3 format to base64
// source map formatting taken from
// https://github.com/ilyavf/steal-coffee/blob/master/main.js#L27-L38
function formatSourceMap(sourceMap, orig){
  sourceMap.sourcesContent = [orig];
  sourceMap = JSON.stringify(sourceMap);
  return 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(sourceMap)));
}

var addTypeScriptExtension = function(loader) {
  // relative imports from typescript files are normalized incorrectly
  // so normalize as if the parent is a `.js` file and then correct
  var _normalize = loader.normalize;
  loader.normalize = function(moduleIdentifier, parentName) {
    var parentParts = parentName && parentName.split('!');
    var parentPlugin = parentParts && parentParts[1] || '';
    var isRelativePath = moduleIdentifier.startsWith('./') || moduleIdentifier.startsWith('../');
    var parentNameAsJs = parentParts && parentParts[0].slice(0, -3) + '.js';

    if (parentPlugin.includes('steal-typescript') && isRelativePath) {
      // normalize as if the parent is a `.js` file,
      // then change the extension and add plugin
      return _normalize.apply(loader, [moduleIdentifier, parentNameAsJs])
        .then(function(moduleName) {
          return moduleName + '.ts!' + parentPlugin;
        });
    } else {
      return _normalize.apply(loader, arguments);
    }
  };

  // Try to fetch files as `.ts` before `.js`
  var _fetch = loader.fetch;
  loader.fetch = function(load) {
    var args = arguments;

    // if we are loading a .js file, try loading a .ts file first
    var address = load.address.endsWith('.js') ? load.address.slice(0, -3) + '.ts' : load.address;

    var tsLoad = assign({}, load, {
      address: address
    });

    return _fetch
      .call(loader, tsLoad)
      .catch(function() {
        return _fetch.apply(loader, args);
      });
  };
};

if (typeof System !== 'undefined') {
  addTypeScriptExtension(System);
}
