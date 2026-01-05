import mongoose from "mongoose";
const host = process.env.MONGO_URL.split("@")[1];
export const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    con && console.log(`db is connected running at ${host}`);
  } catch (error) {
    console.log(error);
  }
};
