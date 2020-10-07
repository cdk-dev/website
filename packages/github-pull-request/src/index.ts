import { Octokit } from "@octokit/core";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { App } from "@octokit/app";
import * as OctokitRest from "@octokit/rest";
import * as fs from 'fs';
import * as path from 'path';

const MyOctokit = Octokit.plugin(createPullRequest);

const id = process.env.GITHUB_APP_APP_ID as unknown as number;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY as string;

(async () => {
  // Setup Github App for scoped authentication to the cdk-dev organisation.
  // Intentionally not using a personal access token
  const app = new App({ id, privateKey });
  const appOctokit = new OctokitRest.Octokit({
    auth: app.getSignedJsonWebToken(),
  });
  const {
    data: { id: installationId },
  } = await appOctokit.apps.getRepoInstallation({
    owner: 'cdk-dev',
    repo: 'website'
  });

  const token = await app.getInstallationAccessToken({
    installationId,
  });

  const octokit = new MyOctokit({
    auth: token
  });

  const pullRequest = await octokit.createPullRequest({
    owner: "cdk-dev",
    repo: "website",
    title: "Testing Automated Pull Requests",
    body: "pull request description",
    head: "pull-request-branch-name",
    changes: [
      {
        files: {
          "frontend/content/posts/testing/index.yml": "Some yml",
          "frontend/content/posts/testing/images/file2.png": {
            content: fs.readFileSync(path.join(__dirname, '..', 'test.png'), 'base64').toString(),
            encoding: 'base64'
          },
        },
        commit: "Creating an automated pull request",
      },
    ],
  })
  console.log({foo: JSON.stringify(pullRequest)})
})();
