const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.js",
  plugins: [
    new CleanWebpackPlugin([`build/react-gallery-designer.js`])
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: `react-gallery-designer.min.js`,
    libraryTarget: 'commonjs2'
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
      },
      "long-story-library": {
        root: "_$",
        commonjs2: "long-story-library",
        commonjs: "long-story-library",
        amd: "long-story-library"
      },
      "react-image-designer": {
        root: "__RID",
        commonjs2: "react-image-designer",
        commonjs: "react-image-designer",
        amd: "react-image-designer"
      }
    }
  ]
};
