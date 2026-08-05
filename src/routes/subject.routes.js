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

const router = Router();

router.get("/", getAllSubjects);
router.get("/professor/:id", getSubjectsByProfessor);
router.get("/student/:id", getSubjectsByStudent);
router.get("/:id/students", getStudentsBySubject);
router.get("/:id/professor", getProfessorBySubject);
router.get("/:id/full", getAllSubjectsWithDetails);

router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
