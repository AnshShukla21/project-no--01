const Alert = require("../models/Alert");

const Telemetry = require("../models/Telemetry");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ================================
// SOCKET CONNECTION
// ================================

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ================================
// REAL-TIME TELEMETRY GENERATOR
// ================================

setInterval(async () => {
  const telemetryData = {
    temperature: (70 + Math.random() * 20).toFixed(2),
    pressure: (40 + Math.random() * 10).toFixed(2),
    rpm: Math.floor(1700 + Math.random() * 300),
    timestamp: new Date().toLocaleTimeString(),
  };

  console.log("Sending telemetry:", telemetryData);

  // Send telemetry to all connected clients
  io.emit("telemetry", telemetryData);
  try {

  await Telemetry.create({
    temperature: Number(telemetryData.temperature),
    pressure: Number(telemetryData.pressure),
    rpm: Number(telemetryData.rpm),
  });

  console.log("Saved to MongoDB");

  if (Number(telemetryData.temperature) > 85) {
  await Alert.create({
    message: `High Temperature: ${telemetryData.temperature}°C`,
    severity: "HIGH",
  });

  console.log("🚨 Alert Generated");
}
} catch (err) {

  console.log(err);

}



  

}, 1000);



// ================================
// START SERVER
// ================================

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`NexusFlow server running on port ${PORT}`);
    console.log(`WebSocket running on port ${PORT}`);
  });
};

startServer();