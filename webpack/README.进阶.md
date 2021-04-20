### 怎么写 loader

例如:fly-loader.js

```
var parse = require('../loader/parse')
const loaderUtils = require('loader-utils');
module.exports = function (content) {
    //获取传入参数
    const options = loaderUtils.getOptions(this);
    var html = parse(content)
    /* 返回必须是string 或者 buffer
     * parse 返回结构 {
     *       template:'',
     *       script:'',
     *       stype:'',
     *      }
     */
    return html
}

用法
rules:[
{
test:'/.fly$/',
use:{
loader:'fly-loader'
option:{
}
]
```

### 怎么写 plugin

```
// 一个 JavaScript 命名函数。
function MyExampleWebpackPlugin() {

};
// 在插件函数的 prototype 上定义一个 `apply` 方法。
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    // 在生成文件中，创建一个头部字符串：
    var filelist = 'In this build:\n\n';
    // 遍历所有编译过的资源文件，
    // 对于每个文件名称，都添加一行内容。
    for (var filename in compilation.assets) {
      filelist += ('- '+ filename +'\n');
    }
    // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
    compilation.assets['filelist.md'] = {
      source: function() {
        return filelist;
      },
      size: function() {
        return filelist.length;
      }
    };
    callback();
};
用法
plugin :[new MyExampleWebpackPlugin()]
```

### node Api

- webpack-dev-serve

```
var compiler = webpack(cfg);
const server = new WebpackDevServer(compiler, {
  logLevel: "silent",
  publicPath: "",
  clientLogLevel: "silent",
  hot: true,
  hotOnly: true,
  proxy:webpackConfig.devServer.proxy,
  overlay: {
    warnings: true,
    errors: true
  }
});
compiler.hooks.done.tap("webpack dev server", (stats) => {
  if (stats.hasErrors()) {
    return;
  }
  const url = `http://${defaults.host}:${defaults.port}`;
  const netUrl = `http://${getIp()}:${defaults.port}`;
  console.log(`  App running at:`);
  console.log(`  - Local:  ${chalk.cyan(url)}`);
  console.log(`  - Network:  ${chalk.cyan(netUrl)}`);
});
server.listen(defaults.port);
```

- build

```
const compiler = webpack(webpackConfig);
console.log(chalk.green("  - 开始打包项目..."));
compiler.run((err, stats) => {
  if (err) {
    console.log(err);
  }
});
```
