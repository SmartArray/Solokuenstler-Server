const { authenticateArtist, authenticateAny } = require('../../authenticationHelpers');

module.exports = {
  before: {
    all: [ ],
    find: [ authenticateAny('jwt') ],
    get: [],
    create: [ authenticateArtist('jwt') ],
    update: [ authenticateArtist('jwt') ],
    patch: [ authenticateArtist('jwt') ],
    remove: [ authenticateArtist('jwt') ],
  },

  after: {
    all: [],
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
