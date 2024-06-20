import { DynamoDBClient, ScanCommand, BatchWriteItemCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const commonTableSuffix = "-2monpdhj5rhoniw6xekv6xdnou-NONE";
const maxBatchSize = 25;

async function deleteAllRecordsFromTable(tableName: string) {
    const fullTableName = `${tableName}${commonTableSuffix}`;

    try {
        let lastEvaluatedKey: Record<string, any> | undefined = undefined;
        do {
            // Scan the table to get all items
            const scanParams: ScanCommandInput = {
                TableName: fullTableName,
                ExclusiveStartKey: lastEvaluatedKey
            };
            const scanResult = await client.send(new ScanCommand(scanParams));
            const items = scanResult.Items;

            if (items && items.length > 0) {
                // Convert items to delete requests
                const deleteRequests = items.map(item => {
                    // Extract the primary key attributes from the item
                    const key: Record<string, any> = {};
                    // Assuming the primary key attributes are 'id' and 'sortKey'
                    key['id'] = item['id'];
                    if (item['sortKey']) {
                        key['sortKey'] = item['sortKey'];
                    }
                    return {
                        DeleteRequest: {
                            Key: key
                        }
                    };
                });

                // Split delete requests into batches of 25
                for (let i = 0; i < deleteRequests.length; i += maxBatchSize) {
                    const batch = deleteRequests.slice(i, i + maxBatchSize);
                    const batchParams = {
                        RequestItems: {
                            [fullTableName]: batch
                        }
                    };

                    await client.send(new BatchWriteItemCommand(batchParams));
                }
            }

            lastEvaluatedKey = scanResult.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        console.log(`All records from table ${fullTableName} have been deleted.`);
    } catch (error) {
        console.error(`Error deleting records from table ${fullTableName}:`, error);
    }
}

// Example usage
const tables = [
    "Author",
    "LinkSuggestion",
    "Post",
    "Resource"
];
tables.forEach(table => deleteAllRecordsFromTable(table));
