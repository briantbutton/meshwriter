const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "meshwriter.js",
    path: path.resolve(__dirname, "dist"),
    library: "meshwriter",
    libraryTarget: "umd"
  },
  mode: "production",
  optimization: {
    minimize: false
  }
};
