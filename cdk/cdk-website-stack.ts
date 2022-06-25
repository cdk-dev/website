import { execSync, ExecSyncOptions } from "child_process";
import { StackProps, Stack, RemovalPolicy, DockerImage } from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { OriginAccessIdentity, Distribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { Runtime, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { HostedZone, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import { Source, BucketDeployment } from "aws-cdk-lib/aws-s3-deployment";
import { PhysicalResourceId, AwsCustomResource, AwsCustomResourcePolicy } from "aws-cdk-lib/custom-resources";
import { copySync } from "fs-extra";
import { Construct } from "constructs";

export interface CdkWebsiteStackProps extends StackProps {
    domainName?: string;
    slackParamName?: string;
}

export class CdkWebsiteStack extends Stack {
    constructor(scope: Construct, id: string, props: CdkWebsiteStackProps) {
        super(scope, id, props);

        const { domainName = "cdk.dev", slackParamName } = props;

        const destinationBucket = new Bucket(this, `Bucket`, {
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
          });
      
          const originAccessIdentity = new OriginAccessIdentity(
            this,
            `AccessIdentity`
          );
          destinationBucket.grantRead(originAccessIdentity);
      
          const hostedZone = HostedZone.fromLookup(this, `Zone`, {
            domainName,
          });
          const certificate = new DnsValidatedCertificate(this, `WebsiteCert`, {
            domainName,
            hostedZone,
          });
      
          const distribution = new Distribution(this, `Distribution`, {
            defaultBehavior: {
              origin: new S3Origin(destinationBucket, { originAccessIdentity }),
              viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            defaultRootObject: "index.html",
            certificate,
            domainNames: [domainName],
            errorResponses: [
              {
                httpStatus: 404,
                responseHttpStatus: 200,
                responsePagePath: "/index.html",
              },
            ],
          });
      
          new ARecord(this, `ARecord`, {
            zone: hostedZone,
            recordName: domainName,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
          });
      
          const execOptions: ExecSyncOptions = {
            stdio: ["ignore", process.stderr, "inherit"],
          };
      
          const bundle = Source.asset(`${__dirname}/../frontend/out`, {
            bundling: {
              command: [
                "sh",
                "-c",
                'echo "Docker build not supported. Please install esbuild."',
              ],
              image: DockerImage.fromRegistry("alpine"),
              local: {
                tryBundle(outputDir: string) {
                  try {
                    execSync("esbuild --version", execOptions);
                  } catch {
                    /* istanbul ignore next */
                    return false;
                  }
                  execSync(`cd frontend && NODE_OPTIONS=--openssl-legacy-provider yarn build && NODE_OPTIONS=--openssl-legacy-provider yarn export`, execOptions);
                  copySync(`${__dirname}/../frontend/out`, outputDir, {
                    ...execOptions,
                    recursive: true,
                  });
                  return true;
                },
              },
            },
          });
      
          new BucketDeployment(this, `DeployWebsite`, {
            destinationBucket,
            distribution,
            sources: [bundle],
          });

          const slackJoinFn = new NodejsFunction(this, `SlackJoinFn`, {
            logRetention: RetentionDays.ONE_DAY,
            runtime: Runtime.NODEJS_16_X,
            ...(slackParamName ? {
                initialPolicy: [new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['ssm:GetParameter', 'ssm:GetParameters'],
                    resources: [
                        `arn:aws:ssm:*:*:parameter/${slackParamName}`,
                    ],
                })],
                environment: {
                    SLACK_PARAM_NAME: slackParamName,
                }
            } : {}),
          });
          const fnUrl = slackJoinFn.addFunctionUrl({authType: FunctionUrlAuthType.NONE})
      
          // Creates the `config.json` file necessary for the UI app to find the functionUrl
          // This resource only updates if its inputs change.
          const resProps = {
            action: "putObject",
            parameters: {
              Body: Stack.of(scope).toJsonString({
                apiUrl: fnUrl,
              }),
              Bucket: destinationBucket.bucketName,
              CacheControl: "max-age=0, no-cache, no-store, must-revalidate",
              ContentType: "application/json",
              Key: "config.json",
            },
            physicalResourceId: PhysicalResourceId.of("config"),
            service: "S3",
          };
          new AwsCustomResource(this, `ConfigResource`, {
            onCreate: resProps,
            onUpdate: resProps,
            policy: AwsCustomResourcePolicy.fromStatements([
              new PolicyStatement({
                actions: ["s3:PutObject"],
                resources: [destinationBucket.arnForObjects("config.json")],
              }),
            ]),
          });
    }
}