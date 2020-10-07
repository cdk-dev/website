#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkpipelinesPipelineStack } from '../lib/pipeline-def';

const app = new cdk.App();
new CdkpipelinesPipelineStack(app, 'AppsynccdkStack', {
    env: { account: '754950554578', region: 'eu-west-1' },
});
app.synth();
