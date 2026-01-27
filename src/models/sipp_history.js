const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SIPPHistory = sequelize.define(
  "SIPPHistory",
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
    kpj: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    processing_status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // pending, sipp_done, done, error, skipped
    },
    batch_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kota: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSON, // To store flexible additional fields
      allowNull: true,
    },
  },
  {
    tableName: "sipp_history",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["uid", "kpj"],
      },
      {
        fields: ["batch_id"],
      },
      {
        fields: ["processing_status"],
      },
    ],
  },
);

module.exports = SIPPHistory;
