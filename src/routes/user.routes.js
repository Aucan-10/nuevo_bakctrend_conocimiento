import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getAllStudents,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { checkToken } from "../security/auth.middleware.js";

const router = Router();

// Aplica el middleware `checkToken` a todas las rutas protegidas
router.use(checkToken);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios activos
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/students:
 *   get:
 *     summary: Obtiene solo los usuarios con rol de estudiante
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/students", getAllStudents);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 example: "contraseña1234"
 *               role:
 *                 type: string
 *                 enum: [STUDENT, PROFESSOR]
 *                 default: "STUDENT"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       409:
 *         description: El email ya está registrado
 */
router.post("/", createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [STUDENT, PROFESSOR]
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario (Soft Delete) por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", deleteUser);

export default router;
