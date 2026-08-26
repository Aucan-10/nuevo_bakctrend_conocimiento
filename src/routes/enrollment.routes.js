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
import { checkToken } from "../security/auth.middleware.js";
import { checkRole } from "../security/role.middleware.js";

const router = Router();

// Lectura: cualquier usuario logueado puede consultar inscripciones
router.get("/", checkToken, getAllEnrollments);
router.get("/student/:id", checkToken, getEnrollmentsByStudent);
router.get("/subject/:id", checkToken, getEnrollmentsBySubject);
router.get("/:id", checkToken, getEnrollmentById);

// Escritura: solo un profesor puede inscribir, cambiar nota o dar de baja
router.post("/", checkToken, checkRole("PROFESSOR"), createEnrollment);
router.put("/:id", checkToken, checkRole("PROFESSOR"), updateEnrollment);
router.delete("/:id", checkToken, checkRole("PROFESSOR"), deleteEnrollment);

export default router;
