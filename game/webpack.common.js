const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        main: {
            import: './src/app.ts',
            dependOn: 'babylonjs',
        },
        babylonjs: [
            '@babylonjs/core/scene',
            '@babylonjs/core/Maths/math',
            '@babylonjs/core/Meshes/meshBuilder',
        ],
    },
    output: {
        filename: 'js/[name].bundle.js',
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: 'assets/[hash][ext]',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
        }),
    ],
}
