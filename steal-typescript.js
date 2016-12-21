var ts = require('typescript');

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
