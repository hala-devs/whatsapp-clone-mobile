import express from "express";
import { connectDB } from "./config.js";
import cors from "cors";
import isAuth, { isSocketAuth } from "./middlewares/isAuth.js";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import Message from "./models/Message.js";

const app = express();

const PORT = 8000;

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(isSocketAuth);

app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRouter);
app.use("/message", isAuth, messageRouter);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/secret", isAuth, (req, res) => {
  res.send({ msg: req.userId });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
connectDB();

io.on("connection", (socket) => {
  console.log("a user connected", socket.userId);
  socket.join(socket.userId);

  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
  });
  socket.on("send_message", async ({ receiverId, content }) => {
    const senderId = socket.userId;
    const message = await Message.create({ senderId, receiverId, content });
    io.to([receiverId, senderId]).emit("receive_message", message);
  });
  socket.on("typing", (receiverId)=>{
    socket.to(receiverId).emit("typing", socket.userId)
  })

  socket.on("stop_typing", (receiverId)=>{
    socket.to(receiverId).emit("stop_typing", socket.userId);
  });
  socket.on("seen", async(receiverId)=>{
    const senderId = socket.userId
    await Message.updateMany({senderId,  receiverId, seen: false},
      {seen: true},
      {multi: true}
    ).exec();

      io.emit("seen", senderId);
    
  });
});
