import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";

export const createUserService = async ({
  name,
  email,
  password,
  role = "STUDENT",
}) => {
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
  const passwordHash = await bcrypt.hash(password, 10);

  // Insertar usuario
  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      role,
    })
    .select("id, name, email, role, created_at")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const getAllUsersService = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const getAllStudentsService = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .eq("role", "STUDENT")
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const updateUserService = async (
  id,
  { name, email, password, role }
) => {
  // Verificar que el usuario existe
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!existingUser) return null;

  // Preparar datos a actualizar
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;

  // Si se proporciona nueva contraseña, hashearla
  if (password) {
    updateData.password_hash = await bcrypt.hash(password, 10);
  }

  // Si se actualiza el email, verificar que no exista en otro usuario
  if (updateData.email) {
    const { data: emailExists } = await supabase
      .from("users")
      .select("id")
      .eq("email", updateData.email)
      .neq("id", id)
      .single();

    if (emailExists) {
      throw new Error("Email already in use");
    }
  }

  // Actualizar usuario
  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select("id, name, email, role, updated_at")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const deleteUserService = async (id) => {
  // Soft delete: actualizar deleted_at
  const { data, error } = await supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  return data;
};
