import { App, Stack, CfnOutput } from 'aws-cdk-lib';
import { AwsCdkCli } from '@aws-cdk/cli-lib-alpha';
import { test, beforeAll } from 'vitest';
import { HotswapMode } from 'aws-cdk/lib/api/hotswap/common';
import { RequireApproval } from 'aws-cdk-lib/cloud-assembly-schema';
import os from 'os';
import path from 'path';

class CdkTestHelper {
  private async deployStack(app: App, stackName: string): Promise<string> {
    const assembly = app.synth();
    const cli = AwsCdkCli.fromCdkAppDirectory(assembly.directory, { app: assembly.directory });
    const outputsFile = path.join(process.cwd(), `${stackName}-outputs.json`);

    try {
      await cli.deploy({
        stacks: ['*'],
        hotswap: HotswapMode.FALL_BACK,
        outputsFile,
        requireApproval: RequireApproval.NEVER,
      });
      return outputsFile;
    } catch (error) {
      console.error('Failed to deploy stack:', error);
      throw error;
    }
  }

  private async getStackOutputs(outputsFile: string, stackName: string): Promise<{ [key: string]: string }> {
    const outputsModule = await import(outputsFile);
    const outputs = outputsModule.default || outputsModule;

    if (!outputs[stackName]) {
      throw new Error(`Stack outputs not found for stack: ${stackName}`);
    }

    return outputs[stackName];
  }

  async setupAndDeploy(app: App, stackName: string): Promise<{ [key: string]: string }> {
    const outputsFile = await this.deployStack(app, stackName);
    return this.getStackOutputs(outputsFile, stackName);
  }
}

export function cloudSpec() {
  let app: App;
  let stack: Stack;
  let outputs: { [key: string]: string } = {};

  const setup = (
    createResources: (stack: Stack, setOutputs: (o: { [key: string]: string }) => void) => void,
    timeout: number = 120000
  ) => {
    beforeAll(async () => {
      app = new App();
      const stackName = `TestProcessLinksStack-${os.userInfo().username}`;
      stack = new Stack(app, stackName);

      createResources(stack, (o) => {
        outputs = o;
        Object.entries(o).forEach(([key, value]) => new CfnOutput(stack, key, { value }));
      });

      outputs = await new CdkTestHelper().setupAndDeploy(app, stackName);
    }, timeout);
  };

  const runTest = (name: string, testFn: (outputs: { [key: string]: string }) => Promise<void>, timeout = 600000) => {
    return test(name, () => testFn(outputs), timeout);
  };

  return { setup, test: runTest };
}
