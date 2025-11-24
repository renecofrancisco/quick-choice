"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const pollRoutes_1 = __importDefault(require("./routes/pollRoutes"));
const voteRoutes_1 = __importDefault(require("./routes/voteRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, // set secure: true in production with HTTPS
}));
app.use("/auth", authRoutes_1.default);
app.use("/polls", pollRoutes_1.default);
app.use("/votes", voteRoutes_1.default);
app.use("/profiles", profileRoutes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Express API running on port ${PORT}`);
});
