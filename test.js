'use strict';
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';
process.on('unhandledRejection', err => {
  throw err;
});
const jest = require('jest');
const argv = process.argv.slice(2);
argv.push('--env=jsdom');
jest.run(argv);
