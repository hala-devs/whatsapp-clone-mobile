import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const senderId = req.userId;

  const messages = await Message.find({
    $or: [{ senderId }, { receiverId: senderId }],
  });

  res.send(messages);
};
