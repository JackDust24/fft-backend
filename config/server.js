module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '7b35971690f11d2c0d2a561bf2b85b1d'),
    },
  },
  cron: {
    enabled: true,
  }
});
