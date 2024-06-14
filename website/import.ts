import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';

const userTableName = 'Author-solb3gvnrfc73d74revv2a7cfm-NONE';
const postTableName = 'Post-solb3gvnrfc73d74revv2a7cfm-NONE';

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
}

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const usersDir = path.join(process.cwd(), '../frontend/content/users');
const postsDir = path.join(process.cwd(), '../frontend/content/posts');

console.log(`Users directory: ${usersDir}`);
console.log(`Posts directory: ${postsDir}`);

// Ensure directories exist
if (!fs.existsSync(usersDir)) {
  console.error(`Users directory does not exist: ${usersDir}`);
  process.exit(1);
}

if (!fs.existsSync(postsDir)) {
  console.error(`Posts directory does not exist: ${postsDir}`);
  process.exit(1);
}

const loadYaml = (filePath: string) => yaml.load(fs.readFileSync(filePath, 'utf8'));

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

  const posts: Post[] = fs.readdirSync(postsDir)
    .map(dir => path.join(postsDir, dir, 'index.yml'))
    .filter(file => isFile(file) && hasCorrectExtension(file))
    .map(file => {
      console.log(`Processing post file: ${file}`);
      return loadYaml(file) as Post;
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const authorMap = new Map();
  const postItems = [];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (const post of posts) {
    const authorFolderName = post.authorIds[0];
    const author = userMap.get(authorFolderName);
    if (author) {
      let authorId = authorMap.get(authorFolderName)?.id;
      if (!authorId) {
        await delay(10); // Ensure at least 10ms delay between ULID generations
        authorId = ulid(new Date(author.createdAt).getTime());
        authorMap.set(authorFolderName, {
          id: authorId,
          name: author.name,
          twitter: author.twitter,
          createdAt: new Date(author.createdAt).toISOString(),
          updatedAt: new Date().toISOString(),
          ownerId: 1
        });
      }

      await delay(10); // Ensure at least 10ms delay between ULID generations
      const postId = ulid(new Date(post.createdAt).getTime());
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
            ownerId: 1
          }
        }
      });
    }
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
      await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch
        }
      }));
    }
  };

  // Batch write authors and posts separately
  await batchWriteItems(userTableName, authorItems);
  await batchWriteItems(postTableName, postItems);
};

importData().catch(console.error);
