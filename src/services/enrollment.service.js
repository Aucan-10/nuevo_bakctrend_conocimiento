import { supabase } from "../config/supabase.js";

export const createEnrollmentService = async ({ student_id, subject_id }) => {
  // Verificar que el estudiante existe y tiene el rol correcto
  const { data: student, error: studentError } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", student_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (studentError) throw new Error(studentError.message);
  if (!student) throw new Error("Student not found");
  if (student.role !== "STUDENT") throw new Error("User is not a student");

  // Verificar que la materia existe
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("id")
    .eq("id", subject_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (subjectError) throw new Error(subjectError.message);
  if (!subject) throw new Error("Subject not found");

  // Verificar que no esté ya inscrito
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", student_id)
    .eq("subject_id", subject_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) throw new Error("Student already enrolled");

  // Crear la inscripción
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      student_id,
      subject_id,
    })
    .select("id, student_id, subject_id, grade, created_at")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const getAllEnrollmentsService = async () => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      student_id,
      subject_id,
      grade,
      created_at,
      updated_at,
      users:student_id(id, name, email),
      subjects:subject_id(id, name, description)
    `
    )
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const getEnrollmentByIdService = async (id) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      student_id,
      subject_id,
      grade,
      created_at,
      updated_at,
      users:student_id(id, name, email),
      subjects:subject_id(id, name, description)
    `
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const getEnrollmentsByStudentService = async (student_id) => {
  // Verificar que el estudiante existe
  const { data: student } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", student_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!student || student.role !== "STUDENT") {
    return [];
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      subject_id,
      grade,
      created_at,
      subjects:subject_id(id, name, description, professor_id)
    `
    )
    .eq("student_id", student_id)
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const getEnrollmentsBySubjectService = async (subject_id) => {
  // Verificar que la materia existe
  const { data: subject } = await supabase
    .from("subjects")
    .select("id")
    .eq("id", subject_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!subject) {
    return [];
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      student_id,
      grade,
      created_at,
      users:student_id(id, name, email, role)
    `
    )
    .eq("subject_id", subject_id)
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const updateEnrollmentService = async (id, { grade }) => {
  // Verificar que la inscripción existe
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!existingEnrollment) return null;

  // Actualizar la nota
  const { data, error } = await supabase
    .from("enrollments")
    .update({ grade })
    .eq("id", id)
    .select("id, student_id, subject_id, grade, updated_at")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const deleteEnrollmentService = async (id) => {
  // Soft delete
  const { data, error } = await supabase
    .from("enrollments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};
