import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const userTableName = 'Author-eda5azc3cvhhxaq4sw2ugaxl4i-NONE';
const postTableName = 'Post-eda5azc3cvhhxaq4sw2ugaxl4i-NONE';
const resourceTableName = 'Resource-eda5azc3cvhhxaq4sw2ugaxl4i-NONE';
const bucketName = 'amplify-d2vgttdm5hfz44-ne-cdkdevassetsbucket47959b-tuwm0thqxjww';

interface User {
  name: string;
  avatar: string;
  twitter?: string;
  createdAt: string;
}

interface Post {
  title: string;
  excerpt: string;
  authorIds: string[];
  url: string;
  createdAt: string;
  categories: string[];
  banner?: string;
}

interface Resource {
  title: string;
  teaser: string;
  url: string;
  createdAt: string;
  categories: string[];
  banner?: string;
}

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const usersDir = path.join(process.cwd(), '../frontend/content/users');
const postsDir = path.join(process.cwd(), '../frontend/content/posts');
const resourcesDir = path.join(process.cwd(), '../frontend/content/resources');

console.log(`Users directory: ${usersDir}`);
console.log(`Posts directory: ${postsDir}`);
console.log(`Resources directory: ${resourcesDir}`);

// Ensure directories exist
if (!fs.existsSync(usersDir)) {
  console.error(`Users directory does not exist: ${usersDir}`);
  process.exit(1);
}

if (!fs.existsSync(postsDir)) {
  console.error(`Posts directory does not exist: ${postsDir}`);
  process.exit(1);
}

if (!fs.existsSync(resourcesDir)) {
  console.error(`Resources directory does not exist: ${resourcesDir}`);
  process.exit(1);
}

const loadYaml = (filePath: string) => yaml.load(fs.readFileSync(filePath, 'utf8'));

const s3Client = new S3Client({});

const uploadAvatarToS3 = async (username: string, avatarPath: string) => {
  const fileContent = fs.readFileSync(avatarPath);
  const key = `content/avatars/${username}/${path.basename(avatarPath)}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg' // Adjust based on your image type
  }));
  return key;
};

const uploadBannerToS3 = async (folderName: string, bannerPath: string) => {
  const fileContent = fs.readFileSync(bannerPath);
  const key = `content/banners/${folderName}/${path.basename(bannerPath)}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: 'image/png' // Adjust based on your image type
  }));
  return key;
};

const importData = async () => {
  const isFile = (filePath: string) => fs.statSync(filePath).isFile();
  const hasCorrectExtension = (filePath: string) => ['.yaml', '.yml'].includes(path.extname(filePath));

  const users: { folderName: string, data: User }[] = fs.readdirSync(usersDir)
    .map(dir => ({ folderName: dir, filePath: path.join(usersDir, dir, 'index.yml') }))
    .filter(({ filePath }) => isFile(filePath) && hasCorrectExtension(filePath))
    .map(({ folderName, filePath }) => {
      console.log(`Processing user file: ${filePath}`);
      return { folderName, data: loadYaml(filePath) as User };
    })
    .sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime());

  const userMap = new Map(users.map(({ folderName, data }) => [folderName, data]));

  const posts: { folderName: string, data: Post }[] = fs.readdirSync(postsDir)
    .map(dir => ({ folderName: dir, filePath: path.join(postsDir, dir, 'index.yml') }))
    .filter(({ filePath }) => isFile(filePath) && hasCorrectExtension(filePath))
    .map(({ folderName, filePath }) => {
      console.log(`Processing post file: ${filePath}`);
      return { folderName, data: loadYaml(filePath) as Post };
    })
    .sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime());

  const resources: { folderName: string, data: Resource }[] = fs.readdirSync(resourcesDir)
    .map(dir => ({ folderName: dir, filePath: path.join(resourcesDir, dir, 'index.yml') }))
    .filter(({ filePath }) => isFile(filePath) && hasCorrectExtension(filePath))
    .map(({ folderName, filePath }) => {
      console.log(`Processing resource file: ${filePath}`);
      return { folderName, data: loadYaml(filePath) as Resource };
    })
    .sort((a, b) => new Date(a.data.createdAt).getTime() - new Date(b.data.createdAt).getTime());

  const authorMap = new Map();
  const postItems = [];
  const resourceItems = [];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (const { folderName: postFolderName, data: post } of posts) {
    const authorFolderName = post.authorIds[0];
    const author = userMap.get(authorFolderName);
    if (author) {
      let authorId = authorMap.get(authorFolderName)?.id;
      if (!authorId) {
        await delay(10); // Ensure at least 10ms delay between ULID generations
        authorId = ulid(new Date(author.createdAt).getTime());
        const avatarKey = await uploadAvatarToS3(authorFolderName, path.join(usersDir, authorFolderName, author.avatar));
        authorMap.set(authorFolderName, {
          id: authorId,
          name: author.name,
          twitter: author.twitter,
          createdAt: new Date(author.createdAt).toISOString(),
          updatedAt: new Date().toISOString(),
          ownerId: 1,
          avatar: avatarKey // Save the S3 key
        });
      }

      await delay(10); // Ensure at least 10ms delay between ULID generations
      const postId = ulid(new Date(post.createdAt).getTime());
      let bannerKey = null;
      if (post.banner) {
        const bannerPath = path.join(postsDir, postFolderName, post.banner);
        if (fs.existsSync(bannerPath)) {
          bannerKey = await uploadBannerToS3(postFolderName, bannerPath);
        }
      }
      postItems.push({
        PutRequest: {
          Item: {
            id: postId, // Unique ID for the post
            title: post.title,
            content: post.excerpt,
            categories: post.categories,
            authorId: authorId, // Use the ID from the author map
            createdAt: new Date(post.createdAt).toISOString(), // Use createdAt from the post YAML
            url: post.url, // Use url from the post YAML
            updatedAt: new Date().toISOString(),
            ownerId: 1,
            banner: bannerKey // Save the S3 key for the banner
          }
        }
      });
    }
  }

  for (const { folderName, data: resource } of resources) {
    await delay(10); // Ensure at least 10ms delay between ULID generations
    const resourceId = ulid(new Date(resource.createdAt).getTime());
    let bannerKey = null;
    if (resource.banner) {
      const bannerPath = path.join(resourcesDir, folderName, resource.banner);
      if (fs.existsSync(bannerPath)) {
        bannerKey = await uploadBannerToS3(folderName, bannerPath);
      }
    }
    resourceItems.push({
      PutRequest: {
        Item: {
          id: resourceId, // Unique ID for the resource
          title: resource.title,
          content: resource.teaser,
          url: resource.url,
          createdAt: new Date(resource.createdAt).toISOString(), // Use createdAt from the resource YAML
          categories: resource.categories,
          updatedAt: new Date().toISOString(),
          ownerId: 1,
          banner: bannerKey // Save the S3 key for the banner
        }
      }
    });
  }

  const authorItems = Array.from(authorMap.values()).map(author => ({
    PutRequest: {
      Item: author
    }
  }));

  // Batch write function
  const batchWriteItems = async (tableName: string, items: any[]) => {
    const BATCH_SIZE = 25;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      console.log(`Writing batch to ${tableName} with ${batch.length} items`);
      const result = await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch
        }
      }));
    }
  };

  // Batch write authors, posts, and resources separately
  await batchWriteItems(userTableName, authorItems);
  await batchWriteItems(postTableName, postItems);
  await batchWriteItems(resourceTableName, resourceItems);
};

importData().catch(console.error);
