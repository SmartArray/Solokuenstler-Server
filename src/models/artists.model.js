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
    },

    artist_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  
    googleId: { type: DataTypes.STRING },
  
    facebookId: { type: DataTypes.STRING },
  
    twitterId: { type: DataTypes.STRING },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },

    indexes: [
      { unique: true, fields: ['email', 'artist_id'] },
    ],
  });

  // eslint-disable-next-line no-unused-vars
  artists.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    models.artists.hasMany(models.appointments);

    // ToDo: hasMany(models.ratings)
  };

  return artists;
};
