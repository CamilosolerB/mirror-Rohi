import Verifica_codigo from "../components/Verifica_codigo.jsx";

export const Verificar = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-extrabold text-[#9083D5]">Verificación en 2 pasos</h1>
          <p className="text-sm text-gray-600">
            Ingresa el código de 6 dígitos que enviamos a tu correo.
          </p>
        </div>
        <Verifica_codigo />
      </div>
    </div>
  );
};
