import mongoose from "mongoose";

export const connectDb = () => {
  try {
    const con = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    con && console.log("db connected");
  } catch (error) {
    console.log(error);
  }
};
