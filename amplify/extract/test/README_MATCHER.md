# CloudSpec AWS Matcher Library

CloudSpec AWS Matcher is a custom assertion library for testing AWS resources in your Vitest test suites. It provides matchers for S3 objects and Step Functions executions.

## Features

- `toExistInS3()`: Check if an object exists in an S3 bucket
- `toMatchS3Snapshot()`: Compare S3 object content with snapshots
- `toCompleteStepFunctionsExecution()`: Start and monitor Step Functions executions

## Installation

```bash
npm install @cloudspec/aws-matcher
```

## Usage

```typescript
import { expect, test } from 'vitest';
import '@cloudspec/aws-matcher';

test('S3 object exists', async () => {
  await expect({ bucketName: 'my-bucket', key: 'my-object' }).toExistInS3();
});

test('S3 object matches snapshot', async () => {
  await expect({ bucketName: 'my-bucket', key: 'my-object' }).toMatchS3Snapshot();
});

test('Step Functions execution completes', async () => {
  await expect('arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine')
  .toCompleteStepFunctionsExecution({ input: 'data' }, 30000);
});
```

## Configuration

Set the `AWS_REGION` environment variable or default to 'us-east-1'.

## License

MIT