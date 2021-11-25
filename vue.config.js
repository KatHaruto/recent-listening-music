const isProd = process.env.NODE_ENV === "production";

module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: isProd ? "/gas-account-book" : "/",
  outputDir: "docs",
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        ws: true,
        secure: false,
      },
    },
  },
};
