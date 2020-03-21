const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { expressOauth } = require('@feathersjs/authentication-oauth');

const SKAuthenticationStrategy = require('./strategies/SKAuthenticationStrategy');

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('artist', new SKAuthenticationStrategy('artists', 'artist'));
  authentication.register('viewer', new SKAuthenticationStrategy('viewers', 'artist'));

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
