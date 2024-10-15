const path = require('path');

module.exports = {
  entry: {
    admin: './src/admin/index.js',
    frontend: './src/frontend/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js', // Compiled files as admin.js and frontend.js
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
