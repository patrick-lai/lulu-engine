var path = require('path');
var webpack = require('webpack');

const plugins = [
  //文件头部指定的注释信息
  new webpack.BannerPlugin('---------- Author: Starriv Email: Starriv.993@gmail.com ----------'),
  new webpack.DefinePlugin({
    __DEVCLIENT__: true,
    __DEVSERVER__: false,
    __DEVTOOLS__: false,
    __DEVLOGGER__: true,
    'process.env': {
      'NODE_ENV': JSON.stringify('development')
    }
  }),
  // react代码热加载插件
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

module.exports = {
  debug: true,
  devtool: 'eval-source-map',
  entry: [
    './public/src/main.js'
  ],
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [{
      test: /\.js$|\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel',
      include: path.join(__dirname, '../src'),
      query  :{
          presets:['react','es2015','stage-2']
      }
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader',
      query: {
        limit: 10000,
        name: '[name].[ext]'
      }
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader!postcss-loader"
    }, {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader?strictMath&noIeCompat"
    }]
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".less", ".css"]
  },
  plugins: plugins
};
