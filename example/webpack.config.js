const path = require('path');
const MoveUselessFilePlugin = require('../MoveUselessFilePlugin')

module.exports = {
	mode: 'development', 
  entry: './src/index.js',
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new MoveUselessFilePlugin({
      logInfo: true,
      exclude: []
    })
  ],
  module: { 
    rules: [
      {
        test:/\.js[x]?$/, // normal 普通的loader
        use:{
          loader:'babel-loader',
          options:{ // 用babel-loader 需要把es6-es5
            presets:[
              ['@babel/preset-env', {
								modules: false,
								useBuiltIns: 'usage',
								corejs: '3',
							}],
							'@babel/preset-react'
            ],
            plugins:[
              // ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose": true }],
              [
                "@babel/plugin-transform-runtime",
                {
                  "corejs": {
                    "version": 3,
                    "proposals": true
                  },
                  "useESModules": true
                }
              ],
            ]
          }
        },
        // include:path.resolve(__dirname,'src'),
        exclude:/node_modules/
      },
			{
        test: /\.(jpe?g|png|gif|eot|svg|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 20480,
            outputPath: 'assets/img/'
          }
        }]
      },
      {
        test: /\.less$/,
        use: [
					// MiniCssExtractPlugin.loader,
					'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	}
}