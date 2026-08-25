import { Router } from "express";
import { login } from "../security/auth.security.js";

const router = Router();

router.post("/login", login);

export default router;
