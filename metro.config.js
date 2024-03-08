const { getDefaultConfig } = require("metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-css-transformer"),
    },
    resolver: {
      sourceExts: [...sourceExts, "css"],
      blacklistRE: exclusionList([/#current-cloud-backend\/.*/]),
    },
  };
})();
