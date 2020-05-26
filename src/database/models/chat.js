import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
    },
    attacked: {
      type: Boolean,
      default: false,
    },
    lastDayJoined: {
      type: Array,
      of: mongoose.Schema.Types.Mixed,
      required: true,
      default: [],
    },
  },
  { id: false }
);

export default mongoose.model("Chat", schema);
