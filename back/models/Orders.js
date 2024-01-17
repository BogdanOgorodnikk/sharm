const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'orders',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    delivery_date: {
      type: Sequelize.DATE,
    },
    delivery_price: {
      type: Sequelize.FLOAT,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    price_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.TEXT,
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
