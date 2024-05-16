import mongoose from "mongoose";

const connectToDB = async (url) => {
  try {
    const res = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB");
    return res;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error; // Rethrow the error to handle it in the server.js
  }
};

export default connectToDB;
