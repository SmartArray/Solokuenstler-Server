const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

module.exports = app => {
  const viewerAuth = new AuthenticationService(app, 'viewerAuth');
  viewerAuth.register('jwt', new JWTStrategy());
  viewerAuth.register('local', new LocalStrategy());
  app.use('/auth/viewer', viewerAuth);

  const artistAuth = new AuthenticationService(app, 'artistAuth');
  artistAuth.register('jwt', new JWTStrategy());
  artistAuth.register('local', new LocalStrategy());
  app.use('/auth/artist', artistAuth);

  app.configure(expressOauth());
};
