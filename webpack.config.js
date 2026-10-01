const path = require("node:path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./js/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/main.js",
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["pages", "css", "img"].map((directory) => ({
        from: path.resolve(__dirname, directory),
        to: directory,
      })),
    }),
  ],
};