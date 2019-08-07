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
  externals: {
    react: "commonjs react"
  }
};
