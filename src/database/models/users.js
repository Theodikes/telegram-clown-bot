const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    username: {
      type: String
    },
    banned: {
      type: Boolean,
      required: true,
      default: false
    },
    bans: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { id: false }
);

module.exports = mongoose.model("User", schema);
