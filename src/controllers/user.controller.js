import * as userService from "../services/user.service.js";

// ==========================================
// CREATE
// ==========================================
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    if (role && !["PROFESSOR", "STUDENT"].includes(role)) {
      return res.status(400).json({
        error: "Role must be PROFESSOR or STUDENT",
      });
    }

    const user = await userService.createUserInDB({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// ==========================================
// READ - Todos
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsersFromDB();
    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==========================================
// READ - Solo alumnos
// ==========================================
export const getAllStudents = async (req, res) => {
  try {
    const students = await userService.getAllStudentsFromDB();
    return res.status(200).json({
      count: students.length,
      students,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==========================================
// UPDATE
// ==========================================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (role && !["PROFESSOR", "STUDENT"].includes(role)) {
      return res.status(400).json({
        error: "Role must be PROFESSOR or STUDENT",
      });
    }

    if (!name && !email && !password && !role) {
      return res.status(400).json({
        error: "No data provided to update",
      });
    }

    const user = await userService.updateUserInDB(id, {
      name,
      email,
      password,
      role,
    });

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Email already in use") {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// ==========================================
// DELETE
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await userService.deleteUserFromDB(id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};
