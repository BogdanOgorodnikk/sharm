const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'prices',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    currency: {
      type: Sequelize.STRING,
    },
    from_date: {
      type: Sequelize.DATE,
    },
    isRetail: {
      type: Sequelize.BOOLEAN,
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
