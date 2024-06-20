import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { createReadStream } from "fs";
import path from "path";
import csvParser from "csv-parser";

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

const commonTableSuffix = "-2monpdhj5rhoniw6xekv6xdnou-NONE";
const maxBatchSize = 25;

async function importCSVToTable(tableName: string) {
    const filePath = path.join(__dirname, `../seed/${tableName.toLowerCase()}.csv`);

    try {
        const items: any[] = [];

        // Read and parse CSV file
        await new Promise((resolve, reject) => {
            createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (data) => items.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        // Convert CSV items to DynamoDB format
        const dynamoDBItems = items.map(item => {
            const dynamoDBItem: { [key: string]: any } = {};
            for (const key in item) {
                dynamoDBItem[key] = { S: item[key] }; // Assuming all values are strings for simplicity
            }
            return { PutRequest: { Item: dynamoDBItem } };
        });

        // Split items into batches of 25
        for (let i = 0; i < dynamoDBItems.length; i += maxBatchSize) {
            const batch = dynamoDBItems.slice(i, i + maxBatchSize);
            const params = {
                RequestItems: {
                    [`${tableName}${commonTableSuffix}`]: batch
                }
            };

            await client.send(new BatchWriteItemCommand(params));
        }

        console.log(`Data from ${filePath} has been imported to table ${tableName}${commonTableSuffix}`);
    } catch (error) {
        console.error(`Error importing data to table ${tableName}${commonTableSuffix}:`, error);
    }
}

// Example usage
const tables = [
    "Author",
    "LinkSuggestion",
    "Post",
    "Resource"
];
tables.forEach(table => importCSVToTable(table));
