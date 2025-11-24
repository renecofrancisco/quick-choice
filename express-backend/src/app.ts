import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import pollRoutes from "./routes/pollRoutes";
import voteRoutes from "./routes/voteRoutes";
import profileRoutes from "./routes/profileRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);
app.use("/profiles", profileRoutes);

export default app;
