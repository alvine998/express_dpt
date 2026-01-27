const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    suspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    expiration_date: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    jenis_apps: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    min_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current_version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
