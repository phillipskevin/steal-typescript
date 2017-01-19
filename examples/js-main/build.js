var stealTools = require('steal-tools');

stealTools.build({
  config: __dirname + '/../../package.json!npm',
  main: 'examples/js-main/index'
}, {
  dest: __dirname + '/dist'
});
