const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, required: true },
    isGroupChat: { type: Boolean, default: false },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatModel);


