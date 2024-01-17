const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'order_products',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
    number: {
      type: Sequelize.INTEGER,
    },
    made: {
      type: Sequelize.INTEGER,
    },
    note: {
      type: Sequelize.TEXT,
    },
    amount: {
      type: Sequelize.FLOAT,
    },
    textile: {
      type: Sequelize.TEXT,
    },
    textile_categories: {
      type: Sequelize.TEXT,
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
