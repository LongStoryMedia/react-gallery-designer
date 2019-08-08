const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/umd.js",
  plugins: [
    new CleanWebpackPlugin([`umd/react-gallery-designer.min.js`])
  ],
  output: {
    libraryExport: '__RGD',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, "umd"),
    filename: `react-gallery-designer.min.js`
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
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      },
      "long-story-library": {
        root: "_$",
        commonjs2: "long-story-library",
        commonjs: "long-story-library",
        amd: "long-story-library"
      }
    }
  ],
};
