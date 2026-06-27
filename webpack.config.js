const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlPlugins = glob
  .sync('./src/html/*.pug')
  .map(
    (file) =>
      new HtmlWebpackPlugin({
        template: file,
        filename: path.basename(file, '.pug') + '.html',
      })
  );

const entries = Object.fromEntries(
  glob.sync('./src/js/*.js').map((file) => [
    path.basename(file, '.js'),
    './' + file.replace(/\\/g, '/'),
  ])
);

module.exports = {
  entry: entries,

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "sass-loader",
        ],
      },

      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
    ],
  },

  plugins: [
    ...htmlPlugins,

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets'
        }
      ]
    })
  ],

  devServer: {
    static: './dist',
    open: true,
    hot: true,
    watchFiles: ['src/**/*'],
  },
};