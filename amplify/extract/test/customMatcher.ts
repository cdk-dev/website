import { expect } from 'vitest';
import { S3Client, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { SFNClient, StartExecutionCommand, DescribeExecutionCommand } from "@aws-sdk/client-sfn";
import * as diff from 'diff';

// Update the type declaration
declare module 'vitest' {
  interface AsymmetricMatchersContaining {
    toExistInS3(): any;
    toMatchS3Snapshot(): any;
    toCompleteStepFunctionsExecution(payload: any, timeout?: number): any;
  }
  interface Assertion<T = any> {
    toExistInS3(): Promise<void>;
    toMatchS3Snapshot(): Promise<void>;
    toCompleteStepFunctionsExecution(payload: any, timeout?: number): Promise<void>;
  }
}

const region = process.env.AWS_REGION || 'us-east-1';
const sfnClient = new SFNClient({ region });
const s3Client = new S3Client({ region });

function getStepFunctionsConsoleUrl(executionArn: string): string {
  try {
    const [, , , region] = executionArn.split(':');
    const baseUrl = `https://${region}.console.aws.amazon.com/states/home`;
    const params = new URLSearchParams({ region });
    return `${baseUrl}?${params.toString()}#/v2/executions/details/${executionArn}`;
  } catch (error) {
    console.error('Error parsing execution ARN:', executionArn, error);
    return 'Unable to generate Step Functions console URL';
  }
}

function createColorfulDiff(actual: string, expected: string): string {
  const differences = diff.diffLines(expected, actual);
  let colorfulDiff = '';

  differences.forEach((part) => {
    // Green for additions, red for deletions
    // If the value is unchanged, it will be grey
    const color = part.added ? '\x1b[32m' : part.removed ? '\x1b[31m' : '\x1b[90m';
    const prefix = part.added ? '+' : part.removed ? '-' : ' ';
    const lines = part.value.split('\n').filter(line => line.trim() !== '');
    lines.forEach(line => {
      colorfulDiff += `${color}${prefix} ${line}\x1b[0m\n`;
    });
  });

  return colorfulDiff;
}

// Custom matchers
const customMatchers = {
  async toExistInS3(received: { bucketName: string, key: string }) {
    const headCommand = new HeadObjectCommand({ Bucket: received.bucketName, Key: received.key });
    try {
      await s3Client.send(headCommand);
      return {
        message: () => `expected ${received.key} to exist in S3 bucket ${received.bucketName}`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received.key} to exist in S3 bucket ${received.bucketName}`,
        pass: false,
      };
    }
  },

  async toMatchS3Snapshot(received: { bucketName: string, key: string }) {
    const getCommand = new GetObjectCommand({ Bucket: received.bucketName, Key: received.key });
    try {
      const response = await s3Client.send(getCommand);
      const content = await response.Body?.transformToString();

      if (content === undefined) {
        return {
          message: () => `failed to retrieve content from ${received.key} in S3 bucket ${received.bucketName}`,
          pass: false,
        };
      }

      // Use Vitest's expect().toMatchSnapshot() for comparison
      try {
        expect(content).toMatchSnapshot();
        return {
          message: () => `expected ${received.key} content to match snapshot in S3 bucket ${received.bucketName}`,
          pass: true,
        };
      } catch (error: any) {
        // Extract the diff from the error message
        const actualContent = error.actual;
        const expectedContent = error.expected;

        // Create a colorful diff
        const colorfulDiff = createColorfulDiff(actualContent, expectedContent);

        return {
          message: () =>
            `Snapshot for ${received.key} in S3 bucket ${received.bucketName} did not match.\n\nDiff:\n${colorfulDiff}`,
          pass: false,
        };
      }
    } catch (error) {
      return {
        message: () => `failed to retrieve ${received.key} from S3 bucket ${received.bucketName}: ${error}`,
        pass: false,
      };
    }
  },

  async toCompleteStepFunctionsExecution(stateMachineArn: string, payload: any, timeout: number = 60000) {
    const startTime = Date.now();

    // Start the execution
    const startCommand = new StartExecutionCommand({
      stateMachineArn: stateMachineArn,
      input: JSON.stringify(payload)
    });

    let executionArn: string;
    try {
      const startResponse = await sfnClient.send(startCommand);
      executionArn = startResponse.executionArn!;
    } catch (error) {
      return {
        message: () => `Failed to start Step Functions execution: ${error}`,
        pass: false,
      };
    }

    console.log(`Step Functions execution URL: ${getStepFunctionsConsoleUrl(executionArn)}`);

    while (true) {
      const { status } = await sfnClient.send(new DescribeExecutionCommand({ executionArn }));

      if (status === 'SUCCEEDED') {
        return {
          message: () => `Step Functions execution completed successfully`,
          pass: true,
        };
      }

      if (['FAILED', 'TIMED_OUT', 'ABORTED'].includes(status!)) {
        return {
          message: () => `Step Functions execution failed with status: ${status}. View details at the URL printed above.`,
          pass: false,
        };
      }

      if (Date.now() - startTime > timeout) {
        return {
          message: () => `Step Functions execution timed out after ${timeout}ms. Current status: ${status}. View details at the URL printed above.`,
          pass: false,
        };
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  },
};

// Custom assertions
expect.extend(customMatchers);

export { customMatchers };
