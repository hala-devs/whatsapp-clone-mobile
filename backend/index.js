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

app.use("/uploads", express.static("public/uploads"));
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

connectDB();

io.on("connection", (socket) => {
  console.log("a user connected", socket.userId);
  socket.join(socket.userId);

  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
  });

  socket.on("send_message", async ({ receiverId, content }) => {
    try {
      const senderId = socket.userId;
      const message = await Message.create({ senderId, receiverId, content });
      
      // إرسال للطرفين بأسلوب أضمن
      io.to(receiverId).to(senderId).emit("receive_message", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("typing", (receiverId) => {
    socket.to(receiverId).emit("typing", socket.userId);
  });

  socket.on("stop_typing", (receiverId) => {
    socket.to(receiverId).emit("stop_typing", socket.userId);
  });

  socket.on("seen", async (chatPartnerId) => {
    try {
      const currentUserId = socket.userId;
      
      // تعديل الرسائل الواردة من الشريك القادمة إلى المستخدم الحالي
      await Message.updateMany(
        { senderId: chatPartnerId, receiverId: currentUserId, seen: false },
        { $set: { seen: true } }
      );

      // تنبيه الشريك الآخر بأن رسائله قرأت
      io.to(chatPartnerId).emit("seen", currentUserId);
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});