import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { AppsynccdkStack } from './appsynccdk-stack';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
    public readonly urlOutput: CfnOutput;

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const service = new AppsynccdkStack(this, 'AppSyncService');

        this.urlOutput = service.urlOutput;
    }
}