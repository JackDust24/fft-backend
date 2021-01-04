module.exports = strapi => {
    module.exports = {
        load: {
          before: ['timer', 'responseTime', 'logger', 'cors', 'responses', 'gzip'],
          after: ['parser', 'router'],
        },
        settings: {
          cors: {
            enabled: true,
            origin: ['*']
          },
        },
      };
  };