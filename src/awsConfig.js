import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_ft056chSd',
      userPoolClientId: '7kc4dsaamh3e6en7spmmtstqcb',
      loginWith: {
        email: true,
      }
    }
  }
};

Amplify.configure(awsConfig);