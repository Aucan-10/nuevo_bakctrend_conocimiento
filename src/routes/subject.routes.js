import { Router } from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectsByProfessor,
  getProfessorBySubject,
  getSubjectsByStudent,
  getStudentsBySubject,
  getAllSubjectsWithDetails,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import { checkToken } from "../security/auth.middleware.js";
import { checkRole } from "../security/role.middleware.js";

const router = Router();

// Rutas de lectura: cualquier usuario logueado puede verlas
router.get("/", checkToken, getAllSubjects);
router.get("/professor/:id", checkToken, getSubjectsByProfessor);
router.get("/student/:id", checkToken, getSubjectsByStudent);
router.get("/:id/students", checkToken, getStudentsBySubject);
router.get("/:id/professor", checkToken, getProfessorBySubject);
router.get("/:id/full", checkToken, getAllSubjectsWithDetails);

// Rutas de escritura: solo profesores
router.post("/", checkToken, checkRole("PROFESSOR"), createSubject);
router.put("/:id", checkToken, checkRole("PROFESSOR"), updateSubject);
router.delete("/:id", checkToken, checkRole("PROFESSOR"), deleteSubject);

export default router;
