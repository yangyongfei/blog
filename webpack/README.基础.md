## 什么是 webpack

![webpack原理图][image id]

- webpack 可以看做是模块打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript 等），并将其打包为合适的格式以供浏览器使用。
- 构建就是把源代码转换成发布到线上的可执行 JavaScrip、CSS、HTML 代码，包括如下内容。

  - 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS , .vue 转成 js 等
  - 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
  - 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
  - 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
  - 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
  - 代码校验：eslint 在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
  - 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

- 构建其实是工程化、自动化思想在前端开发中的体现，把一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。 构建给前端开发注入了更大的活力，解放了我们的生产力。

## webpack 常用配置

### 初始化

```
yarn init -y
```

### 安装 (本地安装，不要安装到全局，有可能版本有差别)

```
yarn add webpack webpack-cli -D
```

### entry

```
 entry:'./src/index.js',   // 单入口
 or
 entry:{    、、 多入口
    main:'./src/index.js'
    ...
 }

```

### output

```
output:{
        path:path.resolve(__dirname,'dist'), // 绝对路径
        filename:'bundle.[hash:8].js' // 根据摘要算法每次产生不同的hash，防止缓存，当你内容没有变化时，不会发生变化
    },
```

hash
对于浏览器来说，一方面期望每次请求页面资源时，获得的都是最新的资源；一方面期望在资源没有发生变化时，能够复用缓存对象。

这个时候，使用文件名+文件哈希值的方式，就可以实现只要通过文件名，就可以区分资源是否有更新。

而 webpack 就内置了 hash 计算方法，对生成文件的可以在输出文件中添加 hash 字段。

区分 hash，contenthash，chunkhash
webpack 内置的 hash 有三种：

hash：每次构建会生成一个 hash。和整个项目有关，只要有项目文件更改，就会改变 hash
contenthash：和单个文件的内容相关。指定文件的内容发生改变，就会改变 hash。
chunkhash：和 webpack 打包生成的 chunk 相关。每一个 entry，都会有不同的 hash。
那么我们该怎么使用这些不同的 hash 值呢？

chunkhash 用法
一般来说，针对于输出文件，我们使用 chunkhash。
因为 webpack 打包后，最终每个 entry 文件及其依赖会生成单独的一个 js 文件。
此时使用 chunkhash，能够保证整个打包内容的更新准确性。

contenthash 用法
对于 css 文件来说，一般会使用 MiniCssExtractPlugin 将其抽取为一个单独的 css 文件。
此时可以使用 contenthash 进行标记，确保 css 文件内容变化时，可以更新 hash。

hash 用法

一般来说，没有什么机会直接使用 hash。
hash 会更据每次工程的内容进行计算，很容易造成不必要的 hash 变更，不利于版本管理。

file-loader 的 hash
可能有同学会表示有以下疑问。
明明经常看到在处理一些图片，字体的 file-loader 的打包时，使用的是[name]\_[hash:8].[ext]
但是如果改了其他工程文件，比如 index.js，生成的图片 hash 并没有变化。
这里需要注意的是，file-loader 的 hash 字段，这个 loader 自己定义的占位符，和 webpack 的内置 hash 字段并不一致。
这里的 hash 是使用 md4 等 hash 算法，对文件内容进行 hash。
所以只要文件内容不变，hash 还是会保持一致。

### mode

- development 调试（不会压缩，不会调试）

```
module.exports = {
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

- production

```
module.exports = {—
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```

### loader(转化代码)

- loader 特性：简单，单一

- loader 执行顺序: 从下到上，从右到左

- loader 写法:'',[],{}

```html
module:{ rules:[ { test:/\.css$/, use:'style-loader!css-loader' }, or { test:/\.css$/, use:['style-loader','css-loader'] }, or { test:/\.css$/, enforce:'pre' , // 强制前置执行 use:{ // 这种对象的写法的好处就是可以携带参数 loader:'css-loader', options:{ } } }, { test:/\.css$/, use:'style-loader' } ] }
```

- loader 的分类

preLoader(前置) normalLoader(正常) inline(在代码中使用 loader ) postLoader(后置)

#### loader 解析 css

- yarn add css-loader style-loader -D

```
 module :{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
        ]
    },
```

#### loader 解析 less

- yarn add less less-loader -D

```
module :{
        rules:[
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
            },
        ]
    },
```

#### loader 解析 scss

- yarn add node-sass sass-loader -D

```
module :{
        rules:[
            {
                test:/\.scss$/,
                use:['style-loader','css-loader',sass-loader']
            },
        ]
    },
```

#### loader 解析 js

- yarn add babel-loader @babel/core @babel/preset-env

```
module:{
      rules :[
          {
              test:/\.js$/,
              exclude:/node_modules/, // 排除
              use:{
                  loader:'babel-loader',
                  options:{ // 这块配置可以单独放到 babel.config.js
                      "presets":["@babel/preset-env"],
                      "plugins": [
                          ["@babel/plugin-proposal-decorators", { "legacy": true }], // 转化装饰器
                          ["@babel/plugin-proposal-class-properties", { "loose": true }]  // 转化类属性

                      ]
                  }
              }
          }
      ]
    },

- babel.config.js || .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      "useBuiltIns": false,  // useBuiltIns 提供 false, entry, usage 三种方式
      {
        "targets": { // 浏览器需要兼容的版本，也可以单独放置到 .browserslistrc
          "ie": 10
        }
      }
    ]
  ]
}
```

> ps: Browserslist 的配置有几种方式，并按下面的优先级使用：

- @babel/preset-env 里的 targets
- package.json 里的 browserslist 字段
- .browserslistrc 配置文件

- yarn add @babel/plugin-proposal-decorators // 转化装饰器

- yarn add @babel/plugin-proposal-class-properties // 转化类属性

- yarn add @babel/plugin-transform-runtime // 转化 js 运行时的 api 方法并且可以优化 js 抽离公共部分(promise,yeld...)

      - yarn add @babel/runtime -S  (注意不是-D,生产依赖,不用在plugins中配置)

  > @babel/runtime, @babel/plugin-transform-runtime 把 helpers 和 polyfill 功能拆分了。默认只提供 helpers。

> Babel 转换了浏览器不支持的箭头函数和 Class，但是 Promise 并没有变化。这是因为 Babel 只转换不兼容的新语法，而对新的 API，如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise、Object.assign() 等，是不会转换的。这时候就需要 polyfill 了。

- yarn add @babel/polyfill

  import '@babel/polyfill' // 写了一整套的 api 实例身上也可以调用 eg 'aaa'.include('a)

  useBuiltIns 提供 false, entry, usage 三种方式

  - "useBuiltIns": "false" 此时不对 polyfill 做操作。如果引入 @babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill。

  - "useBuiltIns": "entry","corejs": 2, 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill。需要在入口文件手动添加 import '@babel/polyfill'，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill

  - "useBuiltIns": "usage","corejs": 2, usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加。

> ps babel-polyfill 包含所有补丁，不管浏览器是否支持，也不管你的项目是否有用到，都全量引了，所以如果你的用户全都不差流量和带宽（比如内部应用），尽可以用这种方式。



> ps [Polyfill 方案的过去、现在和未来](https://github.com/sorrycc/blog/issues/80)

> ps [Babel 7 升级实践](https://blog.hhking.cn/2019/04/02/babel-v7-update/)

 - 浏览器分级支持 

```
  <script type="module"></script>   // 加载新语法js
  <script type="nomodule"></script> // 加载兼容js 
```
   
#### loader 解析 img

- js 中的引入

```
let img = new Image();
img.src = './logo.png'; // 不能放字符串，不会被打包

import logo from './logo.png'; // 这样才会产生依赖关系，才会打包
let img = new Image();
img.src = logo;

// 会把logo进行生成一张新的图片放到dist目录下，会返回一个新的图片地址

```

- css 背景图(css-loader 会把他变成 require 的形式 eg: background:url(require('./logo.png')))

```
module:{ // 对模块来进行配置
      rules :[ // 匹配的规则
          {
              test:/\.(png|jpg|gif)$/,
              use:{
                  loader:'url-loader',
                  options:{
                      limit:200*1024,
                      name:'images/[hash:8].[name].[ext]'   //  图片放到./dist/images 常和output.publicPath配合使用确保图片地址引用正确
                      publicPath:"/url-loader-test/dist/"      //该地址不是唯一的，根据你的代码实际路由地址进行修改
                  }

       ]
}

// 两者的主要差异在于。url-loader可以设置图片大小限制，当图片超过限制时，其表现行为等同于file-loader，而当图片不超过限制时，则会将图片以base64的形式打包进css文件，以减少请求次数。
```

- <img src="" > (打包后文件夹结构可能会变化，就会找不到)

html-withimg-loader (打包后也会变成 base64)

```
module:{
    rules :[
                {
                    test:/\.html$/,
                    use:'html-withimg-loader'
                }
           ]
     }
```

### devServer ---> express

- 默认打包是在**内存中**打包的

  contentBase:'dist' （不配置也能成功是应为运行了 html-webpack-plugin）

- 默认启动的服务是在根目录下

- creatGzip
  compress:true

- 热更新
  hot:true

```

module.exports ={
   ...
   devServer:{
           hot:true  // 表示启动热更新
       },

   plugins:[
           // 使用热替换插件
           new webpack.HotModuleReplacementPlugin(),
   ...
}

```

#### proxy (依靠 http-proxy-middleware(webpack 内置))

- 后台配置跨域头

- 设置 webpack-dev-server proxy

```
devServer:{
        // mock 自己的数据
        before(app){ // 默认webpack-dev-server 启动的时候 会调用这样的before 钩子， app参数是express()执行的结果
            app.get('/api/user',(req,res)=>{
                res.json({name:'world!'})
            })
        },

        proxy:{ // 只对开发的时候有效，上线代码一般会布置到一起,就不存在跨域了
            //'/api':'http://localhost:3000',

            // 前端发 /api/user   后台实际接口 /user
            '/api':{
                  target:'http://127.0.0.1:3000',
                  changeOrigin: true, // 跨域设置
                  pathRewrite:{
                            '/api':''
                        }
                  }
             }

    },
```

- 把 webpack 在后台启动 （一般不会用）

### resolve 第三方模块的解析规则

[深入浅出 webpack 学习(5)--Resolve](https://segmentfault.com/a/1190000013176083?utm_source=tag-newest)

```
resolve: { // 第三方模块的解析规则
        modules: [path.resolve("node_modules")],
        mainFiles: ['a.js','index.js'], // 入口文件的配置
        mainFields: ['style','main'], // 入口字段的配置 webpack会按照数组里的顺序去package.json文件里面找，只会使用找到的第一个。
        extensions:['.js', '.json'], //也就是说当遇到require('./data')这样的导入语句时，webpack会先去寻找./data.js文件，如果找不到则去找./data.json文件，如果还是找不到则会报错。
        alias: {
            'bootstrap':'bootstrap/dist/css/bootstrap.css'
        }

    },
```

### plugin

#### html-webpack-plugin

[html-webpack-plugin API](https://www.npmjs.com/package/html-webpack-plugin)

> 简化 HTML 文件的创建，为您的 webpack 捆绑服务提供服务。这对于 webpack 包含文件名中包含哈希值的 bundle 来说尤其有用，它会更改每个编译。您可以让插件为您生成 HTML 文件(打包 html 并且把打包后的文件引入)

```
let HtmlWebpackPlugin = require('html-webpack-plugin');

plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html',  // 模版名称,此处html统一存放在public下
            filename: 'main.html'   // 生成html的名称，默认为index.html
            chunks:[chunk]  // 配合多入口进行使用时new 多个插件并分别配置代码块
            minify: {
                        removeAttributeQuotes: true,
                        collapseWhitespace: true,
                    }
        })

    ]
```

#### DefinePlugin

DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。

[DefinePlugin 用法](https://www.webpackjs.com/plugins/define-plugin/)

```
plugins:[
        new webpack.DefinePlugin({
            // 定义的变量 需要json.stringify 包裹
            DEV:JSON.stringify('production'),   // or '"development"'
            EXPRESSION:'1+1',
            FLAG:'true'
        })
    ]
```

#### NameModulesPlugin

当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。

#### mini-css-extract-plugin （抽离 css 样式 变成 link href 的形式）

- yarn add mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D

[mini-css-extract-plugin API](https://www.npmjs.com/package/mini-css-extract-plugin)

经过 style-loader 处理后会把样式以 style 标签的形式嵌入 html ,如果 css 样式多的时候不适用，这个模块**内置 style-loader**。

> ps:用这个 plugin 当环境变为生产环境需要手动压缩

```
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    // 生产环境需要手动压缩
    mode:'production',
    // 手动压缩配置
    optimization:{  //这里可以放一下优化配置,只有模式是**生产环境才会调用**, 用了这个后会自己的配置覆盖掉原来的配置，导致只有css进行了压缩,js没有压缩，所以需要手动调用
        minimizer:[ // 压缩配置
            new uglifyJSPlugin({
                cache:true,
                parallel:true, // 并行打包
                sourceMap:true // 调试使用的
            })
            new OptimizeCss()
        ]

    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:'css-loader'
            }，
            {
                test:/\.css$/,
                use:MiniCssExtractPlugin.loader,
                enforce:'post'   // 强制最后执行
            }
        ]
    },
    plugin:[
        new MiniCssExtractPlugin({
            filename:'[name].css',
            chunkFilename:"[id].css"
        })
    ]

}

```

#### optimize-css-assets-webpack-plugin (生产环境压缩 css)

- yarn add optimize-css-assets-webpack-plugin -D

> 用法在上面

#### uglifyjs-webpack-plugin (压缩 js)

- yarn add UglifyJSPlugin -D

当调用 optimization 后，会覆盖掉原来的配置，导致只有 css 进行了压缩,js 没有压缩，所以需要手动调用

> 用法在上面

#### postcss-loader autoprefixer (css3 加前缀,在 css-loader 之前使用)

[postcss-loader API](https://www.npmjs.com/package/postcss-loader)

```
webpack.config.js

module.exports = {

    module:{
        rules:[
            {
                test:/\.css$/,
                use:'css-loader'
            }，
            { // 1
                test:/\.css$/,
                use:'postcss-loader',
                options: {
                        ident: 'postcss',
                        plugins: [
                          require('autoprefixer')({...options}),
                          ...,
                        ]
                      }
            },
            {
                test:/\.css$/,
                use:MiniCssExtractPlugin.loader,
                enforce:'post'   // 强制最后执行
            }
        ]
    },
}

// 2
postcss.config.js

module.exports = {
    pulgins:[
        require('autoprefixer')
    ]
}


```

#### ESLint

- yarn add eslint eslint-loader -D

```
module :{
        rules:[
            {
                test:/\.js$/,
                enforce: "pre", // 必须在前面执行，先校验代码
                use:'eslint-loader'
            }
        ]
    }
```

#### clean-webpack-plugin (清空目录，一般在开发环境使用，常配合出口 hash)

- yarn add clean-webpack-plugin@4 -D webpack 只能用上一个版本的

```
let CleanWebpackPlugin = require('clean-webpack-plugin');

plugins:[
        new CleanWebpackPlugin() // 不需要传参，默认就会去找output.path
    ]
```

#### copy-webpack-plugin (拷贝静态资源插件)

- yarn add copy-webpack-plugin -D

```
let CopyWebpackPlugin = require('copy-webpack-plugin');

plugins:[
       new CopyWebpackPlugin([{
            from:'./assets',
            to:'./'   // 默认会拷贝到dist
        }])
]
```

#### webpack.DefinePlugin ( 设置环境变量 )

```
let webpack = require('webpack');

plugins:[
    new webpack.DefinePlugin({
                // 定义的变量 需要json.stringify 包裹
                DEV:JSON.stringify('production'),   // or '"development"'
                EXPRESSION:'1+1',
                FLAG:'true'
            })
]

```

#### webpack-merge (区分环境变量，进行不同配置)

- yarn add webpack-merge -D

```
let base = require('./webpack.base'); // 导入公共配置，loader entry  output 等
let merge = require('webpack-merge'); // 区分环境变量

let prod = {
    mode:'production'
};

module.exports = merge(base,prod);
```

#### devtool:socurc-map

```

module.exports = {
      mode:'production'
      ...
      devtool:  source-map', // 会单独生成一个sourcemap文件 ，出错会标识当前报错的列和行  大而全
                // eval-source-map // 不会产生单独的文件，但是可以显示行和列
                // cheap-module-source-map // 不会产生列。但是是一个单独的映射文件
                // cheap-module-eval-source-map  // 不会产生文件，集成在打包后的文件中，不会产生列
}
```

> 带 cheap-module 没有列，带 eval 在文件中
> 如果使用 mini-css-extract-plugin 优化配置优化 js 时也需要配置那里的 sourceMap。当然默认情况就会产生 source-map

### watch ( 监听打包 )

```
module.exports = {
     mode:'production'
     ...
     watch: true,
        watchOptions: { // 监控的选项
            poll:1000, // 以秒为单位 轮询
            aggregateTimeout:2000, // 防抖 只要不停地触发事件只执行最后一次   节流 每隔多少秒触发一次
            ignored: /node_modules/
        },

}
```

## others config

### webpack 的配置文件是否只能为 webpack.config.js?

    - 你可以在scripts的命令中配置 --config 名字 来实现重命名
    - 或者在script配置后 npm run build -- --config webpack.config1.js
    - webpack-cli/bin/config-yargs.js 中 defaultDescription: "webpack.config.js or webpackfile.js",






### npx 运行机制 (可以实现零配置打包)

```
@IF EXIST "%~dp0\node.exe" ( // 如果当前bin文件夹下存在node.exe 执行
  "%~dp0\node.exe"  "%~dp0\..\webpack\bin\webpack.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\webpack\bin\webpack.js" %*  // 不存在执行 node ../webpack/bin/webpack.js
)
```

### 多入口配置

```
let HtmlWebpackPlugin = require('html-webpack-plugin');

 entry:{ // 入口文件数量
        index:'./src/index.js',
        main:'./src/main.js'
    },
 output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].[hash:8].js'  // 根据入口名定义打包后的文件名
    },
 plugins:[
         new HtmlWebpackPlugin({
             template:'public/index.html',
             filename: 'index.html',
             minify: {
                 removeAttributeQuotes: true,
                 collapseWhitespace: true,
             },
             chunks: ["index"]   // 代码块名称
         }),
         new HtmlWebpackPlugin({
             template: "public/index.html",
             filename: "main.html",
             chunks: ["main"]   // 代码块名称
         })
     ]

```



### 分包

```
optimization: {
        splitChunks: { // 分离代码块
            cacheGroups: { // 缓存组
                common:{ // common~index~login
                    name:'xxx',
                    chunks: "initial",  // 从入口处抽离
                    minSize:0 ,   // 只要共用的部分超过0个字节 我就抽离
                    minChunks: 2, // 至少两次才抽离出来
                },
                vendor:{
                    priority:1,   // 权重，先走这里，默认为0
                    test:/node_modules/,  // 标识第三方模块，node_modules下的
                    chunks: "initial",
                    minSize:0,
                    minChunks:2
                }
            }
        }
    },

```

## 配置中出现的问题

插件报错

```
原因：

一般都是插件为了适配 webpack5 做了升级，降低插件版本即可

- [图片打包到公共 img 文件夹下，页面取不到图片问题（图片查找路径被添加了 css/img/xxx）](https://segmentfault.com/q/1010000014640043)

```
loader: MiniCssExtractPlugin.loader,
options: {
  /*
  * 复写css文件中资源路径
  * webpack3.x配置在extract-text-webpack-plugin插件中
  * 因为css文件中的外链是相对与css的，
  * 我们抽离的css文件在可能会单独放在css文件夹内
  * 引用其他如img/a.png会寻址错误
  * 这种情况下所以单独需要配置../../，复写其中资源的路径
  */
  publicPath: '../../'
}
```

- 使用 html-withimg-loader 引用图片地址变为 <img src={"default":"389a66a25c539a9fd3524d58c43e2560.png"}>

```
{
    test:/\.(png|jpg|gif)$/,
    loader:'url-loader',
    options:{
        esModule:false
    }
},
```

- webpack4 使用最新 copy-webpack-plugin 打包报错 “compilation.getCache is not a function“
  yarn add copy-webpack-plugin@6 -D // 降低版本 npm

- 通过默认的 devServer 配置启动的服务，打包的动态链接库找不到，需要配置 contentBase

[image id]: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAFqAwsDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAYHBAUBAgMI/8QAXhAAAQMDAQMECA0QBwgBBAMAAQACAwQFBhEHEiETMUFRCBQXIjdhcbMWMlJWdHWBkZKUstHSFRgzNTY4QlNXcnOTlaGx0yNUVWKC4eIkJTRDdqS0wiZjosHxRGSE/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAEEAgMFBv/EACgRAQACAgICAQIGAwAAAAAAAAABAgMRBCESMTIFgSIzQVFhoRMjkf/aAAwDAQACEQMRAD8A+qUREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAWBkF2p7DYrhdq7f7VooH1Eu4NXbrQSdB18FnqI7X/BXl3tXU+bcgh0G3ShqII5oMOzCSKRoex7aBpDmkagg7/Mu/dupfWXmX7Pb9NavDvuQsfsGDzbVt9UHTu3UvrLzL9nt+mndupfWXmX7Pb9Nd9U1QSDZ/tJt+aXS4W2ntl2ttbRRMmkiuEAjJY8kAjQnqU5VK7LvDZlntVR/KcrqQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFEdr/AIK8u9q6nzblLlEdr/gry72rqfNuQV5h33IWP2DB5tq27jo0nqGq1GHfchY/YMHm2rPuLZ3UrjSuPKt77cGn9JoPSanm16+hBrbTktvuMlNDHLrUzRteRGx7mNLmb4bv7oGu7x0Oh0W7UOsOHGjls9XU1RbVUcEbHsiY0alse6W740LmdO6dePUpig12y7w2ZZ7VUfynK6lSuy7w2ZZ7VUfynK6kBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBRHa/4K8u9q6nzblLlhXu2Ut6s9ba7gwvpKyF8EzWu0JY4EHQ9HAoKcw1p9CFj4H/gYPNtW40PUVxHsGxaKNscdxyRjGANa1t0kAAHMAEl2D4y+N7Pqpkw3gR9tZDz+JB4UVZS17HvoamGpYxxY50MgeGu6jp0rI3T1FQfZNsHsZtd1krrveXvZcailb2rUmmG7DI5gJDecnTXxKc9wrGf7Tyb9qyIKxwDFsji295JX2W9QdsQUzankqxrzHPHKSGxO3TqA3TgeOmg4K8BnEtpO5mdmq7MBwNbH/tNGfHyrBqwfntau2CbN7HhNfXVtpfcJqusjZFLLWVTpnbrSSACfKpmQCNDxCDHt9dSXKkjqrfVQVVNINWSwyB7XeQjgshRK4YDaJat9baDU2K5POrqm1ycjvn++zQsf/iaVj9tZnYP+NpKbJqJv/OotKarA6zE47jz+a5vkQTVF8/7ZtsFmqcSyPH7dV3C15A2likjbNG+ml1Mrd+Ma6EPDePUQeBKwYsAo3RMcb7lGpaCf97y9SD6ORfOnc+o/wC3co/a8qdz6j/t3KP2vKg+i0Xzp3PqP+3co/a8qk3Y+CekvOdWt9fX1lLQ1sDYO3Kh0zmB0Wp4u8aC5UREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBEWovmQ2+zMPbMu9NpwhZxcfm91ZVrNp1WETMRG5bdFVdZntzkrmy0zIoqdp+wkb28PGfmUtx/MaC6bsU57Uqjw3HnvXHxOW+/Ey0jymGuualp1CToiKs2iIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIuHODWlziA0DUk8wCjFTtCw2mmdFUZTZI5WnRzTWx6g++glCKJd0rCfXZY/jsfzp3SsJ9dlj+Ox/OglqKJd0rCfXZY/jsfzp3SsJ9dlj+Ox/OglqKJd0rCfXZY/jsfzp3SsJ9dlj+Ox/OglqKL0u0HDqqdsNPlNkklcdGtbWx6k++pQ0hwBaQQeII6UBERARYF4vVrslOJ7xcaOghPAPqZmxg+QkhaHulYT67LH8dj+dBLUUS7pWE+uyx/HY/nTulYT67LH8dj+dBLUUS7pWE+uyx/HY/nTulYT67LH8dj+dBLUUS7pWE+uyx/HY/nTulYT67LH8dj+dBLUWqsmR2S/Bxsl3oLhucXCmqGSFvlAPBbVAREQEREBERAREQEREEO2Xfae7+3Vw/8h6mKh2y77T3f26uH/kPUxQEREBERBS/ZHYhjrNmuSXxtloBeNIn9uiEctvGVgJ3ufm4LLp+FPF+YP4LZdkj4Fsk/Mh88xa6D7BF+YP4IOxIAJJAA5yVzzrUZZVClx+48/KOpZ9z+j3m6iNx77hoBw6eB5lH8br7o/KDT1L6qajfG4gcluRxANbu6gs048dHNcddeIGnAJusbYV92e0n2fTeZWSsbYV92e0n2fTeZQXEiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIvGrqoKOB01VKyKMc7nHRTEb6geyw7pdKO1w8rWztjHQOdzvIOlQ2+Zw529FaI9BzctIOPuD51C6maarmdNUyvlldzuedSr2Hg2t3fqFa/IiOq9pNfs2q6veitrTSwnhvn07vmUOeHPeXvcXOPElx1JXtupuLp48VccarCpa83ncsfcXO4vbdXO4tjFurDlNwtO7G5/bNMP+XIeIHiPQrFsmRUF3aBBJuT9MMnB3udfuKoN1GgtcHNJDhxBHAhVM3Epl79S3UzWp17he6KsrJmdZRbsVeDVQDhvE6PHu9PuqfWq7UV1i36OZryOdh4Ob5QuXl498XuOlymWt/TPREWhsEREBERAREQEREBERAREQEREBERAREQfNPZJ3+85Hntk2Z2CqdSRVrWyVkjSRv7xOgdpzta1pcR06jqXvRdjnhUNNGypkulTMB30vbAZvHr0DeC1Wbffj2b2MzzMivtBUH1vGC/i7p8b/wBKfW8YL+Lunxv/AEq30QVB9bxgv4u6fG/9KfW8YL+Lunxv/SrfRBUH1vGC/i7p8b/0p9bxgv4u6fG/9Kt9EFMV3Y54XNSyR0kt0ppyO8l5cP3T42lvFdOxmyK82TM79s1yGqdVi3NdJRyOJO4GuALQTx3SHNcB0cVdSoXZ39+DkvsaT5ESD6jWFe7hFaLNX3GoBMNHBJUPA6Qxpcf4LNUZ2n+DfKfaup805B8uYBh9Xtvutzy/OLjVdpCcwU9NA/TTgDutJ13WNBA4DUlWD9bxgv4u6fG/9K8exR8Fj/bCb5LFcqCoPreMF/F3T43/AKU+t4wX8XdPjf8ApVvogqD63jBfxd0+N/6U+t4wX8XdPjf+lW+iCoPreMF/F3T43/pT63jBfxd0+N/6Vb6IPmjadsnbs5tjMxwG519JUW17XSxySBxDSQN5rgBw1I1adQQV9MbMMmOY4DZb89jY5ayAOla3mEgJa/TxbwKgO3jwQ5N7Hb5xi2nYxeBHHPJN556C0kREBERAREQERazKLxFj2N3S8VEb5YqCmkqXxs03nBjSdBr5EGzQkNBJIAHOSqXpNs19q6WGpptnN1kgmY2SN4roe+aRqD7y5qtq19q6WanqNmd1fDMwxvaa6Hi0jQj3kE12XEfUm7jUa/Vq4HT/AP0vUyXyvsYul/2c2+6wvwW8XCoraoyCZ1bEC2IekZxJ48XEnpJVjd13IvybXX4/CguJFX2znaPJl19ulnrsfq7LXUMMdQ5k8zJN5jyQOLebmVgoCIiCtOyR8C2SfmQ+eYtdB9gi/MH8FItuFkuGRbLb7a7NTmpr52R8lCHBpeWyNcQCdBzAqiM7zjNsbba6duFT0VRUuIa2okbUOlDd0ENbGdRzjiesILSrKWCtppKeriZNBINHxvGrXDxhew4AAcAOYKGXG953TWmoqW7N7m18cJkBdVRPAIGvFrTvHyDitPgGXZzkWPsr/QJV17XSOa2oppmQMeB1NkOvDm1HBBZar3YFtItQ2i5rSXQC2NuNQyWGaqkDGh0Y5Pk3E6AOPOPIQt39Us4/JvdPj0HzqQbFsaujarNK3LMeFvhvFVC+OkqjHNvNbHunXTUEa9aC32uD2hzSHNI1BB1BC5ULdgbLa4y4ddaywP117WZ/T0bj44H8G/4C1dfRHkdj73J7A6rpm89wsmszdOt0B/pG/wCHfQTZFqsfyOz5DA6Wy3Gnqwzg9sbu/jPU5p75p8RAWo2mZlHg2OMuj6Ca4PkqYqSKnieGFz3nQcTwCCWIqd7ruRfk2uvx+FO67kX5Nrr8fhQXEip3uu5F+Ta6/H4U7ruRfk2uvx+FBcSKIbMc1bnNjq68W2e2zUtZJRTU8z2vLXs014jgedS9AREQEREBERAREQEREBdZHsiY58jmsY0alzjoAo5fcwobdvRU57aqRw3WHvWnxn5lX94vddd361cx5PXhEzg0e50+6reHh3ydz1DTfPWvUdyml8zanp96K1tFRLzco70g8nWoLcK6ruU/K1szpXdAPMPIOhYzWr0AXUxYKYvjHanfLa/t1DfEuwavQNXYNW5reW4uN1ZG6uCEGPu8Vzur10XICDy3FwWLI3VwWoMYtXML5KeVstPI+ORvM5p0IXsWrzLeKexL7JnEkW7Dd2co3m5Zg4jyjp9xTmirKeugE1JMyWM9LT/HqVJuavShraq3TiajmfE8c+6eB8o6VSzcKt+6dSsY+RMdW7XeihVjzmGbdiuzBDJzcs0d4fKOhTKGWOaNskL2vjcNQ5p1BXLyYr4p1aFut639O6Ii1sxERARFrr7cjbKMTCPlCXhoBOiDYosS13CG40wmgPic087T1FZaAiIgIiICIiAiIg+W82+/Hs3sZnmZFfaoTNvvx7N7GZ5mRX2gIiICKOZBUXGLJsdio7rbqSjlklFVS1BHLVQDRoIuHODxOiybzleP2SqZTXi926hqXjVsVRUNY4jr0JQbpF0gljnhZNBIyWJ4DmPY4Oa4HpBHOu6AqF2d/fg5L7Gk+REr6VC7O/vwcl9jSfIiQfUajO0/wb5T7V1PmnKTKM7T/BvlPtXU+acgpfsUfBY/2wm+SxXKqa7FHwWP9sJvksVyoCIuRzhBwijOHVta63XSe93i114hrZgyakc0MgiGmjHngA5vHXVZlnyzHr1VvpbRe7bW1LddYoKhr3cPECg3SIiCBbePBDk3sdvnGLadjF4Ecc8k3nnrV7ePBDk3sdvnGLadjF4Ecc8k3nnoLSREQEREBERAUR2v+CvLvaup825S5RHa/wCCvLvaup825BXmHfchY/YMHm2rcLT4d9yFj9gwebasevyemt8te2pjlkbTSiM8jGSWjk2vJcSQOY9fHmGpQSBFFqrM6Js9GKRkstLLM2OWqcwiKMGIy+m9UG6HTTp61sbBkVBfXStonSB8bWSFkjQCWO13XDQngdD4+sBB77LvDZlntVR/KcrqVK7LvDZlntVR/KcrqQEREGFe7pSWS01VyuUoipKaMySP5+A6AOknmA6SQFHcGtdXLPVZNf4jHebk0BkDuPaVMDqyAePjvPPS49QCwm//ADjK9/02M2OfvfU1ta3p8bIj7hf+Yp4gKG7HfBrY/wBE/wA45TJQ3Y74NbH+if5xyCZIiICIiCP5Bh9jvs7amtogyvZ6StpnGCoZ5JGEO9zXRfOe1LEs6sE7a+85BBcMerL3RbtNJI6SZpa8NjdruNG9ujRxHP0686+rFU/ZJ/cVZ/b2h+WUB3pj5VwtfeLvBbJIWSRVE882+WQ08e+8ho1c7TqAI98LUXDM6GmpaqWGCrl5JkvJuMRbHLLGwudGCfwgAddR0HpGiCTrkc4UEtmcyB8wvVIYHNLIo44ozvyvMQkeRvO0DQHDp15uvRbinzOzVFdTU8FQ6TlzG1sob3gdI3eY08ddSCOjhqNdEEh7HH7RZZ/1HWf+itpVL2OP2iyz/qOs/wDRW0gIiICIiAiIgIixrk4st1U5pIcInkEc4OhUxG50S199yO32ZpFRLvz6cIY+Lj5er3VXN9yuvu5MYd2tS/iozxP5x6VFI6hzzvSkuceJcTqT5VlxkEag6ruYuHTF3PcudfPa/wDEPVo4L1YF0aOC9WBWGp6NC9GhdWherQg5AXbRAuyJdCF1K7leFTURU7N6Z4aP3lNb9IdiuwWhlvZ5YcnEDEOfePE/MtrRV0FUBybtH9LHc6ztjtWNzCNxLLAXOiBdlgl5kLo4L2K6FBjuC8nhZDgvF4QeDgs20Xuus8wdRyncPponcWO9xYjgvF/jUTWLRqYTEzE7hatgzOguW7FUkUlSeG68964+J3zqUDiOC+dpZQODRr41cGzSWSXFIHSvc9wkeAXHXQA8y5fL4lcVfOq5gzTefGUpREXPWRR/NvtXF+mH8CpAo/mv2ri/TD+BQVFgeePbeZqOpe1lWyV7GE8GztDj3p8avK2XCG40wmgPic087T1FfFtzcW3arc0lrhO8gg6EHeKtjZjn0pnjpayQNrmjda5x0bUN6j/eQfQqLEtlwhuNMJoD4nNPO09RWWgIiICIiAiIg+W82+/Hs3sZnmZFfaoTNvvx7N7GZ5mRX2gIi1GWWqpvdgqbfQ3SptNRNu7tZTfZI9HAnTiOcDT3UEF2leFrZf7KqvNhRqtsV4xzKMmr34db82tN1q3TOqGPY+qgaR9iLXA8B1BbTLK6krNsOzi00VcyuuFqfUduhp3nx6Qt76TqJ01W7n2d3O33i5VmG5XU2KC5TGoqaQ0rKiPlT6Z7N70pKDM2L1dgqcIjjxZldBRU88kT6atdrLTya6ujPiGvDyqdqO4LilHh9ldQUc01TJLM+pqamc6yTyu9M86fwUiQFQuzv78HJfY0nyIlfSoXZ39+DkvsaT5ESD6jUZ2n+DfKfaup805SZRnaf4N8p9q6nzTkFL9ij4LH+2E3yWK5VTXYo+Cx/thN8liuVAXLPTt8q4UarqUWfJajKLpkUtNZo6UQvopnbtPG7eH9Lrrz9HN0oKgxywVOT7J83tVBVwUtTLkVQ5hnfuRylr2Hk3HqdpovWSut9uvOPDO8AkxiopKtjaS62ot5Aycwa9zRrunqJP8AFZ+y/GaHNtmmSUla6VtFX32pqqWphO65pDmlkjD5df3qSnZvdbpUUDMvzCrvVroZmVEdH2qyASvb6UyOHF2n70FlnnRDxKIIFt48EOTex2+cYtp2MXgRxzyTeeetXt48EOTex2+cYtp2MXgRxzyTeeegtJERAREQEREBRHa/4K8u9q6nzblLlEdr/gry72rqfNuQV3iLd7DbK0OLSaCEbw5x/RjiFqHYayuqque6VEhe+YmIxua4lnJMjJdvN03zua6gAjXgVtsOez0I2Pv2/wDAwdP/ANNq3HKM9W33wgjTMKtzBDEJqw0kZa40xkHJyOEXJbzuGupZwPHTXjzrPx+wU1jbIKaWaTfa1g5Td71rddAN0Dr5zqT0lbblGerb74Wukv8AaIrxHapLlSNuUjd5tMZBvkeRA2Wuadt2WtDhvfUqk4a8fTO+cK7F8tbP8IrH7eckr7Lfn0lbTUzayN0kAmY8zEgxvG8NWjToIPN1K8PRRfbJ3uV4/I+nHPcLNvVMWnW6LTlWe4HDxoJqofnFzq6ippsXsMzortcWF01QznoqUHR835x9Kz+8deZpWRV53YWY3UXmgrobjFHpGyGleHSSSuOjIg3nD3OIGhAXbB7FU22mqbjeXMkv9zeJ617Tq2PQd5Cw+oYOA6zqelBurNbKSzWqlt1uhENHTRiKJg6AP4npJ6SsxCQASToAunLRfjGfCCDuobsd8Gtj/RP845b3JLlPbrBcK22xRVdZTwOmjp3SbvKlo13deOhOmg8agPY43+e97MKGeqpI6KCKR8NODJvOlaHHV54DTviRp/dQWmi6ctF+MZ8ILs1zXDVrgR1goOUReFdW0tvpZKmvqYaamjGr5ZnhjWjxk8Ag91U/ZJ/cVZ/b2h+WVIznRuhMeG2ervZ5hVn/AGejHj5Z477/AANcqI2o4vndFOLnleROmsv1boxS2+OVz4957w4kF3ENZxaCeJ5+HSE9uljZX1InNbWwVDHP5OSF7QY2vaGuYNQe9O6D1g8QVguw63uD43T1hpXco5tOZQWMfIwse8EjUuIc7nJGpJ0UjdIzePft5+sLGr7hR2+jlq66qhp6aIbz5JHgNaEGmrMQt9S7f3545hLyrZG7ri08k2IjRzSNC1g5xz8VzS4hbqa5Q1cD6hhYY3Fm80h7mNDWucSN7mA1AIB04hbe23KhudFFV2+rgqaWUasljeCCskSM1Hft98IOexx+0WWf9R1n/oraVSdjidbFlenN6I6z/wBFbaAiIgIuk00UIBmkZGDzFzgF5dvUn9ag/WBBkIsft6k/rUH6wJ29Sf1qD9YEGQsa6fays/Qv+SVz29Sf1qD9YFi3OupDbasCpg15F/4Y9SVNfcIn0oJg4Be0erTq06LxZNDoP6VnwgvVs0P42P4QXqnIZsUwPB/DxrLYtWJofxsfwgvWOqjZzTR+TeCwmv7JiW1au4KwI66A8DLGD+cF7dtwAameIDr3gsNJZgKSSsiYXyODWjpJWirMgp49W0z2SO9UXd6PnWmqK81L96adrj0DeGgW6mGbe+mM203lbe+dtIP8bh/ALSyvfK8vkcXOPSV48tF+MZ8IJy0X4xnwgrNaVr6YTO3fRcjUEEHQjmIXly8ev2Rnwlzy8X4xnwgsxuaK8Sw6NqByrOv8IfOt7TVUVSzeheHdY6R7ihPLRfjGfCC5jqmxPDo5mtcOkOWm+GtvTKLTCckrq4qPUeQsGjapzD/faR+8LasrqaVgdHUROaekOCq2pNfbOJ2yCV5PXlJW07f+dGT1BwWLJWRv/wCbGB1BwURGyZessobzcSsOVznnifcXJmh/Gx/CC6Omh/Gx/CCziIhjt5uCuLZh9ycP6V/8VTrpovxsfwgrb2a1lMzFYQ6ohaeUfwLwOlUvqP5X3WOL80yRY/b1J/WoP1gTt6k/rUH6wLhugyFH81+1cX6YfwK3Hb1J/WoP1gWizCpgmtsbYpo3u5UHRrgTzFB8jXX7aVv6d/yisZri1wc0lrgdQQdCCsm6/bSt/Tv+UVioLj2Y59KZ46WskDa4Dda53BtQ3qP95X1bK+G40wmgPic087T1FfEbXFrg5pLXA6gg6EFXHsxz6V08dLVyBtcBoHO4NqG9R/vIPoRFiWyvhuNMJoD4nNPO09RWWgIiICIiD5bzb78ezexmeZkV9qhM2+/Hs3sZnmZFfaAiIgxYLdQwVs1ZBRU0dXN9knZE0SP8rgNSspEQEREBULs7+/ByX2NJ8iJX0qF2d/fg5L7Gk+REg+o1Gdp/g3yn2rqfNOUmUZ2n+DfKfaup805BS/Yo+Cx/thN8liuVU12KPgsf7YTfJYrlQF41lLT1tM+nrIIqinfwdFKwPa7yg8CvZEHnTQQ0sDIKaKOGFg0ZHG0Na0dQA4BeiIgIiIIFt48EOTex2+cYtp2MXgRxzyTeeetXt48EOTex2+cYtp2MXgRxzyTeeegtJERAREQEREBY10oKW6W2qoLhC2ejqY3QzRO5nscNCPeKyUQViNhGzoDQY8AB/wD25/prnuE7OvW//wB3P9NWaiCsu4Ts69b/AP3c/wBNQvM+x4xmmqxfrBQ1M4pN2SSymdxjqmt9O1r9d9ry3XTvtNQOgr6BRBCNmOJYbZaD6sYTQsghucTHGUSveXtGujTvk6EEnUdfPzKbkgAkkADiSVA3f/B8r3vS4zfJ++9TRVrunxMlPvP/AD165lUTZHd24fbZHsiewTXipjOhhpjzRA9D5dCPE0OPUg0FNi9s2i5LPlE9O6mt9LrBaqqkcYJ53g99Vco3QkajdZrqNN4/hBSHtTM7B/wVZTZNQt5oa3SmqwOoStG48/nNb5VMaWnhpKaKnpo2RQRMEccbBo1rQNAAOoBeiD5r237YbXcMcybDp6S4Wu8GmhLWzgA8pyrS+IlhI9LoQQSCD0LtDstxB0MZNreSWgn/AGqXq/OU57I+z2xuyTJK1tuoxWbsTuXEDeU1MzNTvaa6rpT/APDxAeoH8EEM7lmH/wBlP+NS/SXVmyrDmNDW2lwA5gKmX6SnCw6S6W+smEVJXU08pBcGRytcSAdCdAeYHggivcsw/wDsp/xqX6S8dhGXYvjN9ze10VTPLC6siNBR00ctTJKAwtfuAAk99znydCnij3Y843abdn+0Kqo6Rsc8FTFTxO1J3I3s5RzR4i7Q+4EFi9u5lfuFvoabG6J3NUXDSoqiOsQsO40/nOPkXvQ4DaW1Udbe31N/uLDvNqLo/lQw/wByPQRs/wALQfGpciAAAAAAAOAAWnyzGbRltoda8go21lC57ZOTLnN75vMQWkELcIgrLuE7OvW//wB3P9NafMNg+AHFrq6ltMtJUR0z5I5oqqUuY5rS4HRziDzdIVyrV5V9y949hzfIKCpsA2F4HJhVknrrVLWVVRSRVEs0lTI0uc9oceDXAADXQcFIO4Ts69b/AP3c/wBNTDAfuFxz2tpvNNW9QaTEcVs2IWo23HaJtHRukdM5ge52rzpqSXEnoHvLdoiAiIghG0yZ0FKyZmm/HDI9uvNqBqvn8bRL1p6Wj/VH51fm1T7Wu9jTfJXykOYIJj3RL16mj/VH507ol69TR/qj86hyIJj3RL16mj/VH510m2g3l8MjC2k0c0g/0R6vKoiuH+kd5FNfcIn09RkVaOiH4P8AmuwyOu6ofgf5rSgLsF6TcuZqG7GSV3qYfgf5rn0S13qYfgf5rSBcqNyabn0SV3qYfgf5rDqsjr3yaOMe6Pwd3gsJYs32QrZin8SJhs236r6ovgruL7V9UXwVpdFyCrG5Y6bn6vVfVF8FPq7V9UXwVqAdU1UeUmm2+r1X1RfBXP1eq+qL4K06aqPKTTcfV6r6ovgp9Xavqi+D/mtRquC7qUxMmobY36r6ovgriPIa6N4MZjb5G861C5HOFIk3okruqH4H+a59Eld6mD4H+a0qKnuWem5OSV3qYfgf5rqcjruqH4P+a1BXUpuTUNscireqH4P+a39mzm7UdC2GFtLuBxPfRknj7qhBWdR/YB5SqfPn/V92/jx+NN+6JevU0f6o/OndEvXqaP8AVH51DkXHXUx7ol69TR/qj86HaHe9Do2kB6xEfnUORB3le6WV8kh1e9xc49ZPOuiIgLlri1wc0lrgdQQdCCuEQXJsxz6V08dNVyBtcBoHOOjahvUf7yvm2V8NxphNAfE5p52nqK+I2uLHBzSWuB1BB0IKuPZjn0rp46arkDa5o0BdwbUN6j/eQfQiLEtlfDcaYTQHxOaedp6istAREQfLvZGUlfhe1zHNosFI+qtjWsgqN38Bzd5paT0bzHcCekFTSi21YBVU0c31fjgLhqY5oZGvb4iN0q56+ipbjRy0lfTxVNLM3dkhmYHseOog8Cq5qNhGzeeZ0jsZga5x1IjnlY33AH6BBpe7FgHrmpP1cn0U7sWAeuak/VyfRW27gWzX1ts+NTfTTuBbNfW2z41N9NBqe7FgHrmpP1cn0U7sWAeuak/VyfRW27gWzX1ts+NTfTTuBbNfW2z41N9NBqe7FgHrmpP1cn0U7sWAeuak/VyfRW27gWzX1ts+NTfTTuBbNfW2z41N9NBoa7bXgNJSyTC/R1BYNRFBDI57j1DVoHvlQ/sa6G4ZdtSybaNVUr6W3zh8FMHfhucW8Aenda0AnrKtKm2E7N6eZsrMYgc5p1Aknle33QXaFWPRUlPQUkVLRQRU9NE3djiiYGtYOoAcAg9lrsjtovOPXO2OduCtpZacu6t9pbr+9bFEHx5sVzql2ZS3bC87ZLbZoKt0kc5jc5oJABB0Guh0BDhwIKtzuxYB65qT9XJ9FWDl+B4vmIjOSWWkrpIxoyV4LZGjqD2kO08WqincC2a+ttnxqb6aDU92LAPXNSfq5Pop3YsA9c1J+rk+itt3AtmvrbZ8am+mncC2a+ttnxqb6aDU92LAPXNSfq5Pop3YsA9c1J+rk+itt3AtmvrbZ8am+mncC2a+ttnxqb6aDU92LAPXNSfq5Pop3YsA9c1J+rk+itt3AtmvrbZ8am+mncC2a+ttnxqb6aCoNt21myZDi8mL4dJJdrhc3sic6GJ261u8DoNQC5xIA0AV/wCx/G58R2a2Gy1mgq6eDWcA67sjiXuHuF2nuJiWzPDsRq+2rBYaSlq9NBOd6SRvkc8kj3FMUBERAREQEREBERAREQERY1fX0luh5WvqYaaLj30rw0cGlx5/E0nyAoI9tLraSDFaiiqqNtwnuf8AsVLQ66GoleOA16APTF34IaT0LSbJIJcf+qGM3x/LZHE7tyatcSTco38BMCePe6CMj8HdHQQs7DqebI7u7MLlG9kT2GGz00g0MNMeeUjofLoD1hoaOtbHOLHU3KmprjZnMjv9seZ6J7jo2Th38Lz6h44HqOh6EEmRanFr7TZFZYLjSNfHv6slhk4PgladHxvHQ5rgQVtkFadkj4Fsk/Mh88xQzI3VUtPRRQQXA0scsbqs0urXyRFjuDCCCdHbuoGh0Uz7JHwLZJ+ZD55i10H2CL8wfwQQCOlvclUxj47y2V0sIidJPrGyl3AJGyFp0MnpuOm9qW6HgtTSY3eLZQwvoYa6ImmoYqkCR73FjRJyjWgPB4OLNQ0g6E6dKthEFYikyzl6DlJrhoI4+RcIzq08q7e5UCTT0m6O/wB7h49VYuwv7s9pOn9fpvMrJHOq22FbRWUO0DOG5DQS22hq52SPqnseWU0jO8ayRwGjd5up1Og4IPqJF40VXTV1MyooqiGop5BqyWF4e1w8RHAr2QEREBavKvuXvHsOb5BW0WnzGeGnxW7OqJY4mupZWAvcGguLDoOPSUHlgP3C457W03mmreqO7OqiGowTHzBLHKGUFOxxY4O3XCJuoOnT4lIkBERAREQQTap9rXexpvkr5SHMF9W7VPta72NN8lfKQ5ggIiIC4f6R3kXK4f6R3kU19wifTWhchcBdgvRuY5XYBdV2UJNFiTfZSstYk/2Urbh+TGzoVwQuQisMXQoHda5K6lRKXbUIXdS6IoiDbtz865AXAXYLJAuRzog5wgzgE0RFSbHUrgrsV1KIdSs2k+wDylYR5lm0f2AeUqnzvyvu38f5PZERchdEREBERAREQFnWW3Vd0uMVNQNJmJ13gdAwD8Ino0XFottTdq6Okoo9+R3Oeho6ST0BfQ2zfBYKGkb3pMXPLMRo6Z3UOpqDebPrbXQshmnqHSMZHuPkI05Z2nPopyusbGxsayNoaxo0AHMAuyAiIgIoftN2hWTZ3Yxcb5I9z5SWU9LEAZJ3DoA6AOkngPeVH/XLZHVazWzZ7UzUjuMb+UkdqPK2PRB9QIvmD647L/ycVPwpv5afXHZf+Tip+FN/LQfT6L5g+uOy/wDJxU/Cm/lp9cdl/wCTip+FN/LQfT6L5g+uOy/8nFT8Kb+Wn1x2X/k4qfhTfy0H0+i+YPrl8hpCJrrs+qYaNv2R/KyM0HldHory2a5/ZNodh+qdilfqwhk9PKAJIH6czh/AjgUEtREQEVF7R+yHteO36Wx41apsgucLjHKYn7sTHjnaCAS4jp0GnjUU+uOy/wDJxU/Cm/loPp9F8wfXHZf+Tip+FN/LT647L/ycVPwpv5aD6fRfMH1x2X/k4qfhTfy0+uOy/wDJxU/Cm/loPp9F8wfXHZf+Tip+FN/LT647L/ycVPwpv5aD6fRfPGJ9kvSTXmG3Zrj9Tj5mIa2oLi5jdeYva5oIHjGq+ho3tkY18bg5jgC1zTqCOsIOUREBERAREQFqMwvPodxW73nkeX7QpZKnkt7d39xpOmvRrotuojtf8FeXe1dT5tyCvKDaln1dQ01XT4TajDURtlYTdtCWuGo4bnUV790faH6yLT+1/wDQvDDvuQsfsGDzbVuEGu7o+0P1kWn9r/6FAdrZz/aRR2qjqseobfSUdQah7YLmHOlOmgGpb3ugLug86s9EHvsjze63m83DGb7Z2W+ptdJDK2QVpqnStdqBvOIHHhqrSVK7LvDZlntVR/KcrqQQO/g4XkjsihGliuL2xXeMc0EnBrKoDoHM1/i3XfglTwEEAggg8QQvOqp4aumlp6mNksErDHJG8atc0jQgjqIUMw2omxy7uw+5SPfExhms9TIdTNTDniJ6XxagdZaWnrQd9smO1+V7Nb1ZrO2N1fUsZyTZH7rSWyNdpr0cGlVyyg2oMY1voPtB3QB9th9FX0iCh+0tqHrPtH7WH0U7S2oes+0ftYfRV8IgoftLah6z7R+1h9FSfYvjGQWatyy4ZVRUtHNd6mKVlPDOJgGtj3TqdFaKIIhW4DaxUvrLDLVY/cHnedNbHiNjz/fiIMb/AHW6+NePb+Y2DhcrfT5HRN56m26QVIHW6B53XH814/NU1RBH7BmNjvs7qWjrRHcGenoalhgqGeWN4Dvd00Wr2rZpNhWMMuNBQxXGrkrIaJkD5uTbvyHQau0On+a39/x20ZDA2K9W6nrGt4sdIzv4z1tcO+afGCF807U9nF+xWdl6lymSstNdeqJpt0ge/d0fpES97nElrRprzkILCO0faH6yLT+1/wDQtFnGR5zl+J3Ow1+E2psFbCY98XUExu52uA3ecEA+4pc70x8q4QQzZ7fc4wnD7bYKDC7VJFSMIdK66hpkeSS5xG7zkkqRd0faH6yLT+1/9C2K5HOEEi2TZnVZtYa6suFujt1ZRV0tDLDHNyrd5mmpDtB1/uU2VS9jj9oss/6jrP8A0VtICIiCLZzaqi6QxxwxOkY5j437hGoBCqzuPQ/ibj8NvzK/EQUH3HofxNx+G35k7j0P4m4/Db8yvxEFB9x6H8Tcfht+ZeVVshhjpZn8jcO9Y53F7egeRfQKxrn9rav9C/8AgVNfcIn0+RWYawj0lT8IfMvRuFsP4FT8IfMp1EeAXuwr1HjDkeUoE3CWH/l1Pwh8y7+ghn4uq+EPmVgsK7ap4weUq89BDPUVXwh8y0twxZkNY9m5Pw05yOpW4SorfD/vOX3P4LbhrHki1pQT0NN9TN74XBxtvqZvfClwOq53etWPGGO5Q70Nt9RN74XU403pbN74UyK83KPGE7lEPQ431M3vhc+htp/Bm98KV9K7NUeMG5RMY00c7JvfC7DG2+pm98KXBdtNVPjCNyiPoab6mb3wuW40wuaN2biesKWngkZ/pGeUKfGDcsP0EM9RVfCHzLn0EM/F1Xwh8ysIOXOqpeMM/KVdOwhg/wCXVfCHzLzdhTPUVPwh8yshx4LxcU8YPKVcuwxgHpKn4Q+ZTDF9lsVxtDKh0VcSXOHevbpwPkWe88FbWzX7lYf0j/4qj9QiIxfdZ4s7uqzuPQ/ibj8NvzJ3HofxNx+G35lfiLiL6g+49D+JuPw2/MvGr2UUdLFv1Ar4mk7oc57ef3l9BKP5r9q4v0w/gUHx5VxchVTQ673JvczXr0Oi8llXX7aVv6d/yisVAWbaLbU3aujpKKPfldznoaOkk9AS0W2pu1dHSUUe/K7nPQ0dJJ6AvobZvgsFDSDvSYzxlmI0dM7qHU1A2b4LBQ0je9JjJ1lmI0dM7qHU1WnGxsbGsjaGsaNABzAJGxsbGsjaGsaNABzALsgIiICIiD5W2vU8eTdlPjlkuzeXtkEEZEDvSnvXyEEeMgA+IL6AYBGxrIwGMaNA1vAAdQCoTNvvx7N7GZ5mRX2g53neqPvpvO9UffXCIOd53qj76bzvVH31wiDned6o++m871R99cIg4kAljdHKA+Nw0c1w1BHUQqB2KQMxrsncssNqHI2yWCR3ID0rdNx7dPJvOA8RV/qhdnf34OS+xpPkRIPqNaPO62a24Tf66mcWz01BPLG4dDmxuIPvreKM7T/BvlPtXU+acgofsS7PSR4bX3sxNfcqmsfE6dw1cGNDTug+Mkk9avbed6o++qZ7FHwWP9sJvksVyoOd53qj76bzvVH31wiDned6o++m871R99cIg53neqPvpvO9UffXCIKw7I+zUV12WXWqqoWOqqAMnp5dO+Yd9oIB6iCdQpj2OtfPctjOMzVTy+VkDod4nUlrHua39wAWg28eCHJvY7fOMW07GLwI455JvPPQWkiIgIiICIiAojtf8FeXe1dT5tylyiO1/wAFeXe1dT5tyCvMO+5Cx+wYPNtXe73jtCqgpYaOoraqWN8wig3QQxmm87viBzuAA5zqumHfchY/YMHm2rtcMfobg/fqDU8pq/v2VD2u3XgBzNQfSHdHe8yDVPzakY65NNHVa0Pp2ksDz34bqWa7zW8dd4jTQErfWa4R3W2w1kLd1kuug32v5iRztJBHDoK1zsUtRmfLuVAeQWsIqHjkQXBx5Pj3vFoPDqWztVuprXRimo2ObFvOeS5xc5znHVziTzkkkoIHs92i2237d8lhqKK4ubNSso2mnp3TOD4SS4ljAXaHXgdOjxq7+6LZ/wCp5B+xar+WoFsshiG3DLHiNgf9SqQ7waNeLna8fHoPeV3IId3RbP8A1PIP2LVfy1oMyyWz5Bamx08N/pbnSyCpoasWSqJgnb6U/Y+LTqWuHS0kK0EQVxje1e13K2sNbb71T3OHSOtpY7XUychLoCW6hh4HUEa8dCFtu6LZ/wCp5B+xar+WvHMqebHbs3MLZG+SJjBDeKaMamemHNKB0vi1J6y0uHUplS1ENXTRVFNIyWCZgkjkYdWuaRqCD1EIIn3RbP8A1PIP2LVfy07otn/qeQfsWq/lqYogh3dFs/8AU8g/YtV/LTui2f8AqeQfsWq/lqYogh3dFs/9TyD9i1X8tO6LZ/6nkH7Fqv5amKIId3RbP/U8g/YtV/LVHbVtrlsy6GPHIbbcqauob/SnlJISI3sbJpqdQHMcdR3rgvqJVB2RFHTUeE2wUlPDByuQUcj+TYG77jISXHTnJ60Hu70x8qjNbl1PR1FW2eiqxT00z6c1A3d10jY+U3QNdeIHPpprwUjqIxNFLE4va14LSWOLXDXqI4g+NRyHEKE1dwnrXzVIqpnyNjdK4MZvRCMnd10Lt3Ub3PxQdYcvZNKymba60V8hZydMTHvPY5heH672gG608CddeC3dkuEd2tVJXwskjjqGCRrJAA5viOnStRfMZZViOW3vZT1bDH/SPL/SsY5jQC1wLeDjzHjzFbTH7ayz2Wht0bzI2libEHkaF2nSgzuxx+0WWf8AUdZ/6K2lUvY4/aLLP+o6z/0VtICIiAiIgIiICxrn9rav9C/5JWSsW6H/AHbV/oX/ACSpr7hE+lBMPMvZpWKx3AL1a5eqcdltcu28sYOXqwF3iCDsXLQXminNS+oDC6Mgc3R5VIQA3y9a6ueprfxnZpDQdEJUhrbfDUauaOTk628x8oWjq6SamPft1b6ocy31yRZjpjuK6OKEroSstjjXiu7SvIniu4KjY9WlegK8Wle9PFJO7diaXH9wU70ONVkUdFNUyNMTDug8XHgFsqO1xs0dUHfd6noW3YQ1oDQAB0Ba7Zf2TpyHaHjzrsHJqHDiujmkDhxC0bZOXOXk9y4Ll5ucpQPKtzZp9ysP6R/8VT7nK3tmR/8AikP6V/8AFUPqP5X3WeL80rREXDdAUfzX7Vxfph/AqQKP5r9q4v0w/gUHyDdftpW/p3/KK72i21N2ro6Sij35Xc56GjpJPQFlNttTdsiqaSij35Xzv1PQ0bx1JPQFfmzfBYKGkHAmM6GWYjR0zuodTUDZvgsFDSDgTGeMsxGjpndQ6mq042NjjayNoaxo0AHMAkbGxxtZG0NY0aADmAXZAREQEREBERB8t5t9+PZvYzPMyK+1Qmbffj2b2MzzMivtARcgakBVNZNo+U5RNdYcXxSmmNsqpaeeaqreTjeWu0a1nDUvIGp6BqEFsIq1k2pxHZndcoitj2V1rl7WrLbNJo6KYPa1zS4Dm77UHRa667TcltNqgyO44eIcUkcwmU1gNUyN5AbI6PTQA6jh4wgttFB8yzee2XS1WTGrYLxfrlEaiKF0vJRxQj/mSO6B4lq7RtCvXo+tmJZFjjLfX1UUszp4qnlYnMa0lrozpx1IIIPNogsxULs7+/ByX2NJ8iJX0qF2d/fg5L7Gk+REg+o1Gdp/g3yn2rqfNOUmUZ2n+DfKfaup805BS/Yo+Cx/thN8liuVU12KPgsf7YTfJYrlQERct9MPKgxKC4UdxZK+gqoKlkUhie6F4eGvHO06cxHUspVHYc7tNgwPJ75T2JlHHS3malNNTyk9szlzWh5cfS7xI16tFtqXMMuoLraocpxKKGguUohZUW6pNSadx5uUaBzdbhwQWMiIggW3jwQ5N7Hb5xi2nYxeBHHPJN5561e3jwQ5N7Hb5xi2nYxeBHHPJN556C0kREBERAREQFEdr/gry72rqPNlS5eVZTQVtJNS1cMc9PMwxyRSN3mvaRoQR0ghBQeI3u0x4pZWSXSga9tFCHNdUsBB3BwI1W2+r1n/ALWt3xlnzqa9yfAfWhZfirV41myrBo6Sd9NhlkmnaxxjjNMxu+7TgNejUoIgL/ZjzXe3fGWfOn1es/8Aa1u+Ms+daDYDsvoZbRe2ZtjFiq5GXGZsE7Y2ybpa4skj5uDWub3viKtTuT4D60LL8VagguyOqp6vbPlktJPFPF9SqQb8Tw8a7zukK8Fo8bxHHsYfO/HrNQ2104AldTQhheBzA6eUreICIiDyq54Kamkmq5YooGDV75XBrWjxk8FQtj2jwYntWp8KhdTsxKpkllpauSeNzYd5hdyTHNcQIw8HTe0I3tNNAFNOyS47FckHQWReeYoPDgGImGMnHLWSWgn+gHUgur0VY9/b1p+OR/Onoqx7+3rT8cj+dUx3P8R9bdr/AFATuf4j627X+oCC5/RVj39vWn45H86z7fcaG5Rukt1ZTVcbTuudBK2QA9RIKonuf4j627X+oC2vY80NLbcl2iUdvp46alirqYRxRt0a0cjrwCC60REBVN2Sz2x4PaXyOa1jb5REucdABvniVbK199stsv8Ab3UF7oKavo3ODjDURh7SRzHQ9KCpXX6z7x/3tbvjLPnXH1es/wDa1u+Ms+dTXuT4D60LL8VancnwH1oWX4q1BCvq9Z/7Wt3xlnzoL9Z9R/va3fGWfOpr3J8B9aFl+KtTuT4D60LL8VagjHY2yMlx7KZIntfG7Iqstc06gjvOIKt1a2wWK1Y7Qdo2K301vpN4v5GnjDG7x5zoOngFskBERAREQE1XBK6Ocg7Fyw7q7/dtX+hf8kr1e/RYNyc6SiqI2cXOjc0DrJBU19wifShmO4Be0eruZcSUktLKYqqN0credrhpouwdwXqdxPcOQ92AN5+JXpvrG30D0GSXro5y8d9C9QO5cujiCCCNQV1Ll0cUS19Xbo5NXQncd1dBWonhkgdpI0jx9BUkJXlI1r2lrmhzT0FZ1yTDGYRk869I2ue4NYC4noC2MlujMoLXFrekLNgijhbpG0DrPSs5yR+hpi0lt5nVB/whbiFrY2BrGhrR0BeTSu4K1Tabe0w9w5dw5Y4cuwcoSyQ9c76xg9N9EPZ+jufnWPIC3xhdt9dd5SPFz1b+zJ3/AMUhH/1ZP4qonR8oQGA7x5gBzq2sBgnosdhhqo3Ryb7nbrufQngqH1GY/wAUR/KxxY/GmAcuwKxmSar2a5cR0Hoo/m3C1R/pR/ArfgrxrKSCth5KpjD2a66HhxQVtgWFU8BlmDCIpZDJLKfTSknXQeIKzo2NjjayNoaxo0AHMAkbGxxtZG0NY0aADmAXZAREQEREBERAREQfLebffj2b2MzzMivtUJm3349m9jM8zIr7QaiLJLW/LH442pJvEcAqnQbjuEZIGu9pp0jhqqh2N53jtip8ptt9uMFtnjvNVO11Qd0TMLtO9P4RBGmg48QrxbBCKntjkY+X03TLuDfI6tefRQPZxg7rNbLtT5FSW+rdUXaoroNWiUNY8jT0w4Hggqq6xzVmx3abkboZIKK+XJtTRtkbul0QlaA/To11/crG22aDYRc+rtOm+VGrLlghmhMM0UckJGhje0FunkPBJYIpoTDNFHJERoWPaHNPuHggpu7VkWHbT8fyi9b8dir7FHbXVe4XMp5Ro4b2nMD1+XqXjLltryrb7iBscpqqSkpKthq2sIjkcWElrSR327oNSOkqc5tbcr+qtDcMVmoaqkjidDVWevO7DONdQ9pAOjhzdXALWYti1/rM3gyjLIrbQGhpXUlBbbe4vZGH+me52g4nU8AgshULs7+/ByX2NJ8iJX0qF2d/fg5L7Gk+REg+o1Gdp/g3yn2rqfNOUmUZ2n+DfKfaup805BS/Yo+Cx/thN8liuVU12KPgsf7YTfJYrlQFqYsktb8sdjjak/VhkAqnQbjuEeoGu9pp0jhqtstXfm1tPQ1NZYaCjqryGBsQqHcmHjUahzwNdNNTogpHGaq30eyrNpL1ZpbxazkNS2pp4jo5jC9v9J196dDw4rAkq6DF7hY3bLM3rrs+srIojYnzdssMTvTEjTWMAdfH3lbWyXFq/F8ZqoL26nfca6tmrqhkB3o2GQjvQTz8B+9SqitNtoZ3zUVvo6aZ/ppIYGscfKQEGaecoiIIFt48EOTex2+cYtp2MXgRxzyTeeetXt48EOTex2+cYtp2MXgRxzyTeeegtJERAREQEREBERAREQQ7Zd9p7v7dXD/yHqYqHbLvtPd/bq4f+Q9TFAREQEREFadkj4Fsk/Mh88xa6D7BF+YP4LY9kj4Fsk/Mh88xatrnMo2uYwyOEYIYCAXHTm4oOYKiGoknZDI174H8nKB+A7QHQ+4QfdXroepVvf8AHr3WV9VURQy9qzzyS9rxyM3t50MTWPOrgO9LXjXXUa6gFJcevn1QqyI6iXlqZ0ck7qprXE8k0Dk3g85cPSuZoOJBGqCyFjbCvuz2k+z6bzK1GE0dZQWd8FfCISJ3mJuo13DpoXAOc1p114NOnk1W32FfdntJ9n03mUFxIiICIiAiIgIiICIiAiIgLglcrq5B1cV5PcvRyx5Cg8pXrCmkXtMTxWBOSg112paavi3KqJrx0HpHkKg11x+WmLn0jjNF6k+mHzqc1BPFa2clb8PJyYfjPTXfFW/tXZJa4hwII5wU31KrjRQ1Wpkbo/1Y4FR2st81OSR/SM6x/wDkLr4OZTL1PUqWTBancdw8N5N5eQK51Vtoemq4JXTeTVBySuhXJK6koOp512C6dK7AoPRp4LuCvIFdgUHpqm8vPeTVB6byby8tV7UtLNUu0jbo31R4BY2tFI3adQmImZ1DrvrZ2y0VNcQ4jkofVuHP5As+3WyGAhzxysnWRwHuLfQE8Fzc31D9MX/VvHxv1uyrJa6O3aOij3pumR/E+51KRQyrS05PBbGAlcy17Xndp3K3FYrGobeJ6yo3LXQkrNjWKWW0ruD768WL0bzoO6IEQEREBERAREQEREHy3m3349m9jM8zIr7VCZ0RF2YtjdJ3ofTxhpPTrDIB+/gr7QEREBERAREQFQuzv78HJfY0nyIlfSoTZsRL2X2Tvj75raeUEjo0bED+/gg+pFGdp/g3yn2rqfNOUmUb2mNc/Z1lDWAlxtlToB+icgpXsUfBY/2wm+SxXKqY7E97XbL5WtcC5lwlDh1d6xXOgIiICIiAiIggW3jwQ5N7Hb5xi2nYxeBHHPJN5561O3x7Y9kGSl7g0GBjRr0kyM0C2/YyNczYlje8CNWzEeTlnoLRREQEREBERARFpM3vEuPYde7xTxslmoKOWpYx+u65zGkgHTo4IN2ioW2ZztTuNtpK2Gmw9sVTEyZod2xqA4AjXjz8V7y5btY5J+5Bh2/unTTtjXXTxnRBYWy77T3f26uH/kPUxXy3sxvO1602+4xTwWbdlq5Kj/egcHl7yXPLeS/BLjrx9xTP0W7VvxGG/wDcfOgvFFU+zbP7/cMmv1ozVllpRbqSGqFRRue1mjyRo4vPiCnOQZfY7DM2nr61rq5/2Oip2maok8kTAXe7pog368auqp6KmfUVk8VPBGNXySvDGtHWSeAUQ+qOYX7harbBj1E7/wDlXTSapI62wMO60/nP/wAK9qTALY+pZV5DNVZDXsO82W5PD42H+5CAI2+43XxoKp7JLOvqtsxr6TE6SouVBJLGytuLKd/a8UYcCN2Q6BxLw0at1ABW3xWprazGrZUXWnFNXy07HTQjhuO06ujyKf7VsXqcu2eXawWyWCnqaqNjYnS6hjS17XaHQagd7pzKu2YltWaxrRLhugAHPUfMg3SLTehPav8AjMN9+o+ZPQntX/GYb79R8yDcrG2FfdntJ9n03mVr/QntX/GYb79R8ylWx7Db7jFVktfk09ukrbvUxzblCXljAxm7+EAUFkIiICIiAiIgIiICIiAiIgLghcog83BeMjVkELo5qDXysWDPGtw9ixZYtUGhnj51rp4jx4KRTQeJYE9P4kEcmiPUsKWMqQz0/iWDNT+JBF623Rzalo3H9YHOtPUU0tOf6Rve+qHMpnLBp0LElh1BBGo6irmDmXxdT3DRkwVv36lEdU1W4q7W12roTuO6uhaieGSB27I0tPX0FdbDyceb4z2pXxWp7dCV1JQrglb2sXIXTVcgoPQFc6roF3Y1z3BrGlxPQEmdexzqF2ijkmduxNLitjSWonR1QdP7oW4gp2xtDWNDW9QVDNz6U6p3P9LOPjTbu3TWUdra3R0/fu9T0LcQxaAADQdQXtFB4lmQ0/iXJy5r5Z3eVylK0jUPKGLxLPgiK9YafxLPgp/EtbN0giWxgjXMMHiWbFD4kCFizI2riONe7GoOWhdx1oAuyAiIgIiICIiAiIgIiIKZ7IHZTW5q633/ABWobS5PbNBES7cEzAd4De/BcDqQTw4kFV1FmO3KgjbTVWENq5oxuum7Te7f8erH7p9xfVaIPlb0eba/yfD4lN9NPR5tr/J8PiU3019Uog+VvR5tr/J8PiU3009Hm2v8nw+JTfTX1SiD5W9Hm2v8nw+JTfTT0eba/wAnw+JTfTX1SiD5Uly/blcY3UtJhIo5pBuiftRzdzxgvfuj3VZPY/bKavBorheslqG1WTXT7M5rt8RNJ3i3e/CcTxJ5uA06zcSIC6TxRzwyQzMD4pGljmnmcCNCCu6IPlKv2ebRdkuSV9Vs3gF5x6sfv9qEB5Z1BzNQdRroHNPEc69PR5tr/J8PiU3019Uog+VvR5tr/J8PiU3009Hm2v8AJ8PiU3019Uog+VvR5tr/ACfD4lN9NPR5tr/J8PiU3019Uog+VvR5tr/J8PiU3009Hm2v8nw+JTfTX1SiD5KrMX2t7Xaqlt2T0DMdx+OQSTax8mDp07pJc93UDoF9SY7Z6TH7FQWi2s3KOihbBE08+gGmp8Z5ytiiAiIgIiICIiAojtf8FeXe1dT5tylyiO1/wV5d7V1Pm3IK8w77kLH7Bg821bhafDvuQsfsGDzbVp71lM1pyCqouRNSXmBlPHo4BpcyRzy4ta52mjB0FBMEUOhzV0lVSMda5YYqiIOaZnljnPLXHcbq3dJ1bpoXAnUEDRbXFL8b7Tzulp2008LmtfDvkubq3Ubwc1pB5xzaHTgSgh1Ts+O0XarkVtkvdZa6aGgo5ntpm68sQXbu9xHMeI8a+icQxe3YxbIqahpqcVG4BPUsiDZKhw53vPEknn4kqstl3hsyz2qo/lOV1ICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLghcog83BebmarI0XUhBgyRa9CxZYPEts5uq8nx6oNDNTeJYM1N4lI5IViywa9CCMTU3iWDNT+JSiam8SwJqbxII1LB4liT07XtLXtDmnoKkU1N4lhS0/iSJ13AiFZaSNXU5/wn51qZI3xuLXtLXDoKnUkHiWHU0Uc7d2VgcP3hdDDz7U6v3H9q2TjRbuvSGrs0EnQcdVuZLC7lRycg5M8+8OIWyo7bFTDvG6v9UedXMnPxVruvctFeNeZ76aajtckmjpv6NvV0lbulpI4W6RsA8fSVmxweJZUVP4lys3JyZvlPX7LlMVaemLHD4lmQ0/iWXDTeJZ0NN4lobGJDTeJZ0NN4llw03NwWdFT+JBiQ03iWbFBp0LJjh8SyWRaIPCOHToWQyNerW6LuAg6hq7gLkBEBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFEdr/gry72rqfNuUuUR2v+CvLvaup825BXmHfchY/YMHm2rvLj1pli5OShiLe80OpDhua7ujtdRpvO6ekqM4rnOK0+MWeCfILZHNHRwsex04Ba4MAIPjW09H+I+uS1/GAg2IxyziWKQW6nDo2BjRu96AAQO95joCQCRrxWTa7VQ2pj2W+mZA15BdoSSdBoOJ46AcAOhaX0f4j65LX8YCej/EfXJa/jAQbbZd4bMs9qqP5TldSojYxdKC8bYMsq7VVwVlMbXSN5WF283UOdqNVe6AiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgELqQuyIPJzdV4vjWWQupag10kKw5afXoW5czVeL4tUEfmpvEsKal8SkskHiWLJT69CCMS0viWO+l8Sk0lL4l4PpPEgjnaviXZtL4lvu1PEuzaTxINPHS+JZcVL4ls46XxLJjpvEgwIqbxLNhp/EsyODxLIZF4kGPFD4lksi06F7NZovQNQdGs0XcNXYBcoOAFyiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC6yxsljfHKxr43gtc1w1BB5wQuyINL6E8d/sC0fE4/op6E8d/sC0fE4/ordIg0voTx3+wLR8Tj+inoTx3+wLR8Tj+it0iDCttpt1s3/AKm2+ko+U03+14Wx72nNroBqs1EQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQcELqWruiDxLNV5uiWSQuC1Bguh8S83QeJbEtXXcCDX8h4lyKfxLO3AudwIMNsK9mxL33V2DUHk2PRegauwC5QcALlEQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEWDfqmSjsdxqoCBNBTSSMJGoDmtJH7wqDtmU7UrzspGdxXm0UUNLTPqBQ9oh5q2xk77nv17zXdOgaOgcUH0UioC95btIbs9j2jwXC0UlsEUdULF2rv70DnAd9MTrvEHXQAABSjLs3vtzyPHsVwg0tJdLpQC51NbVM5VtHTnm0Z+E4nhx4c3XqAtdFUluyPLMOz+y45mtfSXq230PZRXKGmFPJFMwamN7ASCCCNCOtYdmvud7RLjerhid5t1isFvrJKKkbNRiofWPj9M55J71pJ6OPvILLxnKbZkst2jtUskjrZWPoanfjLd2VumoGvOOPOt4vmbAcgvePbMdrV8LIKW/0t5nlewN342S94HAA841J01Vs5plFztWxSpyWjkjbdWWyKqa9zAW8o5rSTu82nE8EEkuuUWy15LZrDWSyNuN2EppWCMlruTbvO1PMOHWt4qOv9ZNcNrGxetqSDPUUNVNIQNAXOpmk8PKVy7NsgzPJr7Bj2U2bFrLaKl1EyWqiZNPWSt9O7de4BrAeA05/4BeCKlLVtXusOD5u+4QUNwyPFtA99E7Wnqmu+xzDTmGmpcNeGnR0Y+L3zPrhS2u82PLcey2OZ8ZrbTBDHAYY3em3X728C3+8PcQXmiIgIiICIiAiIgIiICIiAiLS5jktBiVgnvF2E5o4S0P5Fm+4bxAHDylBukWusF6ob/ZaW7WucTUNSzlI36acOnUdBBBB8ii2FbUsczG/Vdos8lT21Ttc/WWLdbI0HQlp148459EE6RRHJs/s+P5TZ8eqhUS3O5va2JkLA4MDnboc46jQa6+8V65/nVlw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
