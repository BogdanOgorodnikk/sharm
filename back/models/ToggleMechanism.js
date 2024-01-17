const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'toggleMechanism',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
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
