import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },

    purchaseId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    num: {
      type: Number,
      default: 5,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
