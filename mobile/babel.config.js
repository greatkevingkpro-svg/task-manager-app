module.exports = function (api) {
  // Caches Babel config for faster rebuilds during development.
  api.cache(true);
  return {
    // Expo preset includes React Native transforms needed by Metro.
    presets: ["babel-preset-expo"],
  };
};
