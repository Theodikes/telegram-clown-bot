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
    }
  },
  { id: false }
);

module.exports = mongoose.model("Admin", schema);
