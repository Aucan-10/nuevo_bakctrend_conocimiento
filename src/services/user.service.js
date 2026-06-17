import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";

// ==========================================
// CREATE
// ==========================================
export const createUserInDB = async (userData) => {
  const { name, email, password, role = "STUDENT" } = userData;

  // Verificar si el email ya existe
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hashear contraseña
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  // Insertar usuario
  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash,
      role,
    })
    .select("id, name, email, role, created_at")
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// READ - Todos los usuarios
// ==========================================
export const getAllUsersFromDB = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ==========================================
// READ - Solo alumnos
// ==========================================
export const getAllStudentsFromDB = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .eq("role", "STUDENT")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ==========================================
// UPDATE
// ==========================================
export const updateUserInDB = async (id, updateData) => {
  const { name, email, password, role } = updateData;

  // Verificar que el usuario existe
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Preparar datos a actualizar
  const dataToUpdate = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (role) dataToUpdate.role = role;

  // Si se proporciona nueva contraseña, hashearla
  if (password) {
    const saltRounds = 10;
    dataToUpdate.password_hash = await bcrypt.hash(password, saltRounds);
  }

  // Si se actualiza el email, verificar que no exista
  if (dataToUpdate.email) {
    const { data: emailExists } = await supabase
      .from("users")
      .select("id")
      .eq("email", dataToUpdate.email)
      .neq("id", id)
      .single();

    if (emailExists) {
      throw new Error("Email already in use");
    }
  }

  // Actualizar usuario
  const { data, error } = await supabase
    .from("users")
    .update(dataToUpdate)
    .eq("id", id)
    .select("id, name, email, role, created_at, updated_at")
    .single();

  if (error) throw error;
  return data;
};

// ==========================================
// DELETE - Soft delete
// ==========================================
export const deleteUserFromDB = async (id) => {
  // Verificar que el usuario existe
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Soft delete
  const { error } = await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  return true;
};
