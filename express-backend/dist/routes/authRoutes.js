"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/magic-link", authController_1.sendMagicLink);
router.get("/me", authController_1.getUser);
router.post("/logout", authController_1.signOut);
exports.default = router;
