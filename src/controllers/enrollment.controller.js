import {
  createEnrollmentService,
  getAllEnrollmentsService,
  getEnrollmentByIdService,
  getEnrollmentsByStudentService,
  getEnrollmentsBySubjectService,
  updateEnrollmentService,
  deleteEnrollmentService,
} from "../services/enrollment.service.js";

export const createEnrollment = async (req, res) => {
  try {
    const { student_id, subject_id } = req.body;

    if (!student_id || !subject_id) {
      return res.status(400).json({
        message: "student_id and subject_id are required",
      });
    }

    const enrollment = await createEnrollmentService({
      student_id,
      subject_id,
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Subject not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "User is not a student") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Student already enrolled") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await getAllEnrollmentsService();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await getEnrollmentByIdService(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollments = await getEnrollmentsByStudentService(id);
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnrollmentsBySubject = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollments = await getEnrollmentsBySubjectService(id);
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade } = req.body;

    if (grade === undefined) {
      return res.status(400).json({
        message: "grade is required",
      });
    }

    const enrollment = await updateEnrollmentService(id, { grade });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await deleteEnrollmentService(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.status(200).json({
      message: "Enrollment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
