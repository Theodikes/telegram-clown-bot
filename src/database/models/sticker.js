const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  file_id: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Sticker", schema);
