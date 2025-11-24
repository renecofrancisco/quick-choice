"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pollController_1 = require("../controllers/pollController");
const router = (0, express_1.Router)();
router.get("/next", pollController_1.getNextPoll); // GET /polls/next?userId=...
router.get("/", pollController_1.getUserPolls); // GET /polls?userId=123
router.get("/:pollId", pollController_1.getPollById); // GET /polls/:pollId
router.post("/", pollController_1.createPoll); // POST /polls
exports.default = router;
