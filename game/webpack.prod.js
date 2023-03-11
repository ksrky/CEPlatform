const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production', // TODO: why bundled file is bigger in production mode?
});