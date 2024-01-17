const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'textiles',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.INTEGER,
    },
    textile_image: {
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
