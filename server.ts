import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const URL = process.env.APPLICATION_URL;

// express instance
const app = express();
const port = process.env.PORT || 3001;

// create server and socket.io instance
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
  },
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// socket connection
io.on("connection", (socket) => {
  // socket.on("chat message", (msg) => {
  //   console.log("message: " + msg);
  //   io.emit("chat message", msg);
  // });
  console.log("A user connected");

  socket.on("joinChat", (chatRoomID) => {
    console.log("A user joined the chat room", chatRoomID);
    socket.join(chatRoomID);
  });

  socket.on("sendMessageToChatRoom", (chatRoomId, message) => {
    console.log("Received message:", message);
    io.to(chatRoomId).emit("messageReceived", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
