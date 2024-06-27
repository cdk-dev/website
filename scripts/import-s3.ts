import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

const s3 = new S3Client({ region: 'us-east-1' });
const bucketName = 'amplify-website-sebastian-cdkdevassetsbucket47959b-eqydsgw72tlz';
const localDir = './seed/files/';

async function uploadFile(bucket: string, filePath: string, key: string) {
    const fileStream = fs.createReadStream(filePath);
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(params));
    console.log(`Uploaded ${filePath} to s3://${bucket}/${key}`);
}

async function importFiles() {
    const files = fs.readdirSync(localDir, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(localDir, file.name);
        if (file.isDirectory()) {
            // Recursively upload files in subdirectories
            await importFilesFromDirectory(bucketName, filePath, file.name);
        } else {
            await uploadFile(bucketName, filePath, file.name);
        }
    }
}

async function importFilesFromDirectory(bucket: string, dirPath: string, prefix: string) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        const key = path.join(prefix, file.name);
        if (file.isDirectory()) {
            await importFilesFromDirectory(bucket, filePath, key);
        } else {
            await uploadFile(bucket, filePath, key);
        }
    }
}

importFiles().catch(error => {
    console.error('Error importing files:', error);
});
