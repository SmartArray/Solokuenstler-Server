// authenticationHelpers.js

const { NotAuthenticated } = require('@feathersjs/errors');
const { authenticate } = require('@feathersjs/authentication').hooks;

const authenticateArtist = function () {
  const strategies = Array.prototype.slice.call(arguments);

  return authenticate({
    service: '/auth/artist',
    strategies,
  });
};

const authenticateAny = function () {
  const strategies = Array.prototype.slice.call(arguments);

  const artistAuth = authenticate({
    service: '/auth/artist',
    strategies,
  });

  const viewerAuth = authenticate({
    service: '/auth/viewer',
    strategies,    
  });

  return async (context) => {
    try {
      // First try authentication as a viewer
      return await viewerAuth(context);
    } catch (e) { /* Ignore */ }

    // If that failed, retry as artist.
    return await artistAuth(context);
  };
};

module.exports = {
  authenticateArtist,
  authenticateAny,
};