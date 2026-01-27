const Batch = require("../models/batch");
const { Op } = require("sequelize");

exports.getBatches = async (req, res) => {
  try {
    const { uid, status } = req.query;
    const where = {};
    if (uid) where.uid = uid;
    if (status) {
      // support comma separated
      where.status = { [Op.in]: status.split(",") };
    }

    const batches = await Batch.findAll({ where });

    // Map to response format
    const data = batches.map((b) => ({
      batch_id: b.batch_id,
      status: b.status,
      total_kpj: b.total_kpj,
      completed_kpj: b.completed_kpj,
    }));

    res.json({ data });
  } catch (error) {
    console.error("Get batches error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createOrUpdateBatch = async (req, res) => {
  try {
    const { uid, batch_id, source, kpj_list } = req.body;

    let batch = await Batch.findByPk(batch_id);

    if (batch) {
      // Update
      batch.source = source;
      if (kpj_list) {
        batch.kpj_list = kpj_list;
        batch.total_kpj = kpj_list.length; // Assuming list determines total
      }
      await batch.save();
    } else {
      // Create
      batch = await Batch.create({
        batch_id,
        uid,
        source,
        kpj_list,
        total_kpj: kpj_list ? kpj_list.length : 0,
        status: "pending",
      });
    }

    res.json({ message: "Batch saved", data: batch });
  } catch (error) {
    console.error("Create batch error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateBatchStatus = async (req, res) => {
  try {
    const { batch_id } = req.query;
    const { status } = req.body;

    const batch = await Batch.findByPk(batch_id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    batch.status = status;
    await batch.save();

    res.json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.incrementCompleted = async (req, res) => {
  try {
    const { batch_id } = req.query;
    const { increment_completed } = req.body;

    if (increment_completed) {
      const batch = await Batch.findByPk(batch_id);
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      batch.completed_kpj += 1;
      await batch.save();
    }
    res.json({ message: "Incremented" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markAllDone = async (req, res) => {
  try {
    const { uid, action } = req.body;
    if (action === "mark_all_done") {
      await Batch.update(
        { status: "done" },
        { where: { uid, status: { [Op.ne]: "done" } } },
      );
    }
    res.json({ message: "All marked done" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
