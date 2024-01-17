const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'payments',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    currency: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
    },
    client_id: {
      type: Sequelize.INTEGER,
    },
    creater_id: {
      type: Sequelize.INTEGER,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
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
