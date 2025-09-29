import { useState } from "react";
import { useAuthStore } from "../hooks/useLoginStore";
import { useNavigate } from "react-router-dom";
export default function Verifica_codigo() {

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE = import.meta.env.VITE_API_BASE_URL;
  const startConfirmCode = useAuthStore((state) => state.startConfirmCode);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await startConfirmCode({ code: codigo }, navigate);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Código de verificación</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border px-4 py-2 text-center tracking-widest text-lg outline-none focus:border-[#9083D5] focus:ring-2 focus:ring-[#9083D5]"
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
        {loading ? "Verificando..." : "Verificar código"}
      </button>

      <div className="text-center text-sm mt-4">
        <a href="/olvido" className="text-[#9083D5] hover:underline">
          ¿No recibiste el código?
        </a>
      </div>
    </form>
  );
}
