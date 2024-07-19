const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email"],
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
    },
    pic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
