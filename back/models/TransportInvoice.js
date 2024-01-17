const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'transport_invoices',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER,
    },
    car_id: {
      type: Sequelize.INTEGER,
    },
    trailer_id: {
      type: Sequelize.INTEGER,
    },
    driver_id: {
      type: Sequelize.INTEGER,
    },
    customer_id: {
      type: Sequelize.INTEGER,
    },
    unloading_place: {
      type: Sequelize.STRING,
    },
    data_create: {
      type: Sequelize.DATE,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: false,
  },
);
