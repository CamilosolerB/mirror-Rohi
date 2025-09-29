import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { useAuthStore } from "../hooks/useLoginStore";

export default function Singup_form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cedula: "",
    telefono: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtén la función startRegister desde el store
  const startRegister = useAuthStore((state) => state.startRegister);
  const navigate = useNavigate(); // Obtén navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el estado de carga
    setError(""); // Limpia errores previos

    console.log(useAuthStore.getState()); // Verifica el estado completo del store
    try {
      // Llama a startRegister con los datos del formulario y navigate
      await startRegister(formData, navigate);
      console.log("startRegister fue llamado correctamente");
    } catch (err) {
      console.error("Error en startRegister:", err);
      setError(err.message || "Error al registrar");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-[#9083D5]">Crear cuenta</h2>
        <p className="text-sm text-gray-600">Completa los campos para registrarte.</p>
      </div>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <div className="space-y-6">
        {/* Nombre completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            name="name"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
          />
        </div>

        {/* Cédula y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cédula</label>
            <input
              type="text"
              name="cedula"
              placeholder="1234567890"
              value={formData.cedula}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              placeholder="3001234567"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
            />
          </div>
        </div>

        {/* Contraseña y Confirmar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              placeholder="••••••••"
              value={formData.confirm}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
            />
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className={`w-full rounded-lg py-2 font-medium text-white transition duration-200 ${
          loading
            ? "bg-[#b5aef0] cursor-not-allowed"
            : "bg-[#9083D5] hover:bg-[#7f72c2]"
        }`}
        type="submit"
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      <div className="text-center text-sm mt-4">
        <a href="/" className="text-[#9083D5] hover:underline">
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      </div>
    </form>
  );
}
