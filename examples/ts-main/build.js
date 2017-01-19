var stealTools = require('steal-tools');

stealTools.build({
  config: __dirname + '/../../package.json!npm',
  main: 'examples/ts-main/src/index.ts!steal-typescript'
}, {
  dest: __dirname + '/dist'
});
