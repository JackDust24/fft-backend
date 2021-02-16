"use strict";
// For sending and setting up Sengrid emails.

module.exports = ({ env }) => ({
    // ...
    // email: {
    //   provider: 'sendgrid',
    //   providerOptions: {
    //     apiKey: env('SENDGRID_API_KEY', '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'),
    //   },
    //   settings: {
    //     defaultFrom: env('SENDGRID_DEFAULT_FROM', 'admin@ffthai.com'),
    //     defaultReplyTo: env('SENDGRID_DEFAULT_REPLY_TO', 'admin@ffthai.com'),
    //   },
    // },
    email: {
        provider: 'gmail-2lo',
        providerOptions: {
          username: 'admin@ffthai.com',
          clientId: env('EMAIL_CLIENT_ID'),
          privateKey: env('EMAIL_PRIVATE_KEY').replace(/\\n/g, '\n'),
        },
        settings: {
          defaultFrom: 'admin@ffthai.com',
          defaultReplyTo: 'admin@ffthai.com',
        },
      },
    //...
      // For when I go with AWS 
      upload: {
        provider: 'aws-s3',
        providerOptions: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          region: env('AWS_REGION'),
          params: {
            Bucket: env('AWS_BUCKET'),
          },
        },
      }
  
      //Add more entries to the object for more plugins
      //Or comment this if you want to use local upload


  });