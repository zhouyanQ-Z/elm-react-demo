const {
  override,
  adjustStyleLoaders,
  addWebpackAlias,
  fixBabelImports,
} = require("customize-cra");
const { resolve } = require("path");

module.exports = override(
  // 配置全局scss变量
  adjustStyleLoaders((rule) => {
    if (rule.test.toString().includes("scss")) {
      rule.use.push({
        loader: require.resolve("sass-resources-loader"),
        options: {
          resources: "./src/styles/mixin/index.scss",
        },
      });
    }
  }),

  // 配置@指向src
  addWebpackAlias({
    "@": resolve("src"),
  }),
);
