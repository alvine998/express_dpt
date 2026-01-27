const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Batch = sequelize.define(
  "Batch",
  {
    batch_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // pending, processing, done
    },
    total_kpj: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completed_kpj: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kpj_list: {
      type: DataTypes.JSON, // Storing list of KPJs as JSON
      allowNull: true,
    },
  },
  {
    tableName: "batches",
    timestamps: true,
  },
);

module.exports = Batch;
