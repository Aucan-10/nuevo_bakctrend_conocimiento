import { supabase } from "../config/supabase.js";

// Función auxiliar para validar que el profesor existe y tiene el rol correcto
const validateProfessor = async (professor_id) => {
  if (professor_id === undefined || professor_id === null) return true;

  const { data: professor, error } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", professor_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!professor) throw new Error("Professor not found");
  if (professor.role !== "PROFESSOR")
    throw new Error("User is not a professor");

  return true;
};

export const createSubjectService = async ({
  name,
  description,
  professor_id,
}) => {
  // Validar profesor si se proporciona
  if (professor_id !== undefined && professor_id !== null) {
    await validateProfessor(professor_id);
  }

  // Insertar materia
  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name,
      description,
      professor_id: professor_id || null,
    })
    .select("id, name, description, professor_id, created_at")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const getAllSubjectsService = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, description, professor_id, created_at, updated_at")
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const getSubjectsByProfessorService = async (professor_id) => {
  // Verificar que el profesor existe
  const { data: professor } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", professor_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!professor) {
    return []; // Si no existe el profesor, devolver array vacío
  }

  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, description, professor_id, created_at, updated_at")
    .eq("professor_id", professor_id)
    .is("deleted_at", null)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const updateSubjectService = async (
  id,
  { name, description, professor_id }
) => {
  // Verificar que la materia existe
  const { data: existingSubject } = await supabase
    .from("subjects")
    .select("id")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!existingSubject) return null;

  // Preparar datos a actualizar
  const updateData = {};
  if (name) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (professor_id !== undefined) {
    if (professor_id === null) {
      updateData.professor_id = null; // Permite quitar el profesor
    } else {
      await validateProfessor(professor_id);
      updateData.professor_id = professor_id;
    }
  }

  // Actualizar materia
  const { data, error } = await supabase
    .from("subjects")
    .update(updateData)
    .eq("id", id)
    .select("id, name, description, professor_id, updated_at")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const deleteSubjectService = async (id) => {
  // Soft delete: actualizar deleted_at
  const { data, error } = await supabase
    .from("subjects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const getProfessorBySubjectService = async (subject_id) => {
  // Obtener la materia
  const { data: subject, error } = await supabase
    .from("subjects")
    .select("id, professor_id")
    .eq("id", subject_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!subject) return null;
  if (!subject.professor_id) return null;

  // Obtener el profesor
  const { data: professor, error: profError } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", subject.professor_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (profError) throw new Error(profError.message);

  return professor;
};

export const getSubjectsByStudentService = async (student_id) => {
  // Verificar que el estudiante existe y tiene el rol correcto
  const { data: student } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", student_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!student || student.role !== "STUDENT") {
    return [];
  }

  // Obtener las inscripciones con datos de la materia
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      "id, subject_id, grade, subjects(id, name, description, professor_id)"
    )
    .eq("student_id", student_id)
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  return data;
};

// NUEVA FUNCIÓN: Obtener estudiantes de una materia
export const getStudentsBySubjectService = async (subject_id) => {
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

  // Obtener las inscripciones con datos del estudiante
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, grade, created_at, users:student_id(id, name, email, role)")
    .eq("subject_id", subject_id)
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  // Transformar la respuesta
  return data.map((enrollment) => ({
    enrollment_id: enrollment.id,
    grade: enrollment.grade,
    enrolled_at: enrollment.created_at,
    student: enrollment.users,
  }));
};

// NUEVA FUNCIÓN: Obtener materia completa con profesor y estudiantes
export const getAllSubjectsWithDetailsService = async (subject_id) => {
  // 1. Obtener la materia
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("id, name, description, professor_id, created_at, updated_at")
    .eq("id", subject_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (subjectError) throw new Error(subjectError.message);
  if (!subject) return null;

  // 2. Obtener el profesor (si tiene)
  let professor = null;
  if (subject.professor_id) {
    const { data: profData } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", subject.professor_id)
      .is("deleted_at", null)
      .maybeSingle();
    professor = profData;
  }

  // 3. Obtener los estudiantes inscriptos con sus notas
  const { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select("id, grade, created_at, users:student_id(id, name, email, role)")
    .eq("subject_id", subject_id)
    .is("deleted_at", null);

  if (enrollError) throw new Error(enrollError.message);

  // 4. Armar la respuesta completa
  return {
    ...subject,
    professor,
    students: enrollments
      ? enrollments.map((e) => ({
          enrollment_id: e.id,
          grade: e.grade,
          enrolled_at: e.created_at,
          student: e.users,
        }))
      : [],
  };
};
