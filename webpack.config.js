const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production';
  const isWordPress = Boolean(env.wordpress);
  const isPdfReader = Boolean(env.pdfreader);

  if (isPdfReader) {
    return {
      entry: './src/pdf-reader-entry.js',
      output: {
        path: path.resolve(__dirname, 'wordpress/abu-programme-pdf/assets'),
        filename: 'custom-pdf-reader.js',
        clean: true,
      },
      mode: 'production',
      devtool: false,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [['@babel/plugin-proposal-decorators', { version: 'legacy' }]],
              },
            },
          },
        ],
      },
    };
  }

  return {
    entry: './src/index.js',
    output: {
      path: isWordPress
        ? path.resolve(__dirname, 'wordpress/flickr-mosaic/assets')
        : path.resolve(__dirname, 'dist'),
      filename: isWordPress
        ? 'flickr-mosaic.js'
        : `${isProduction ? `component.[contenthash].min.js` : 'component.js'}`,
      chunkFilename: isWordPress
        ? '[name].[contenthash:8].js'
        : `${isProduction ? `component.[contenthash].[name].js` : 'component.[name].js'}`,
      cssFilename: isWordPress ? 'flickr-mosaic.css' : 'component.[contenthash].css',
      cssChunkFilename: isWordPress ? '[id].css' : '[id].[contenthash].css',
      clean: true,
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isWordPress ? false : isProduction ? 'source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [['@babel/plugin-proposal-decorators', { version: 'legacy' }]],
            },
          },
        },
      ],
    },
    devServer: {
      static: path.resolve(__dirname, 'public'),
      open: true,
      port: 8080,
    },
    plugins: isWordPress
      ? [
          new CopyPlugin({
            patterns: [{ from: 'src/assets/flickr-logo.png', to: 'flickr-logo.png' }],
          }),
        ]
      : [
          new CopyPlugin({
            patterns: [
              { from: 'src/sw.js', to: 'sw.js', info: { minimized: true } },
              { from: 'src/assets/*', to: 'assets/[name][ext]' },
              { from: 'src/favicon.ico', to: 'favicon.ico' },
            ],
          }),
          new HtmlWebpackPlugin({
            template: './public/index.html',
          }),
        ],
  };
};
