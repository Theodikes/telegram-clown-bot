import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
  },
  { id: false }
);

export default mongoose.model("Admin", schema);
