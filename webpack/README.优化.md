## webpack 中的优化

### webpack 自带优化

- tree-shaking **import 语法**在**生产**环境下，没用到的代码会自动删除掉

#### exclude && include 减少查找范围

```

{
test:/\.js$/,
exclude:/node_modules/, // 二选一即可
include:path.resolve(\_\_dirname,"src")
use:{
loader:'babel-loader',
options:{
"presets":["@babel/preset-env",],
"plugins":["@babel/plugin-syntax-dynamic-import"]
}


```

#### webpack.IgnorePlugin(内置)

```

let webpack = require('webpack');
plugins:[
方法一
new webpack.IgnorePlugin(/\.\/locale/,/moment/), // 如果发现 moment 中引入了 local 就忽略掉(会把虽有的都忽略，所以 js 需要手动加载一下对应的语言包)
方法二
new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
]

- index.js

import moment from 'moment';

import 'moment/locale/zh-cn'; // 会把虽所有的都忽略，所以 js 需要手动加载一下对应的语言包

moment.locale('zh-cn');

let r = moment(Date.now()-60*1000*60\*2).fromNow();

console.log(r);

```

#### happyPack (多线程打包)

> 大点的项目才能体现出效果，小项目时间会延长，因为开线程也需要时间

- yarn add happypack -D

[webpack 优化之 HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)

```

let HappyPack = require('happypack');

module.exports = {
module :{
rules:[
{
test:/\.css$/,
use:'HappyPack/loader?id=css'

                },
                {
                    test:/\.js$/,
                    use:'HappyPack/loader?id=js'

                }
            ]
        },
        plugins:[
            new HappyPack({
                id:'css',
                use:['style-loader','css-loader']
            }),
            new HappyPack({
                id:'js',
                use:[{   //  必须是数组
                    loader:'babel-loader',
                    options:{
                        "presets":["@babel/preset-env"],
                        "plugins":["@babel/plugin-proposal-class-properties"]
                    }
                }]
            }),
            new webpack.IgnorePlugin(/\.\/locale/,/moment/), // 如果发现moment 中引入了local 就忽略掉(会把虽有的都忽略，所以js需要手动加载一下对应的语言包)
        ]

}

```

#### DllPlugin

[DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。](https://webpack.docschina.org/plugins/dll-plugin/)

```

- webpack.dll.js

let path = require('path');
let webpack = require('webpack');
module.exports = {
mode:'development',
entry:{
react:['react','react-dom'] // 只要是第三方的都可以
},
output: {
library:'[name]_dll', // var xxx = 结果 拿到 module.exports 的返回值,原来在闭包中拿不到
filename: "\_dll_[name].js", // 输出的文件的名字随便起即可
path: path.resolve(**dirname,'dist')
},
plugins: [
new webpack.DllPlugin({
name:'[name]\_dll', // name 是 dll 暴露的对象名，要跟 output.library 保持一致；
path: path.resolve(**dirname,'dist','manifest.json') // manifest.json 列出了打包模块中所有的东西
})
]
};

npx webpack --config webpack.dll.js --> 生成 react_dll 动态链接库 ， 以及 manifest.json

```

```

- webpack.config.js

plugins:[
new webpack.DllReferencePlugin({ // dll 引用插件
manifest: path.resolve(__dirname,'dist','manifest.json') // 内部引用了 vue,vuex 会先在 manifest.json 中寻找，找不到才会打包，找到的话通过此文件找全局下的 react_dll 这个变量，通过 manifest.json 中的 id 拿到对应的值
})
]

```

### 打包分析

npm install --save-dev webpack-bundle-analyzer

- webpack.config.js
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  plugins : [new BundleAnalyzerPlugin()]

尽可能的减小插件的体积 一般影响首页加载速速  （loadash echarts ui 组件库等 ） 按需引入

1）.确保代码是es6格式,即 export，import

2）.package.json中，设置sideEffects

3）.确保tree-shaking的函数没有副作用

4）.babelrc中设置presets [[“env”, { “modules”: false }]] 禁止转换模块，交由webpack进行模块化处理


重写组件icon  引入  删除用不到icon

```
alias: {
  // "@ant-design/icons/lib/dist$": path.resolve("./src/tmpicons.js")
}
```
