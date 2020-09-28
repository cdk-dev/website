const withOptimizedImages = require("next-optimized-images")
module.exports = Object.assign(withOptimizedImages(), {
  publicRuntimeConfig: {
    deployUrl: process.env.DEPLOY_PRIME_URL || "http://localhost:3000",
  },
})
