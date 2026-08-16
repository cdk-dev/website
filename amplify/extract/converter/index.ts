import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import TurndownService from "turndown";
import { Readable } from "stream";
import { Handler } from "aws-lambda";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const turndownService = new TurndownService();

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

export const handler: Handler = async (event: { id: string }) => {
  const id = event.id;
  const bucketName = process.env.BUCKET_NAME;

  try {
    // Get HTML file from S3
    const getObjectParams = {
      Bucket: bucketName,
      Key: `${id}.html`,
    };
    const data = await s3.send(new GetObjectCommand(getObjectParams));
    const htmlContent = await streamToString(data.Body as Readable);

    // Convert HTML to Markdown
    const markdownContent = turndownService.turndown(htmlContent);

    // Save Markdown to S3
    const putObjectParams = {
      Bucket: bucketName,
      Key: `${id}.md`,
      Body: markdownContent,
      ContentType: "text/markdown",
    };
    await s3.send(new PutObjectCommand(putObjectParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Markdown file saved to S3", id: id }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred", id: id }),
    };
  }
};
