# Cloud Spec - AWS CDK

Cloud Spec is a testing framework for AWS CDK applications that simplifies the process of writing and running integration tests for your cloud infrastructure. Unlike the official [@aws-cdk/integ-tests-alpha](https://docs.aws.amazon.com/cdk/api/v2/docs/integ-tests-alpha-readme.html) module, Cloud Spec drives the tests locally via [vitest](https://vitest.dev/)

## Features

- Easily deploy CDK stacks for testing purposes
- Automatically manage stack outputs
- Simplified test setup and execution
- Automatic stack naming based on test names
- Tagging of resources for easy identification

## Installation

```bash
npm install @cloudspec/aws-cdk
```

## Requirements

- Vitest (tested with version 1.6)
- A Vitest configuration file (e.g., `vitest.config.js`) with the following settings:

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Needed for bundling NodeJSFunction during tests
    // see https://github.com/aws/aws-cdk/issues/20873
    pool: 'forks',
  },
})
```

## Usage

Here's a basic example of how to use Cloud Spec:

```typescript
import { cloudSpec } from '@cloudspec/aws-cdk';
import { Stack, CfnOutput } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { describe, it } from 'vitest';

const cloud = cloudSpec();

describe('S3 Bucket Tests', () => {
  cloud.setup((stack: Stack, setOutputs) => {
    const bucket = new Bucket(stack, 'TestBucket');
    setOutputs({
      bucketName: bucket.bucketName,
    });
  });

  cloud.test('bucket should exist', async (outputs) => {
    const { bucketName } = outputs;
     // Add assertions here to check if the bucket exists
  });
```

and run `vitest`

## API

### `cloudSpec()`

Returns an object with two functions:

- `setup(createResources, timeout?)`: Sets up the CDK stack for testing.
  - `createResources`: A function that creates the CDK resources and sets outputs.
  - `timeout`: Optional timeout for stack deployment (default: 120000ms).

- `test(name, testFn, timeout?)`: Runs a test against the deployed resources.
  - `name`: The name of the test.
  - `testFn`: An async function containing test assertions.
  - `timeout`: Optional timeout for the test (default: 600000ms).

## Contributing

We welcome contributions!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.