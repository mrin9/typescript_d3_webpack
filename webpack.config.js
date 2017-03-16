const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //transpile scss to css and extract into a text file 
var CopyWebpackPlugin = require('copy-webpack-plugin'); // to copy static files to dist folder


module.exports = { 
    entry: {
        app   : './src/app.ts',
        vendor: './src/vendor.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), //__dirname is the directory where webpack.config.js lives
        filename: '[name].bundle.js' //[name] gets replaced with object-key of 'entry' (this should create 2 files app.bundle.js and vendor.bundle.js)
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        rules: [
            { 
                // gets triggered by import in .ts files
                test: /\.ts$/, 
                loader: 'ts-loader' ,
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }, 
            {
                // gets triggered using by loading fonts in .css or .scss files (using @font-face)
                test: /\.(eot|ttf|woff|woff2|svg|gif|png)$/,
                loader: "file-loader?name=public/[name].[ext]"
            },
            {
                // gets triggered by importing .scss files in any .ts files
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ],
    },
    plugins:[
        // Automatically loads modules. 
        // the identifier is filled with the exports of the loaded module.
        new webpack.ProvidePlugin({   
            jQuery  : 'jquery',
            $       : 'jquery',
            jquery  : 'jquery'
        }),

        new ExtractTextPlugin({
            filename: "all_style.css",
        }),
        
        new CopyWebpackPlugin(
            [{ from: 'src/data/*.json', to: 'data/[name].[ext]' }]
        ),


        //Extract common code into chunks
        /*
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.js',
            minChunks: 2
        }),
        */
    ]
}