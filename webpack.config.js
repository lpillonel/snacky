const ExtractTextPlugin = require("extract-text-webpack-plugin")
const webpack = require("webpack")

const extractSass = new ExtractTextPlugin({
    filename: "snacky.css",
})

module.exports = {
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "snacky.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "stage-0",
              ["env", {
                "targets": {
                  "browsers": ["last 1 versions"],
                },
                "modules": "commonjs",
              }],
            ],
            "plugins": [
              "transform-class-properties",
              ["transform-object-rest-spread", { "useBuiltIns": true }],
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }],
        })
      }
    ],
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
  ],
}