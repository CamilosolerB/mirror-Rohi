import { useState } from "react";

/** Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - patientData: { nombre: string, apellido: string, email: string }
 */
export default function MedicalHistoryModal({ isOpen, onClose, patientData = {} }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Datos simulados
  const [medicalRecords] = useState([
    {
      id: "1",
      fecha: "2024-01-10",
      tipo: "Consulta General",
      doctor: "Dr. María González",
      especialidad: "Cardiología",
      diagnostico: "Hipertensión arterial leve",
      tratamiento: "Medicación antihipertensiva, dieta baja en sodio",
      estado: "completado",
      archivo: "consulta_cardiologia_010124.pdf",
    },
    {
      id: "2",
      fecha: "2024-01-05",
      tipo: "Examen de Laboratorio",
      doctor: "Dr. Carlos Ruiz",
      especialidad: "Medicina Interna",
      diagnostico: "Perfil lipídico alterado",
      tratamiento: "Estatinas, ejercicio regular",
      estado: "completado",
      archivo: "laboratorio_050124.pdf",
    },
    {
      id: "3",
      fecha: "2023-12-20",
      tipo: "Radiografía",
      doctor: "Dra. Ana López",
      especialidad: "Radiología",
      diagnostico: "Radiografía de tórax normal",
      tratamiento: "No requiere tratamiento",
      estado: "completado",
      archivo: "radiografia_201223.pdf",
    },
    {
      id: "4",
      fecha: "2024-01-20",
      tipo: "Control",
      doctor: "Dr. María González",
      especialidad: "Cardiología",
      diagnostico: "Seguimiento hipertensión",
      tratamiento: "Continuar medicación actual",
      estado: "en_proceso",
    },
  ]);

  const filteredRecords = medicalRecords.filter((record) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      record.diagnostico.toLowerCase().includes(q) ||
      record.doctor.toLowerCase().includes(q) ||
      record.especialidad.toLowerCase().includes(q);

    const matchesType = filterType === "todos" || record.tipo === filterType;
    const matchesStatus = filterStatus === "todos" || record.estado === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusClasses = (status) => {
    switch (status) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "en_proceso":
        return "bg-blue-100 text-blue-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    if (status === "completado") return "Completado";
    if (status === "en_proceso") return "En Proceso";
    if (status === "pendiente") return "Pendiente";
    return status;
  };

  const handleDownloadPDF = async () => {
    if (!patientData.nombre || !patientData.apellido) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Simular descarga
      const element = document.createElement("a");
      const file = new Blob([`Historial Médico - ${patientData.nombre} ${patientData.apellido}`], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      element.download = `historial_medico_${patientData.nombre}_${patientData.apellido}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  const handleSendEmail = async () => {
    if (!patientData.email || !patientData.nombre || !patientData.apellido) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientData.email)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="flex h-full w-full items-stretch">
        <div className="mx-auto h-full w-full max-w-[100vw] bg-white">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Historial Médico</h2>
              <button
                onClick={onClose}
                className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-6 px-6 pb-10 pt-6 max-w-[1200px] mx-auto">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
                  <input
                    className="w-full rounded-lg border px-3 py-2 pl-9 outline-none focus:border-violet-600"
                    placeholder="Buscar en historial..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600 w-[180px]"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="Consulta General">Consulta General</option>
                  <option value="Examen de Laboratorio">Laboratorio</option>
                  <option value="Radiografía">Radiografía</option>
                  <option value="Control">Control</option>
                </select>

                <select
                  className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600 w-[150px]"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="completado">Completado</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="rounded-lg px-4 py-2 font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60"
                >
                  {isDownloading ? "Descargando..." : "Descargar PDF"}
                </button>

                <button
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="rounded-lg px-4 py-2 font-medium border border-violet-500 text-violet-600 hover:bg-violet-50 disabled:opacity-60"
                >
                  {isSending ? "Enviando..." : "Enviar por correo"}
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div className="border rounded-lg overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Doctor</th>
                    <th className="px-4 py-3 font-semibold">Especialidad</th>
                    <th className="px-4 py-3 font-semibold">Diagnóstico</th>
                    <th className="px-4 py-3 font-semibold">Tratamiento</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{new Date(r.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{r.tipo}</td>
                      <td className="px-4 py-3">{r.doctor}</td>
                      <td className="px-4 py-3">{r.especialidad}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="truncate" title={r.diagnostico}>{r.diagnostico}</div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="truncate" title={r.tratamiento}>{r.tratamiento}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(r.estado)}`}>
                          {getStatusText(r.estado)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.archivo ? (
                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            onClick={() => alert(`Descargar: ${r.archivo}`)}
                          >
                            Ver
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No disponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron registros que coincidan con los filtros aplicados.
              </div>
            )}
          </div>

          {/* Toasters simples */}
          {showSuccess && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[999]">
              Operación completada correctamente
            </div>
          )}
          {showError && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[999]">
              Hubo un error, intenta de nuevo más tarde
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
