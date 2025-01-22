import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.log("error connecting to DB---", err);
      });
  } catch (error) {
    console.log("Error connecting mongoDb", error.message);
  }
};
export default connect;
