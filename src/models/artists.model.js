// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const artists = sequelizeClient.define('artists', {
  
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  
    googleId: { type: Sequelize.STRING },
  
    facebookId: { type: Sequelize.STRING },
  
    twitterId: { type: Sequelize.STRING },
  
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  artists.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    models.artists.hasMany(models.appointments);
  };

  return artists;
};
