import { S3Client, ListObjectsV2Command, GetObjectCommand, ListObjectsV2CommandInput, GetObjectCommandInput } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const s3 = new S3Client({ region: 'us-east-1' });
const bucketName = 'amplify-d1wb534is2xnbe-ma-cdkdevassetsbucket47959b-lejpesdqpyby';
const localDir = './seed/files/';
const streamPipeline = promisify(pipeline);

async function listAllObjects(bucket: string) {
    let isTruncated = true;
    let continuationToken: string | undefined;
    const allObjects = [];

    while (isTruncated) {
        const params: ListObjectsV2CommandInput = {
            Bucket: bucket,
            ContinuationToken: continuationToken,
        };
        const data = await s3.send(new ListObjectsV2Command(params));
        allObjects.push(...(data.Contents || []));
        isTruncated = data.IsTruncated || false;
        continuationToken = data.NextContinuationToken;
    }

    return allObjects;
}

async function downloadFile(bucket: string, key: string, downloadPath: string) {
    const params: GetObjectCommandInput = {
        Bucket: bucket,
        Key: key,
    };
    const data = await s3.send(new GetObjectCommand(params));
    await streamPipeline(data.Body as NodeJS.ReadableStream, fs.createWriteStream(downloadPath));
}

async function exportFiles() {
    if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
    }

    const objects = await listAllObjects(bucketName);
    for (const obj of objects) {
        if (obj.Key) {
            const filePath = path.join(localDir, obj.Key);
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            await downloadFile(bucketName, obj.Key, filePath);
            console.log(`Downloaded ${obj.Key} to ${filePath}`);
        }
    }
}

exportFiles().catch(error => {
    console.error('Error exporting files:', error);
});
