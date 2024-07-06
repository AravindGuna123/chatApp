import { Schema, model } from "mongoose";

const chatModel = Schema(
  {
    chatName: { type: String, required: true },
    isGroupChat: { type: Boolean, default: false },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timeStamps: true,
  }
);

const chat = model("Chat", chatModel);

export default chat;
