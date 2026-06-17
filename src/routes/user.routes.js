import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getAllStudents, // ← AGREGAR ESTO
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/students", getAllStudents);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
