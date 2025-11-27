// Don's Forget To add extension with any import file
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();


app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://10.178.123.106:5173",
    process.env.CLIENT_URL   // Cloudflare URL dynamic
  ],
  credentials: true
}));


// for printing what will on Screen
app.get("/", (req, res) => res.send("Api Working"));

//api end point /api/auth is for every url and authRouter call function according to name
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// It's for Starting Server
app.listen(port, () => console.log(`server started on port : ${port}`));
