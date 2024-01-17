const Sequelize = require('sequelize');
const db = require('../database');

module.exports = db.sequelize.define(
  'products',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    fill_id: {
      type: Sequelize.INTEGER,
    },
    toggle_mechanism_id: {
      type: Sequelize.INTEGER,
    },
    frame_id: {
      type: Sequelize.INTEGER,
    },
    size_width: {
      type: Sequelize.STRING,
    },
    size_length: {
      type: Sequelize.STRING,
    },
    general_size_width: {
      type: Sequelize.STRING,
    },
    general_size_length: {
      type: Sequelize.STRING,
    },
    general_size_height: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
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
