// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const payments = sequelizeClient.define('payments', {
    from_viewer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    target_artist: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    payment_id: {
      type: DataTypes.STRING,
    },

    amount: {
      type: DataTypes.INTEGER, // in cents
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    
    indexes: [
      { unique: false, fields: ['target_artist', 'from_viewer'] },
    ],

    timestamps: true,
  });

  // eslint-disable-next-line no-unused-vars
  payments.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return payments;
};
