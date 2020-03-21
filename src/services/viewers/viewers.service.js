// Initializes the `viewers` service on path `/viewers`
const { Viewers } = require('./viewers.class');
const createModel = require('../../models/viewers.model');
const hooks = require('./viewers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/viewers', new Viewers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('viewers');

  service.hooks(hooks);
};
