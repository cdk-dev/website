import { SFNClient, StartExecutionCommand, DescribeExecutionCommand } from "@aws-sdk/client-sfn";

async function startStateMachine() {
  const client = new SFNClient({ region: "us-east-1" });

  const payload = [
    {
      dynamodb: {
        NewImage: {
          id: { S: "test-id-1" },
          url: { S: "https://example.com" },
          comment: { S: "Test comment" }
        }
      }
    },
    // Add more items if needed
  ];

  const command = new StartExecutionCommand({
    stateMachineArn: "arn:aws:states:us-east-1:951516604408:stateMachine:ProcessLinksExtractContentStateMachineA2E8D5E9-iTeT4cfszy0X",
    input: JSON.stringify(payload)
  });

  try {
    const response = await client.send(command);
    if (!response.executionArn) {
      throw new Error("Execution ARN is undefined");
    }
    console.log("Execution started:", response.executionArn);
    
    // Wait for execution to finish
    await waitForExecution(client, response.executionArn);
    console.log("Execution completed");
  } catch (error) {
    console.error("Error starting or monitoring execution:", error);
  }
}

async function waitForExecution(client: SFNClient, executionArn: string) {
  while (true) {
    const describeCommand = new DescribeExecutionCommand({ executionArn });
    const executionStatus = await client.send(describeCommand);
    
    if (executionStatus.status === 'SUCCEEDED') {
      return;
    } else if (executionStatus.status === 'FAILED' || executionStatus.status === 'TIMED_OUT' || executionStatus.status === 'ABORTED') {
      throw new Error(`Execution failed with status: ${executionStatus.status}`);
    }
    
    // Wait for 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

startStateMachine();
