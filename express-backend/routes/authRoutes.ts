import { Router } from "express";
import {
  sendMagicLink,
  getUser,
  signOut,
} from "../controllers/authController";

const router = Router();

router.post("/magic-link", sendMagicLink);
router.get("/me", getUser);
router.post("/logout", signOut);

export default router;
