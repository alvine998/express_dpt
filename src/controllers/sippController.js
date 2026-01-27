const SIPPHistory = require("../models/sipp_history");
const { Op } = require("sequelize");

exports.getHistory = async (req, res) => {
  try {
    const {
      uid,
      limit = 500,
      offset = 0,
      search,
      kota,
      exclude_pending,
      batch,
      processing_status,
    } = req.query;

    const where = { uid };

    if (search) {
      // Assuming search on kpj or data
      where[Op.or] = [
        { kpj: { [Op.like]: `%${search}%` } },
        // Searching inside JSON is dialect specific, simplified here or ignored if complex
      ];
    }
    if (kota) where.kota = kota;
    if (exclude_pending == 1) {
      where.processing_status = { [Op.ne]: "pending" };
    }
    if (batch) where.batch_id = batch;
    if (processing_status) {
      where.processing_status = { [Op.in]: processing_status.split(",") };
    }

    const histories = await SIPPHistory.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      data: {
        records: histories,
      },
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const { uid, kpj, processing_status, ...otherFields } = req.body;

    let record = await SIPPHistory.findOne({ where: { uid, kpj } });

    if (record) {
      record.processing_status = processing_status;
      // update data field
      record.data = { ...record.data, ...otherFields };
      await record.save();
    } else {
      // Or create? The spec says Update Record, implying existence or upsert if scraping.
      // I'll assume upsert logic for robustness
      record = await SIPPHistory.create({
        uid,
        kpj,
        processing_status,
        data: otherFields,
      });
    }
    res.json({ message: "Record updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { uid, records } = req.body;
    // Inefficient loop for now, optimize with bulkCreate/upsert later if needed
    for (const rec of records) {
      const { kpj, ...data } = rec;
      let record = await SIPPHistory.findOne({ where: { uid, kpj } });
      if (record) {
        record.data = { ...record.data, ...data };
        await record.save();
      } else {
        await SIPPHistory.create({
          uid,
          kpj,
          processing_status: "pending", // default
          data,
        });
      }
    }
    res.json({ message: "Bulk update processed" });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
