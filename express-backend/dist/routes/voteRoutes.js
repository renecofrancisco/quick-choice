"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voteController_1 = require("../controllers/voteController");
const router = (0, express_1.Router)();
// POST /votes
router.post("/", voteController_1.submitVote);
// POST /votes/fake
router.post("/fake", voteController_1.triggerFakeVotes);
exports.default = router;
