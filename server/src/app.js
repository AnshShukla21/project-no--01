const alertRoutes = require("./routes/alerts"); 
const telemetryRoutes = require("./routes/telemetry");
const express = require("express");
const cors = require("cors");

const app = express();

app.use("/api/alerts", alertRoutes);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "NexusFlow API is running",
  });
 
});
 app.use("/api/telemetry", telemetryRoutes);

module.exports = app;