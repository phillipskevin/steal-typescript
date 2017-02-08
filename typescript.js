var loader = require('@loader');
var ts = require('typescript');
var utils = require('./utils');
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
    return Promise.all([
      loader.import('steal-typescript/createProgram'),
      loader.import(loader.baseURL + 'tsconfig.json')
        .catch(function() { return {}; })
    ]).then(function(modules) {
      var createProgram = modules[0];
      var tsconfig = modules[1];
      var buildOptions = assign({}, tsconfig.compilerOptions, compilerOptions);
      return createProgram(load, buildOptions);
    });
  } else {
    // transpile a single TypeScript module for development mode
    load.source = transpileModule(load, compilerOptions, useSourceMap);
    load.source = utils.correctRelativeImports(load.source,
        utils.dissectModuleName(load.name).path, 'ts');
  }
};

function transpileModule(load, compilerOptions, useSourceMap) {
  var source = '';
  var sourceMapDelimiter = '//# sourceMappingURL=';

  var result = ts.transpileModule(load.source, {
    fileName: load.name.slice(0, load.name.indexOf('!')),
    compilerOptions: compilerOptions
  });

  source = result.outputText;

  if (useSourceMap) {
    // remove default source map
    source = source.slice(0, source.indexOf(sourceMapDelimiter));
    // add inline sourcemap
    source += sourceMapDelimiter + formatSourceMap(JSON.parse(result.sourceMapText), source);
  }

  return source;
}

// convert source map from V3 format to base64
// source map formatting taken from
// https://github.com/ilyavf/steal-coffee/blob/master/main.js#L27-L38
function formatSourceMap(sourceMap, orig){
  sourceMap.sourcesContent = [orig];
  sourceMap = JSON.stringify(sourceMap);
  return 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(sourceMap)));
}
