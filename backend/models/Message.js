import mongoose from "mongoose";

// ✅ غيرنا الاسم ليطابق الوظيفة
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    required: true,
    default: false,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, {
  timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
