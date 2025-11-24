import { Router } from "express";
import { getUserProfile } from "../controllers/profileController";

const router = Router();

// GET /profiles/:userId
router.get("/:userId", getUserProfile);

export default router;
