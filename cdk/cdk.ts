import { App } from "aws-cdk-lib";
import { CdkWebsiteStack } from "./cdk-website-stack";

const app = new App();

new CdkWebsiteStack(app, `website`, {});
