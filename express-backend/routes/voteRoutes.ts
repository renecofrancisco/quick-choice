import { Router } from "express";
import { submitVote, triggerFakeVotes } from "../controllers/voteController";

const router = Router();

// POST /votes
router.post("/", submitVote);

// POST /votes/fake
router.post("/fake", triggerFakeVotes);

export default router;
