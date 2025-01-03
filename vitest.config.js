import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'forks', // Needed for bundling NodeJSFunction during tests, see https://github.com/aws/aws-cdk/issues/20873
  },
})