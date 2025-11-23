import { Router } from "express";
import { getNextPoll, getUserPolls, getPollById, createPoll } from "../controllers/pollController";

const router = Router();

router.get("/next", getNextPoll); // GET /polls/next?userId=...
router.get("/", getUserPolls);        // GET /polls?userId=123
router.get("/:pollId", getPollById);  // GET /polls/:pollId
router.post("/", createPoll);          // POST /polls

export default router;
