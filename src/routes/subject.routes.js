import { Router } from "express";

import {
  createSubject,
  getAllSubjects,
  getSubjectsByProfessor,
  getProfessorBySubject,
  getSubjectsByStudent,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

const router = Router();

router.get("/", getAllSubjects);
router.get("/professor/:id", getSubjectsByProfessor);
router.get("/student/:id", getSubjectsByStudent);
router.get("/:id/professor", getProfessorBySubject);

router.post("/", createSubject);

router.put("/:id", updateSubject);

router.delete("/:id", deleteSubject);

export default router;
