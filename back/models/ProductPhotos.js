const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'product_photos',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
    },
    photo_name: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  },
);
