import { Router } from "express";
import {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsBySubject,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/", createEnrollment);
router.get("/", getAllEnrollments);
router.get("/student/:id", getEnrollmentsByStudent);
router.get("/subject/:id", getEnrollmentsBySubject);
router.get("/:id", getEnrollmentById);
router.put("/:id", updateEnrollment);
router.delete("/:id", deleteEnrollment);

export default router;
