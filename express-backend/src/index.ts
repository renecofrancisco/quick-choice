import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// import pollRoutes from "./routes/pollRoutes";
// import voteRoutes from "./routes/voteRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/polls", pollRoutes);
// app.use("/votes", voteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express API running on port ${PORT}`);
});
