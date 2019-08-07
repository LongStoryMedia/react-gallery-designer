const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.js",
  plugins: [
    new CleanWebpackPlugin([`umd/react-image-designer.js`])
  ],
  output: {
    library: 'GalleryDesigner',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, "umd"),
    filename: `react-image-designer.min.js`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: "./babel.config.js"
          }
        }
      }
    ]
  },
  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDom',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ],
};
