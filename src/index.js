/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');
const https = require('https');
const port = app.get('port');
const ssl = app.get('ssl');
const fs = require('fs');

const server = (() => {
  if (ssl.enabled) {
    // Create https server instance
    const server = https.createServer({
      key: fs.readFileSync(ssl.key),
      cert: fs.readFileSync(ssl.cert),
      rejectUnauthorized: false,
      requestCert: false,
    }, app).listen(ssl.port);
    app.setup(server);
    return server;

  } else {
    // Create http server instance
    const server = app.listen(port);
    return server;
  }
})();

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () => {
  const protocol = ssl.enabled ? 'https' : 'http';
  const listeningPort = ssl.enabled ? ssl.port : port;
  const uri = `${protocol}://${app.get('host')}:${listeningPort}`;
  logger.info(`solokuenstler-server started on ${uri}`);
});