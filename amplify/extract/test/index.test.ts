import { aws_s3 as s3 } from 'aws-cdk-lib';
import { ExtractContentStateMachine } from '../sfn';
import { expect, describe } from 'vitest';
import { cloudSpec } from './cloudspec';
import './customMatcher';

describe('ProcessLinks Integration Test', () => {
  const cloud = cloudSpec();

  cloud.setup((stack, setOutputs) => {
    const bucket = new s3.Bucket(stack, 'TestBucket');
    const stateMachine = new ExtractContentStateMachine(stack, 'ExtractContentStateMachine', bucket);

    setOutputs({
      bucketName: bucket.bucketName,
      stateMachineArn: stateMachine.stateMachineArn,
    });
  }, 120_000);

  cloud.test('should create required files in S3', async (stackOutputs) => {
    const { bucketName, stateMachineArn } = stackOutputs;

    const testId = `test-id-${Date.now()}`;

    await expect(stateMachineArn).toCompleteStepFunctionsExecution([{
      dynamodb: {
        NewImage: {
          id: { S: testId },
          url: { S: "https://example.com" },
          comment: { S: "Test comment" }
        }
      }
    }], 60_000);

    await expect({ bucketName, key: `${testId}.html` }).toExistInS3();
    await expect({ bucketName, key: `${testId}_viewport.png` }).toExistInS3();
    await expect({ bucketName, key: `${testId}_fullpage.png` }).toExistInS3();
    await expect({ bucketName, key: `${testId}.md` }).toExistInS3();

    // Snapshot test for the markdown file
    await expect({ bucketName, key: `${testId}.md` }).toMatchS3Snapshot();
  });
});
