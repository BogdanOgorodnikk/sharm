const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    place: {
      type: Sequelize.STRING,
    },
    tax_number: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    role_code: {
      type: Sequelize.STRING,
    },
    isBanned: {
      type: Sequelize.BOOLEAN,
    },
    town: {
      type: Sequelize.STRING,
    },
    region: {
      type: Sequelize.STRING,
    },
    price_id: {
      type: Sequelize.INTEGER,
    },
    delivery_place: {
      type: Sequelize.STRING,
    },
    data_create: {
      type: Sequelize.DATE,
    },
    data_update: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: false,
  },
);
