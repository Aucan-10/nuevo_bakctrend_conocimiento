import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔵 Intentando loguear con:", email);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("🟢 Respuesta completa del servidor:", response.data);

      // Adaptamos la extracción por si tu backend lo devuelve de forma ligeramente distinta
      const token = response.data.token || response.data.accessToken;
      const userData = response.data.user || response.data;

      if (!token) {
        throw new Error("El servidor no devolvió un token válido");
      }

      console.log("✅ Token y Usuario obtenidos. Redirigiendo...");
      login(userData, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("🔴 Error detallado:", err);

      // Mostramos el mensaje exacto del backend (ej: "Demasiadas solicitudes")
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Credenciales incorrectas o error del servidor";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">¿No tienes cuenta? </span>
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-bold"
        >
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};

export default Login;
