// Initializes the `appointments` service on path `/appointments`
const { Appointments } = require('./appointments.class');
const createModel = require('../../models/appointments.model');
const hooks = require('./appointments.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/appointments', new Appointments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('appointments');

  service.hooks(hooks);
};
