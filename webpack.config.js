const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const envPath = path.resolve(__dirname, '.env'); // setting up the env path
const envVariables = dotenv.config({ path: envPath }).parsed; //setting up the env variable
const isAnalyzer = JSON.parse(envVariables?.ANAlYZER)

const config = {
    mode: 'development', //dev, stg, prod
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js')}, // starting poin
    output: {
        path: path.resolve(__dirname, 'dist'), //output folder
        filename: '[name].[contenthash].js', //output root file name
        clean: true, // to remove old has file
        assetModuleFilename: '[name][ext]',
    },
    devtool: "source-map", //setting up source map for debugging
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'), //folder to server
        },
        port: envVariables.PORT, // port to serve on
        open: true,
        hot: true, // auto update
        compress: true, // file gzip compression
        historyApiFallback: true,
    },
    module: {
        rules: [ //setting up loaders
            { //scsss loader
                test: /\.scss$/, //for checking all files with scss extension and add loader to it
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            { //babel loader for backward compatibilit
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                    },
                },
            },
            { // image assest loader, no third party module required
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ //html bundling plugin
            title: 'Webpack App', //set title tag
            filename: 'index.html', //output filename
            template: 'src/index.html', //input file
        }),
        new webpack.DefinePlugin({
            'process.env.API_BASE_URL': envVariables.API_BASE_URL, //setting env variable while build
        }),
    ]
}

// if analyzer is set as true in env
if (isAnalyzer) {
    config?.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;