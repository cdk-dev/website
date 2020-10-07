import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as appsync from '@aws-cdk/aws-appsync';
import { join } from 'path';

export class AppsynccdkStack extends cdk.Stack {

  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create a new AppSync GraphQL API
     */
    const api = new appsync.GraphqlApi(this, 'Playwright-Api', {
      name: `playwright`,
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: new appsync.Schema({filePath:join('__dirname', '/../', 'schema/schema.graphql')}),
    });
    const apiKey = new appsync.CfnApiKey(this, 'playwright-api-key', {
      apiId: api.apiId
    });

    // defines an AWS Lambda resource
    const playwrightLambda = new lambda.Function(this, 'PlaywrightLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,      // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from the "lambda" directory
      handler: 'playwright.handler',                // file is "loyalty", function is "handler"
    });

    /**
     * Add Loyalty Lambda as a Datasource for the Graphql API.
     */
    const playwrightDS = api.addLambdaDataSource('playwright', playwrightLambda);
    playwrightDS.createResolver({
      typeName: 'Query',
      fieldName: 'getLoyaltyLevel'
    });
    // GraphQL API Endpoint
    this.urlOutput = new cdk.CfnOutput(this, 'Endpoint', {
      value: api.graphqlUrl
    });

    // API Key
    this.urlOutput = new cdk.CfnOutput(this, 'API_Key', {
      value: apiKey.attrApiKey
    });
  }
}
