import { aws_s3 as s3 } from 'aws-cdk-lib';
import { ExtractContentStateMachine } from '../sfn';
import { SfnSummarize } from '../sfn-summarize';
import { expect, describe } from 'vitest';
import { cloudSpec } from '@cloudspec/aws-cdk';


import '@cloudspec/aws-matcher';


describe.skip('ProcessLinks Integration Test', () => {
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

    await expect(stateMachineArn).toCompleteStepFunctionsExecution({
      input: [{
        dynamodb: {
          NewImage: {
            id: { S: testId },
            url: { S: "https://example.com" },
            comment: { S: "Test comment" }
          }
        }
      }],
      timeout: 60_000,
    });

    await expect(bucketName).toHaveKey({ key: `${testId}.html` });
    await expect(bucketName).toHaveKey({ key: `${testId}_viewport.png` });
    await expect(bucketName).toHaveKey({ key: `${testId}_fullpage.png` });
    await expect(bucketName).toHaveKey({ key: `${testId}.md` });

    // Snapshot test for the markdown file
    await expect(bucketName).toMatchS3ObjectSnapshot({ key: `${testId}.md` })
  });
});

describe('SfnSummarize Integration Test', () => {
  const cloud = cloudSpec();

  cloud.setup((stack, setOutputs) => {
    const bucket = new s3.Bucket(stack, 'SummaryTestBucket');
    const summarize = new SfnSummarize(stack, 'SummarizeStateMachine', { bucket });

    setOutputs({
      bucketName: bucket.bucketName,
      stateMachineArn: summarize.stateMachineArn,
    });
  }, 120_000);

  cloud.test('should generate summary for markdown file', async (stackOutputs) => {
    const { bucketName, stateMachineArn } = stackOutputs;

    const testId = `summary-test-${Date.now()}`;
    const testContent = `# Test Content\n\nThis is a test markdown file for summarization.`;

    // Upload test content to S3
    await expect(bucketName).toCreateObject({ key: `${testId}.md`, body: testContent });

    // Check the execution result
    await expect(stateMachineArn).toCompleteStepFunctionsExecution({
      input: {
        id: testId,
        key: `${testId}.md`,
      },
      result: {
        result: expect.any(String),
      },
      timeout: 60_000,
    });
  });
});
