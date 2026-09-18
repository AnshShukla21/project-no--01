const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend Running Successfully",
  });
});

io.on("connection", (socket) => {
  console.log("Client Connected");

  const interval = setInterval(() => {  
    socket.emit("telemetry", {
      temperature: (70 + Math.random() * 20).toFixed(1),
      pressure: (40 + Math.random() * 10).toFixed(1),
      rpm: Math.floor(1500 + Math.random() * 500),
      timestamp: new Date().toLocaleTimeString(),
    });
  }, 2000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client Disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server Running On Port 5000");
});