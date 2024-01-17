const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'drivers',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: Sequelize.STRING,
    },
    driver_license_number: {
      type: Sequelize.STRING,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: false,
  },
);
