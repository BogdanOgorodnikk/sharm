const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'cars',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: Sequelize.STRING,
    },
    license_plate: {
      type: Sequelize.STRING,
    },
    owner: {
      type: Sequelize.STRING,
    },
    tax_number: {
      type: Sequelize.INTEGER,
    },
    model: {
      type: Sequelize.STRING,
    },
    vin_code: {
      type: Sequelize.STRING,
    },
    year_create: {
      type: Sequelize.INTEGER,
    },
    length: {
      type: Sequelize.INTEGER,
    },
    width: {
      type: Sequelize.INTEGER,
    },
    height: {
      type: Sequelize.INTEGER,
    },
    weight: {
      type: Sequelize.INTEGER,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: false,
  },
);
