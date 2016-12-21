var ts = require('typescript');

exports.translate = function(load) {
  const result = ts.transpileModule(load.source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS
    }
  });

  load.source = result.outputText;
};
