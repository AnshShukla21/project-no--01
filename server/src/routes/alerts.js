const express = require("express");
const router = express.Router();

const Alert = require("../../models/Alert");

router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;