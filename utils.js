// make relative imports from TypeScript files not relative
// `./b` -> `<rootDir>/b.ts`
function correctRelativeImports(source, rootDir, extension) {
  extension = extension ? ('.' + extension) : '';
  var startString = 'define([';
  var endString = ']';

  var importsStart = source.indexOf(startString) + startString.length - 1;
  var importsEnd = source.indexOf(endString, importsStart) + 1;

  var imports = JSON.parse(source.slice(importsStart, importsEnd));

  imports = imports.map(function(imp) {
    return imp.startsWith('./') || imp.startsWith('../') ?
      normalize(rootDir ? rootDir + '/' + imp : imp) + extension :
      imp;
  });

  return source.slice(0, importsStart) + JSON.stringify(imports) + source.slice(importsEnd);
}

// handle any `./`s or `../`s in path
function normalize(path) {
  return path
    // foo/./bar -> foo/bar
    .replace(/\/\.\//g, '/')
    // ./foo/bar -> foo/bar
    .replace(/^\.\//, '')
    // foo/bar/../baz -> foo/baz
    .replace(/\/\w*\/\.\.\//g, '/');
}

// takes a moduleName like
// examples/ts-main/src/index.ts!steal-typescript@0.4.0#typescript
//
// return a path like
// examples/ts-main/src
function dissectModuleName(moduleName) {
  var moduleParts = moduleName.split('!');
  var nameWithoutPlugin = moduleParts[0];
  var plugin = moduleParts[1];
  var parts = nameWithoutPlugin.split('#');
  var project, file;

  if (parts.length > 1) {
    project = parts[0].split('@')[0];
    file = parts.length ? parts[1] : '';
  } else {
    project = '';
    file = parts[0].split('@')[0];
  }

  var lastSlashIndex = file && file.lastIndexOf('/');
  var rootDir = lastSlashIndex > 0 ?
    ((project ? project + '/' : '') + file.slice(0, lastSlashIndex)) :
    project;

  return {
    project: project,
    path: rootDir,
    file: file,
    plugin: plugin
  };
}

// takes a fileName like
// /home/kevin/dev/steal-typescript/examples/ts-main/src/exclaim.js
// and a rootDir like
// examples/ts-main/src
//
// returns a module name like
// examples/ts-main/src/exclaim
function moduleName(fileName, rootDir) {
  var index = fileName.indexOf(rootDir);
  return removeExtension(fileName.slice(index));
}

function removeExtension(file) {
  return file.replace(/\.\w*$/, '');
}

module.exports = {
  correctRelativeImports: correctRelativeImports,
  normalize: normalize,
  dissectModuleName: dissectModuleName,
  moduleName: moduleName,
  removeExtension: removeExtension
};
