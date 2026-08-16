import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Readable } from 'stream';

const s3Client = new S3Client({});
const bedrockClient = new BedrockRuntimeClient({});

async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export const handler = async (event: { id: string; key: string }) => {
  try {
    // Read the content from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: event.key,
    });
    const { Body } = await s3Client.send(getObjectCommand);

    if (!Body) {
      throw new Error('Failed to read object from S3');
    }

    const content = await streamToString(Body as Readable);

    // Generate summary using Bedrock
    const response = await bedrockClient.send(new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Please summarize the following text in a concise manner:\n\n${content}\n\nSummary:`
          }
        ],
        temperature: 0.7,
        top_p: 1,
      }),
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log('responseBody', responseBody);
    const summary = responseBody.content[0].text;

    return { Payload: { summary } };
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
