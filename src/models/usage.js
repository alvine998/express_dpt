const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usage = sequelize.define(
  "Usage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    max_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    reset_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usage",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["uid", "type"],
      },
    ],
  },
);

module.exports = Usage;
