import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireProfessor = false }) => {
  const { user, loading, isProfessor } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfessor && !isProfessor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">
          Acceso denegado. Se requieren permisos de profesor.
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
