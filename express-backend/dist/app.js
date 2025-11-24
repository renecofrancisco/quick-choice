"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const pollRoutes_1 = __importDefault(require("./routes/pollRoutes"));
const voteRoutes_1 = __importDefault(require("./routes/voteRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", authRoutes_1.default);
app.use("/polls", pollRoutes_1.default);
app.use("/votes", voteRoutes_1.default);
app.use("/profiles", profileRoutes_1.default);
exports.default = app;
