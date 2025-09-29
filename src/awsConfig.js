import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_p18Kuit2n', // tu User Pool ID
      userPoolClientId: '52o5p6oj0rkqbe5a6ngmj5qgmv', // el nuevo Client ID sin secreto
      loginWith: {
        email: true
      }
    }
  }
};

Amplify.configure(awsConfig);

export default awsConfig;
