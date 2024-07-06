import { Schema } from "mongoose";

const messageModel = Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: { type: String, trim: true },
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
  },
});

const message = model("message", messageModel);

export default message;
