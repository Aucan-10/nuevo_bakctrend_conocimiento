import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
const fetchEnrollments = async () => {
  try {
    const res = await api.get("/api/enrollments");
    setEnrollments(res.data);
  } catch (err) {
    console.error("Error al cargar inscripciones (Backend falló):", err);
    setEnrollments([]); // Deja la lista vacía en lugar de romper la app
  } finally {
    setLoading(false);
  }
};
const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ student_id: "", subject_id: "" });
  const { isProfessor } = useAuth();
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/api/enrollments");
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/enrollments", {
        student_id: Number(formData.student_id),
        subject_id: Number(formData.subject_id),
      });
      setShowModal(false);
      setFormData({ student_id: "", subject_id: "" });
      fetchEnrollments();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar inscripción?")) return;
    try {
      await api.delete(`/api/enrollments/${id}`);
      fetchEnrollments();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Inscripciones</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Volver
            </button>
            {isProfessor && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Nueva Inscripción
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Alumno ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Materia ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nota
                </th>
                {isProfessor && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((e) => (
                <tr key={e.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{e.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.student_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.subject_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.grade ?? "-"}
                  </td>
                  {isProfessor && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nueva Inscripción</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                placeholder="ID del Alumno"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
                required
              />
              <input
                type="number"
                placeholder="ID de la Materia"
                value={formData.subject_id}
                onChange={(e) =>
                  setFormData({ ...formData, subject_id: e.target.value })
                }
                className="w-full border p-2 rounded mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Inscribir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Enrollments;
