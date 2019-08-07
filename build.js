"use strict";
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

process.on("unhandledRejection", err => {
  throw err;
});

console.log(process.argv)

const path = require("path");
const webpack = require("webpack");
const webpackConfig = require(`./webpack.config.${process.argv[2]}`);

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;
  console.log(stats.toString({ colors: true }));
});
