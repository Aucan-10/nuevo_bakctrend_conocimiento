// auth.routes.js
import { Router } from "express";
import { login, register } from "../security/auth.security.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
