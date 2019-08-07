"use strict";
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.env.TEST_SCRIPT = process.argv[2];

process.on("unhandledRejection", err => {
  throw err;
});

if (!process.argv[2]) {
  console.error(
    "please pass path to the script you would like to run as the thrid argument in your start command. \n" +
      "e.g. - 'npm run start script/to/test', or 'yarn start script/to/test'."
  );
  process.exit(9);
}

const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config.dev");

const stats = {
  all: undefined,
  assets: false,
  assetsSort: "size",
  builtAt: false,
  cached: false,
  cachedAssets: false,
  children: false,
  chunks: false,
  chunkGroups: false,
  chunkModules: false,
  chunkOrigins: false,
  chunksSort: "size",
  colors: true,
  depth: false,
  entrypoints: false,
  env: false,
  errors: true,
  errorDetails: true,
  hash: false,
  maxModules: 1500,
  modules: false,
  modulesSort: "size",
  moduleTrace: false,
  performance: false,
  providedExports: false,
  publicPath: false,
  reasons: false,
  source: false,
  timings: false,
  usedExports: false,
  version: false,
  warnings: true
};

const options = {
  hot: true,
  host: "localhost",
  port: "3000",
  open: true,
  stats
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(options.port, options.host, err => {
  if (err) console.log(err);
  console.log(`
    view app at http://localhost:${options.port}
    `);
});
