#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppsynccdkStack } from '../lib/appsynccdk-stack';

const app = new cdk.App();
new AppsynccdkStack(app, 'AppsynccdkStack', {
    env: { account: '329315029403', region: 'us-east-1' },
});
app.synth();
