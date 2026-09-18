const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  temperature: Number,
  pressure: Number,
  rpm: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Telemetry",
  telemetrySchema
);