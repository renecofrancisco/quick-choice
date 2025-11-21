import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/authRoutes";
import pollRoutes from "./routes/pollRoutes";
import voteRoutes from "./routes/voteRoutes";
import profileRoutes from "./routes/profileRoutes";


const app = express();

app.use(cors({
  origin: "http://localhost:3000", // your Next.js frontend
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }, // set secure: true in production with HTTPS
}));

app.use("/auth", authRoutes);
app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);
app.use("/profiles", profileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express API running on port ${PORT}`);
});
