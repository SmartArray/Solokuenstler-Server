const artists = require('./artists/artists.service.js');
const appointments = require('./appointments/appointments.service.js');
const payments = require('./payments/payments.service.js');
const viewers = require('./viewers/viewers.service.js');
const register = require('./register/register.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(artists);
  app.configure(appointments);
  app.configure(payments);
  app.configure(viewers);
  app.configure(register);
};