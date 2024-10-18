const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./src/db/dbconnection");
const config = require("./src/config/config");
const cors = require("cors");
const routes = require("./src/routes/v1");
const path = require("path");
const errorHandler = require("./src/helpers/error");
const Chat = require('./src/models/chat.model');
const socketIO = require("socket.io");
const chatController = require('./src/controllers/chats/chat.controller');

const app = express();
const server = http.createServer(app);

// Attach socket.io to the server
const io = socketIO(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, `./src/public`)));
app.use("/v1", routes);
app.use("/public/adminImg", express.static(path.join(__dirname, "./src/public/adminImg")));

// Error handler middleware
app.use(errorHandler);

// Connect to the database
connectDB();

// Socket.IO connection event handler
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on('send_message', async (data) => {
    // Emit the message to other users (doctor)
    socket.broadcast.emit('receive_message', data);

    // Save the message in the database
    await chatController.saveMessage(data);  // Call your saveMessage function here
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(config.port, () => {
  console.log("Server listening on port " + config.port);
});
