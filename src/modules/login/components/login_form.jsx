import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error?.message || "Credenciales inválidas");
      }

      if (data?.token) localStorage.setItem("token", data.token);

      alert("¡Inicio de sesión exitoso!");
    } catch (err) {
      setError(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow p-6 space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#9083D5]">Iniciar sesión</h2>
        <p className="text-sm text-gray-600">
          Usa tu correo y contraseña registrada.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Correo</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
        />
      </div>

      <button
        disabled={loading}
        className={`w-full rounded-lg py-2 font-medium text-white transition duration-200 ${
          loading
            ? "bg-[#b5aef0] cursor-not-allowed"
            : "bg-[#9083D5] hover:bg-[#7f72c2]"
        }`}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-between text-sm">
        <a href="/Singup" className="text-[#9083D5] hover:underline">
          Crear cuenta
        </a>
        <a href="/olvido" className="text-[#9083D5] hover:underline">
          Olvidé mi contraseña
        </a>
      </div>
    </form>
  );
}
