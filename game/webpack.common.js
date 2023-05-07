const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        main: {
            import: './src/app.ts',
            dependOn: [
                'babylonjs_base',
                'babylonjs_basic',
                'babylonjs_camera',
                'babylonjs_mesh',
                'babylonjs_gui',
            ],
        },
        babylonjs_gui: {
            import: ['@babylonjs/gui/2D/controls', '@babylonjs/gui/2D/advancedDynamicTexture'],
            dependOn: ['babylonjs_base', 'babylonjs_basic', 'babylonjs_mesh'],
        },
        babylonjs_camera: {
            import: [
                '@babylonjs/core/Cameras/universalCamera',
                '@babylonjs/core/Cameras/freeCamera',
                '@babylonjs/core/Lights/hemisphericLight',
            ],
            dependOn: ['babylonjs_base', 'babylonjs_basic', 'babylonjs_mesh'],
        },
        babylonjs_mesh: {
            import: ['@babylonjs/core/Meshes/mesh', '@babylonjs/core/Meshes/meshBuilder'],
            dependOn: ['babylonjs_base', 'babylonjs_basic'],
        },
        babylonjs_basic: {
            import: [
                '@babylonjs/core/scene',
                '@babylonjs/core/Cameras/camera',
                '@babylonjs/core/node',
                '@babylonjs/core/Materials/material',
            ],
            dependOn: 'babylonjs_base',
        },
        babylonjs_base: ['@babylonjs/core/Maths/math', '@babylonjs/core/Engines/engine'],
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
        new CopyPlugin({
            patterns: [{ from: 'public/images', to: 'images' }],
        }),
    ],
}
