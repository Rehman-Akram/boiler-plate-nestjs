import * as dotenv from 'dotenv';
dotenv.config();

export default () => {
  const emailConfig = {
    service: process.env['EMAIL_SERVICE'],
    auth: {
      user: process.env['FROM_EMAIL'],
      pass: process.env['EMAIL_APP_PASSWORD'],
    },
  };
  const awsS3Config = {
    accessKeyId: process.env['AWS_ACCESS_KEY'],
    secretAccessKey: process.env['AWS_SECRET_KEY'],
    region: process.env['AWS_REGION'],
    awsS3bucket: process.env['AWS_BUCKET'],
  };
  return {
    emailConfig,
    awsS3Config,
  };
};
