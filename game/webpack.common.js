const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        main: {
            import: './src/app.ts',
            dependOn: ['babylonjs_base', 'babylonjs_camera', 'babylonjs_mesh', 'babylonjs_gui'],
        },
        babylonjs_gui: {
            import: '@babylonjs/gui/2D/controls',
            dependOn: ['babylonjs_base', 'babylonjs_mesh'],
        },
        babylonjs_camera: {
            import: [
                '@babylonjs/core/Cameras/arcRotateCamera',
                '@babylonjs/core/Cameras/freeCamera',
                '@babylonjs/core/Lights/hemisphericLight',
            ],
            dependOn: ['babylonjs_base', 'babylonjs_mesh'],
        },
        babylonjs_mesh: {
            import: ['@babylonjs/core/Meshes/mesh', '@babylonjs/core/Meshes/meshBuilder'],
            dependOn: ['babylonjs_base'],
        },
        babylonjs_base: [
            '@babylonjs/core/scene',
            '@babylonjs/core/Engines/engine',
            '@babylonjs/core/Maths/math',
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
