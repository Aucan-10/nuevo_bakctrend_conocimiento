import {
  createUserService,
  getAllUsersService,
  getAllStudentsService,
  updateUserService,
  deleteUserService,
} from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (role && !["PROFESSOR", "STUDENT"].includes(role)) {
      return res.status(400).json({
        message: "Role must be PROFESSOR or STUDENT",
      });
    }

    const user = await createUserService(req.body);

    res.status(201).json(user);
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await getAllStudentsService();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Validaciones
    if (role && !["PROFESSOR", "STUDENT"].includes(role)) {
      return res.status(400).json({
        message: "Role must be PROFESSOR or STUDENT",
      });
    }

    if (!name && !email && !password && !role) {
      return res.status(400).json({
        message: "No data provided to update",
      });
    }

    const user = await updateUserService(id, req.body);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.message === "Email already in use") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deleteUserService(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
