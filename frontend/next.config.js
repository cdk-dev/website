const withOptimizedImages = require("next-optimized-images");

module.exports = withOptimizedImages({
  publicRuntimeConfig: {
    deployUrl: process.env.DEPLOY_PRIME_URL || "http://localhost:3000",
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      loader: 'ignore-loader'  // Requires installing ignore-loader
    });

    return config;
  }
});
