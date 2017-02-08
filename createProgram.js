var loader = require('@loader');
var nodeRequire = require('@node-require');
var ts = nodeRequire('typescript');
var path = nodeRequire('path');
var utils = require('./utils');

module.exports = function createProgram(load, compilerOptions) {
  var sourceText = '';
  var dissected = utils.dissectModuleName(load.name);
  var file = dissected.file;
  var rootDir = dissected.path;
  var project = dissected.project;

  // create TypeScript CompilerHost which will handle file system access
  var host = ts.createCompilerHost(compilerOptions);

  // modify to create virtual modules for any dependencies of the root module
  // and set the sourceText to the root module's transpiled source.
  // this will prevent `.js` files from being created for everything except
  // for the root module.
  host.writeFile = function writeFile(fileName, data) {
    var moduleSource = utils.correctRelativeImports(data, rootDir, 'ts');
    var address = fileName.startsWith('/') ? 'file:' + fileName :
      path.join(loader.baseURL, fileName);
    var virtualModuleName = '';

    // if this is not the root module, define a virtual module so it can be loaded
    // without creating the intermediate .js file
    if ((fileName.slice(0, -3) + '.ts') !== file) {
      virtualModuleName = (project ? project + '/' : '' ) +
        address.slice(loader.baseURL.length, -3) + '.js';

      if (!loader.has(virtualModuleName)) {
        loader.define(virtualModuleName, moduleSource, {
          address: address
        });
      }
    } else {
      // since this is the root module, set the sourceText so it can be returned to the 
      // translate function
      sourceText = moduleSource;
    }
  };

  // create and emit the typescript program, which will cause the writeFile calls to be made
  // by the typescript compiler
  var program = ts.createProgram([ file ], compilerOptions, host);
  var emitResult = program.emit();

  // get and display diagnostics
  var diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  diagnostics.forEach(function(diagnostic) {
    var line = diagnostic.file && diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line;
    var messageText = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    var message = (diagnostic.file ? diagnostic.file.fileName : '') +
                  (line ? ':' + (line + 1) + ' ' : ' ') + messageText;
    console.warn(message); // eslint-disable-line
  });

  return sourceText;
};
