const Sequelize = require('sequelize');

module.exports = function (app) {
  const connectionString = app.get('postgres');
  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync());
    // app.set('sequelizeSync', sequelize.sync({ force: process.env.NODE_ENV != 'production' }));

    // Drop tables
    // app.get('sequelizeSync').then(() => {
    //   console.log("DROP");
    //   return sequelize.drop();
    // });

    return result;
  };
};
