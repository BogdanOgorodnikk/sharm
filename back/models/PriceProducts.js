const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'price_products',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price_id: {
      type: Sequelize.INTEGER,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
    special_price: {
      type: Sequelize.FLOAT,
    },
    first_category: {
      type: Sequelize.FLOAT,
    },
    second_category: {
      type: Sequelize.FLOAT,
    },
    thirdary_category: {
      type: Sequelize.FLOAT,
    },
    fourth_category: {
      type: Sequelize.FLOAT,
    },
    fives_category: {
      type: Sequelize.FLOAT,
    },
  },
  {
    timestamps: false,
  },
);
