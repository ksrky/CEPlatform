const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
    mode: 'production', // TODO: why bundled file is bigger in production mode?
    plugins: [new BundleAnalyzerPlugin()],
})
