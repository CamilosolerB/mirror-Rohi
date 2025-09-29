import Singup_form from "../components/Singup_form.jsx";
import mimimi from "../../../assets/img/mimimi.png";

export const Singup = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      {/* Contenedor central blanco */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Título centrado arriba */}
        <div className="w-full text-center py-8 px-6 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-[#9083D5]">
            Registro en ROHI IPS
          </h1>
        </div>

        {/* Contenido dividido en dos columnas (imagen izquierda) */}
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Columna izquierda: imagen */}
          <div className="flex items-center justify-center p-8 bg-white">
            <img
              src={mimimi}
              alt="Ilustración registro ROHI IPS"
              className="object-contain w-full h-auto max-w-[420px] md:max-w-[520px] max-h-[70vh]"
            />
          </div>

          {/* Columna derecha: formulario */}
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <Singup_form />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
