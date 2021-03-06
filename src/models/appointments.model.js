// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const appointments = sequelizeClient.define('appointments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: false,
    },

    max_subscribers: {
      type: DataTypes.INTEGER,
      default: 0,
    },

    room: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  appointments.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    models.appointments.hasMany(models.payments);    
    models.appointments.hasMany(models.viewers);

    // ToDo: hasMany(models.ratings)
  };

  return appointments;
};
