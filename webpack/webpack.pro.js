const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const Dotenv = require('dotenv-webpack');
module.exports = {
  entry: {
    pro: path.resolve("node_modules/babel-polyfill"),
    app: path.resolve("./src/main.js")
  },
  mode: "production",
  output: {
    path: path.resolve("./dist"),
    filename: "js/chunk-[name][hash:12].js",
    publicPath: ""  // 默认相当路径  如果 需要上cdn  配置cdn 

  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve("./src"), path.resolve("node_modules/ant-design-vue/")],
        use: ["style-loader", "css-loader", 'postcss-loader']
      },
      {
        test: /\.png|.jpg|.gif|.jpeg|.svg|.ttf|.eot|.woff|.woff2$/,
        include: path.resolve("./src"),
        use: {
          loader: "file-loader",
          options: {
            name: "images/[name].[ext]",
            publicPath: "../"
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                //定制ant-desing-vue 主题色
                modifyVars: {
                  "primary-color": "#ff6d26", // 全局主色
                  "link-color": "#ff6d26", // 链接色
                  "success-color": "#ff6d26", // 成功色
                  "warning-color": "#faad14", // 警告色
                  "error-color": "#f5222d", // 错误色
                  "font-size-base": "14px", // 主字号
                  "heading-color": "rgba(0, 0, 0, 0.85)", // 标题色
                  "text-color": "rgba(0, 0, 0, 0.65)", // 主文本色
                  "text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
                  "disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
                  "border-radius-base": "4px", // 组件/浮层圆角
                  "border-color-base": "#d9d9d9", // 边框色
                  "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)" // 浮层阴影
                },
                javascriptEnabled: true,
              }
            },
          }
        ]
      },
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        include: path.resolve("./src"),
        loader: "vue-loader"
      }
    ]
  },
  resolve: {
    modules: [path.resolve("./node_modules")],
    alias: {
      "@": path.resolve("./src"),
      "views": path.resolve("./src/views"),
      "components": path.resolve("./src/components"),
      "assets": path.resolve("./src/assets"),
      "utils": path.resolve("./src/utils"),
      "api": path.resolve("../src/api"),
      "store": path.resolve("./src/store"),
      "router": path.resolve("./src/router"),
      // "@ant-design/icons/lib/dist$": path.resolve("./src/tmpicons.js")
    },
    extensions: [".js", ".vue"]
  },
  devtool: "none",
  devServer: {
    port: 8080,
    hot: true,
    hotOnly: true,
    proxy: {
      "/admin_api": { // 系统信息
        target: process.env.VUE_APP_ARCHON_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/admin_api": "" //如果你不想始终传递 /admin ，则需要重写路径
        }
      },
      "/auth_api": { // 登录信息
        target: process.env.VUE_APP_SSO_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/auth_api": "" //如果你不想始终传递 /auth ，则需要重写路径
        }
      },
    }
  },
  //分包加载
  optimization: {
    splitChunks: {
      chunks: "all", // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件,
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: 1,  //
        }
      }
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      title: "管理系统",
      template: "./public/index.html",
      filename: "index.html",
      chunks: "all",
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联css
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/chunk-[name][contenthash:12].css",
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require("cssnano"), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
      },
    }),
    new VueLoaderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin(),
    new Dotenv({
      path: `./.env.${process.env.NODE_ENV}`, // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    })
  ]
};
