import mongoose from "mongoose";

const schema = new mongoose.Schema({
  file_id: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("Sticker", schema);
