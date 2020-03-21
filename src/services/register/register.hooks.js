const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const ProtectConf = { strategy: 'artist' };

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ hashPassword('password', ProtectConf) ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password', ProtectConf),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
