import { Router } from "express";
import {
  sendMagicLink,
  consumeMagicLink,
  getUser,
  signOut,
} from "../controllers/authController";

const router = Router();

router.post("/signin", sendMagicLink);
router.post("/callback", consumeMagicLink);
router.get("/user", getUser);
router.post("/signout", signOut);

export default router;
