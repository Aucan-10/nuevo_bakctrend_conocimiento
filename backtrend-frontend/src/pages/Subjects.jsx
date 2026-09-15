import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    professor_id: "",
  });
  const { isProfessor } = useAuth();
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditId(subject.id);
      setFormData({
        name: subject.name,
        description: subject.description || "",
        professor_id: subject.professor_id || "",
      });
    } else {
      setEditId(null);
      setFormData({ name: "", description: "", professor_id: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        professor_id: Number(formData.professor_id),
      };
      if (editId) await api.put(`/api/subjects/${editId}`, payload);
      else await api.post("/api/subjects", payload);
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      alert(
        "Error al guardar: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta materia?")) return;
    try {
      await api.delete(`/api/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Materias</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Volver
            </button>
            {isProfessor && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Nueva Materia
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Profesor ID
                </th>
                {isProfessor && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{s.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {s.name}
                  </td>
                  <td className="px-6 py-4">{s.description || "-"}</td>
                  <td className="px-6 py-4">{s.professor_id || "-"}</td>
                  {isProfessor && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(s)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Editar" : "Crear"} Materia
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
                required
              />
              <textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="number"
                placeholder="ID del Profesor"
                value={formData.professor_id}
                onChange={(e) =>
                  setFormData({ ...formData, professor_id: e.target.value })
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Subjects;
