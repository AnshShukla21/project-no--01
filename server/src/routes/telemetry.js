const express = require("express");
const router = express.Router();

const Telemetry = require("../../models/Telemetry");

router.get("/", async (req, res) => {
  try {
    const data = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;