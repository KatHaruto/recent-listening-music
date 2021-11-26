const isProd = process.env.NODE_ENV === "production";

module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: isProd ? "/recent-listening-music" : "/",
  outputDir: "docs",
  filenameHashing: false,
  productionSourceMap: false,
};
