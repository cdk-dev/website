import { SSM } from "aws-sdk";

export const handler = async () => {
  // this lambda will make the slack api call using the parameter store secure string with the slack credentials
  let inviteUrlFromSlack = "https://join.slack.com/t/cdk-dev/shared_invite/zt-1be73wcat-VLBZ_PPMf0NYqLw1y3F0cQ";
  const slackParamName = process.env.SLACK_PARAM_NAME;
  if (slackParamName) {
    const ssm = new SSM();
    const params = {
        Name: slackParamName,
        WithDecryption: true
    };

    const res = await ssm.getParameter(params).promise();
    const param = res.Parameter?.Value;
    // do whatever slack api call to get a new invite url and replace it here
  }
  const response = {
    statusCode: 301,
    headers: {
      Location: inviteUrlFromSlack,
    },
  };
  return response;
};
