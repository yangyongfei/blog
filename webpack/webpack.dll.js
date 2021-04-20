let path = require('path');
let webpack = require('webpack');
module.exports = {
  mode: 'development',
  entry: {
    react: ['vue', 'vuex'] // 只要是第三方的都可以
  },
  output: {
    library: '[name]_dll', // var xxx = 结果 拿到 module.exports 的返回值,原来在闭包中拿不到
    filename: "\_dll_[name].js", // 输出的文件的名字随便起即可
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]\_dll', // name 是 dll 暴露的对象名，要跟 output.library 保持一致；
      path: path.resolve(__dirname, 'dist', 'manifest.json') // manifest.json 列出了打包模块中所有的东西
    })
  ]
};