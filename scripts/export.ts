import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { parse } from "json2csv";
import path from "path";

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

async function exportTableToCSV(tableName: string) {
    const params = {
        TableName: tableName,
    };

    try {
        const data = await client.send(new ScanCommand(params));
        const items = data.Items;

        if (!items) {
            console.log(`No items found in table ${tableName}`);
            return;
        }

        // Convert DynamoDB items to JSON
        const jsonItems = items.map(item => {
            const jsonItem: { [key: string]: any } = {};
            for (const key in item) {
                if (item[key].S !== undefined) {
                    jsonItem[key] = item[key].S;
                } else if (item[key].N !== undefined) {
                    jsonItem[key] = item[key].N;
                } else if (item[key].BOOL !== undefined) {
                    jsonItem[key] = item[key].BOOL;
                } else if (item[key].NULL !== undefined) {
                    jsonItem[key] = null;
                } else if (item[key].L !== undefined) {
                    jsonItem[key] = item[key].L;
                } else if (item[key].M !== undefined) {
                    jsonItem[key] = item[key].M;
                }
            }
            return jsonItem;
        });

        // Convert JSON to CSV
        const csv = parse(jsonItems);

        // Ensure the directory exists
        const dirPath = path.join(__dirname, '../seed');
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
        }

        // Write CSV to file
        const filePath = path.join(dirPath, `${tableName}.csv`);
        writeFileSync(filePath, csv);

        console.log(`Data from table ${tableName} has been exported to ${filePath}`);
    } catch (error) {
        console.error(`Error exporting table ${tableName}:`, error);
    }
}

// Example usage
const tables = [
    "Author-ehgccjjh6zcajh5tfztuc3wri4-NONE",
    "LinkSuggestion-ehgccjjh6zcajh5tfztuc3wri4-NONE",
    "Post-ehgccjjh6zcajh5tfztuc3wri4-NONE",
    "Resource-ehgccjjh6zcajh5tfztuc3wri4-NONE"
];
tables.forEach(table => exportTableToCSV(table));