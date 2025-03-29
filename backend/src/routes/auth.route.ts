import express from "express";
import {
  login,
  signup,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);

router.post("/login", login as any);

router.post("/logout", logout as any);

router.post("/signup", signup as any);

export default router;
