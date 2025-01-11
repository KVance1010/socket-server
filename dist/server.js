import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// express instance
const app = express();
const port = process.env.PORT || 5000;
// create server and socket.io instance
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// delete these lines
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/", (_req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});
// socket connection
io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        io.emit('chat message', msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
// start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
