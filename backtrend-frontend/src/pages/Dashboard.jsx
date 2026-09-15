import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isProfessor, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Backtrend - Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Bienvenido, {user?.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Materias</h3>
            <p className="text-gray-600 mb-4">Gestionar materias del sistema</p>
            <Link to="/subjects" className="text-blue-600 hover:underline">
              Ver Materias →
            </Link>
          </div>

          {isProfessor && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Usuarios</h3>
              <p className="text-gray-600 mb-4">
                Gestionar alumnos y profesores
              </p>
              <Link to="/users" className="text-blue-600 hover:underline">
                Ver Usuarios →
              </Link>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Inscripciones</h3>
            <p className="text-gray-600 mb-4">
              Gestionar inscripciones a materias
            </p>
            <Link to="/enrollments" className="text-blue-600 hover:underline">
              Ver Inscripciones →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
