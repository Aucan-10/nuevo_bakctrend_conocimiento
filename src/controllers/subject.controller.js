import {
  createSubjectService,
  getAllSubjectsService,
  getSubjectsByProfessorService,
  getProfessorBySubjectService,
  getSubjectsByStudentService,
  updateSubjectService,
  deleteSubjectService,
} from "../services/subject.service.js";

export const createSubject = async (req, res) => {
  try {
    const { name, description, professor_id } = req.body;

    // Validaciones básicas
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const subject = await createSubjectService(req.body);

    res.status(201).json(subject);
  } catch (error) {
    if (error.message === "Professor not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "User is not a professor") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await getAllSubjectsService();

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSubjectsByProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const subjects = await getSubjectsByProfessorService(id);

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, professor_id } = req.body;

    // Validaciones
    if (!name && description === undefined && professor_id === undefined) {
      return res.status(400).json({
        message: "No data provided to update",
      });
    }

    const subject = await updateSubjectService(id, req.body);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json(subject);
  } catch (error) {
    if (error.message === "Professor not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "User is not a professor") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await deleteSubjectService(id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfessorBySubject = async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await getProfessorBySubjectService(id);

    if (!professor) {
      return res.status(404).json({
        message: "Subject not found or has no professor assigned",
      });
    }

    res.status(200).json(professor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSubjectsByStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const subjects = await getSubjectsByStudentService(id);

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
