import { useState } from "react";

export default function Singup_form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, cedula, telefono, password }),
      });

      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error?.message || "Error al registrar");
      }

      alert("¡Registro exitoso!");
    } catch (err) {
      setError(err.message || "Error de registro");
    } finally {
      setLoading(false);
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

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-6">
        {/* Nombre completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              placeholder="1234567890"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="tel"
              placeholder="3001234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
