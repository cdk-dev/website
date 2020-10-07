import { Lambda } from 'aws-sdk';
import { scrape } from 'link-scraper';

exports.handler = async function (event: any) {
    console.log("get loyalty request:", JSON.stringify(event, undefined, 2));

    const result  = await scrape("https://softwhat.com/cdk-chalice-adds-support-for-accessing-chalice-generated-cloudformation-resources/")
    let loyaltylevel = JSON.stringify(result, null, 2)

    // return response back to upstream caller
    return sendRes(200, loyaltylevel);
};

const sendRes = (status: number, loyaltylevel: string) => {
    var response = {
        statusCode: status,
        headers: {
            "Content-Type": "application/json"
        },
        level: loyaltylevel
    };
    return response;
};