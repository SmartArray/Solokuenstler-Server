const assert = require('assert');
const app = require('../../src/app');

describe('\'register\' service', () => {
  it('registered the service', () => {
    const service = app.service('register');

    assert.ok(service, 'Registered the service');
  });
});
