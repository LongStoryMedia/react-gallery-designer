"use strict";
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

process.on("unhandledRejection", err => {
  throw err;
});

const path = require("path");
const webpack = require("webpack");
const webpackConfig = require(`./webpack.config.prod`);

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;
  console.log(stats.toString({ colors: true }));
});
