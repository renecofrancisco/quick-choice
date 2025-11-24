"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const router = (0, express_1.Router)();
// GET /profiles/:userId
router.get("/:userId", profileController_1.getUserProfile);
exports.default = router;
