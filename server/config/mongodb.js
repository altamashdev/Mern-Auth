import mongoose from "mongoose"; // Mongoose for connect mongoDB with env variable

//connect with env
const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected"));

  await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
};

export default connectDB;
