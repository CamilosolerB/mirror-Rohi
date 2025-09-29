import { useState } from "react";

/** Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 */
export default function ResultsDocumentsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("documentos");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todos");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentDetail, setShowDocumentDetail] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [documents, setDocuments] = useState([
    {
      id: "1",
      nombre: "Hemograma Completo",
      tipo: "laboratorio",
      categoria: "Análisis de Sangre",
      fecha: "2024-01-15",
      doctor: "Dr. María González",
      especialidad: "Hematología",
      institucion: "ROHI IPS - Sede Norte",
      estado: "disponible",
      prioridad: "normal",
      tamaño: "245 KB",
      formato: "pdf",
      descripcion:
        "Análisis completo de sangre con conteo de células y química sanguínea",
      resultados: [
        { parametro: "Hemoglobina", valor: "14.2", referencia: "12.0-15.5 g/dL", estado: "normal" },
        { parametro: "Hematocrito", valor: "42.1", referencia: "36.0-46.0%", estado: "normal" },
        { parametro: "Leucocitos", valor: "7.8", referencia: "4.5-11.0 x10³/μL", estado: "normal" },
        { parametro: "Plaquetas", valor: "285", referencia: "150-450 x10³/μL", estado: "normal" },
        { parametro: "Glucosa", valor: "118", referencia: "70-100 mg/dL", estado: "alto" },
      ],
      favorito: true,
      compartido: false,
    },
    {
      id: "2",
      nombre: "Radiografía de Tórax",
      tipo: "imagen",
      categoria: "Radiología",
      fecha: "2024-01-12",
      doctor: "Dra. Ana López",
      especialidad: "Radiología",
      institucion: "ROHI IPS - Sede Centro",
      estado: "disponible",
      prioridad: "normal",
      tamaño: "2.1 MB",
      formato: "jpg",
      descripcion: "Radiografía PA y lateral de tórax para evaluación pulmonar",
      favorito: false,
      compartido: true,
      notas: "Campos pulmonares libres, silueta cardíaca normal",
    },
    {
      id: "3",
      nombre: "Electrocardiograma",
      tipo: "informe",
      categoria: "Cardiología",
      fecha: "2024-01-10",
      doctor: "Dr. Carlos Ruiz",
      especialidad: "Cardiología",
      institucion: "ROHI IPS - Sede Sur",
      estado: "disponible",
      prioridad: "urgente",
      tamaño: "156 KB",
      formato: "pdf",
      descripcion: "ECG de 12 derivaciones en reposo",
      favorito: true,
      compartido: false,
      notas: "Ritmo sinusal normal, sin alteraciones significativas",
    },
    {
      id: "4",
      nombre: "Perfil Lipídico",
      tipo: "laboratorio",
      categoria: "Análisis de Sangre",
      fecha: "2024-01-08",
      doctor: "Dr. Luis Martín",
      especialidad: "Medicina Interna",
      institucion: "ROHI IPS - Sede Norte",
      estado: "disponible",
      prioridad: "normal",
      tamaño: "198 KB",
      formato: "pdf",
      descripcion: "Análisis de colesterol total, HDL, LDL y triglicéridos",
      resultados: [
        { parametro: "Colesterol Total", valor: "245", referencia: "<200 mg/dL", estado: "alto" },
        { parametro: "HDL", valor: "38", referencia: ">40 mg/dL", estado: "bajo" },
        { parametro: "LDL", valor: "165", referencia: "<100 mg/dL", estado: "alto" },
        { parametro: "Triglicéridos", valor: "210", referencia: "<150 mg/dL", estado: "alto" },
      ],
      favorito: false,
      compartido: false,
    },
    {
      id: "5",
      nombre: "Resonancia Magnética Cerebral",
      tipo: "imagen",
      categoria: "Neuroimagen",
      fecha: "2024-01-05",
      doctor: "Dra. Carmen Vega",
      especialidad: "Neurología",
      institucion: "ROHI IPS - Sede Centro",
      estado: "procesando",
      prioridad: "urgente",
      tamaño: "15.2 MB",
      formato: "dcm",
      descripcion: "RM cerebral con contraste para evaluación neurológica",
      favorito: false,
      compartido: false,
    },
    {
      id: "6",
      nombre: "Certificado Médico",
      tipo: "certificado",
      categoria: "Documentos Oficiales",
      fecha: "2024-01-03",
      doctor: "Dr. María González",
      especialidad: "Medicina General",
      institucion: "ROHI IPS - Sede Norte",
      estado: "disponible",
      prioridad: "normal",
      tamaño: "89 KB",
      formato: "pdf",
      descripcion: "Certificado médico para incapacidad laboral",
      favorito: false,
      compartido: false,
    },
    {
      id: "7",
      nombre: "Receta Médica Digital",
      tipo: "receta",
      categoria: "Prescripciones",
      fecha: "2024-01-01",
      doctor: "Dr. Carlos Ruiz",
      especialidad: "Cardiología",
      institucion: "ROHI IPS - Sede Sur",
      estado: "disponible",
      prioridad: "normal",
      tamaño: "67 KB",
      formato: "pdf",
      descripcion:
        "Prescripción de medicamentos para tratamiento cardiovascular",
      favorito: true,
      compartido: false,
    },
    {
      id: "8",
      nombre: "Biopsia de Piel",
      tipo: "informe",
      categoria: "Anatomía Patológica",
      fecha: "2023-12-28",
      doctor: "Dr. Roberto Silva",
      especialidad: "Dermatología",
      institucion: "ROHI IPS - Sede Centro",
      estado: "disponible",
      prioridad: "critico",
      tamaño: "234 KB",
      formato: "pdf",
      descripcion: "Resultado de biopsia de lesión cutánea",
      favorito: true,
      compartido: true,
      notas: "Lesión benigna, seguimiento en 6 meses",
    },
  ]);

  const categories = [
    { id: "todos", nombre: "Todos los Documentos", color: "#9083D5",
      count: documents.length, icon: "📁" },
    { id: "laboratorio", nombre: "Análisis de Laboratorio", color: "#10B981",
      count: documents.filter(d => d.tipo === "laboratorio").length, icon: "📊" },
    { id: "imagen", nombre: "Imágenes Médicas", color: "#F59E0B",
      count: documents.filter(d => d.tipo === "imagen").length, icon: "🖼️" },
    { id: "informe", nombre: "Informes Médicos", color: "#3B82F6",
      count: documents.filter(d => d.tipo === "informe").length, icon: "📄" },
    { id: "receta", nombre: "Recetas", color: "#8B5CF6",
      count: documents.filter(d => d.tipo === "receta").length, icon: "📝" },
    { id: "certificado", nombre: "Certificados", color: "#EF4444",
      count: documents.filter(d => d.tipo === "certificado").length, icon: "✅" },
  ];

  const getStatusClass = (s) =>
    s === "disponible" ? "bg-green-100 text-green-800"
    : s === "procesando" ? "bg-yellow-100 text-yellow-800"
    : "bg-gray-100 text-gray-800";

  const getPriorityClass = (p) =>
    p === "critico" ? "bg-red-100 text-red-800"
    : p === "urgente" ? "bg-orange-100 text-orange-800"
    : "bg-blue-100 text-blue-800";

  const fileBadge = (fmt) =>
    fmt === "pdf" ? "PDF" :
    fmt === "jpg" || fmt === "png" ? "IMG" :
    fmt === "xlsx" ? "XLSX" :
    fmt === "dcm" ? "DCM" : "FILE";

  const toggleFavorite = (id) => {
    setDocuments(prev => prev.map(d => d.id === id ? ({ ...d, favorito: !d.favorito }) : d));
  };

  const handleDownload = (doc) => {
    const a = document.createElement("a");
    const blob = new Blob([`Documento: ${doc.nombre}`], { type: "text/plain" });
    a.href = URL.createObjectURL(blob);
    a.download = `${doc.nombre}.${doc.formato}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = (doc) => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: doc.nombre, text: doc.descripcion, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  const getFilteredDocuments = () =>
    documents.filter((doc) => {
      const matchesCategory = selectedCategory === "todos" || doc.tipo === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        doc.nombre.toLowerCase().includes(q) ||
        doc.doctor.toLowerCase().includes(q) ||
        doc.especialidad.toLowerCase().includes(q) ||
        doc.descripcion.toLowerCase().includes(q);
      const matchesDate = !dateFilter || doc.fecha.includes(dateFilter);
      const matchesStatus = statusFilter === "todos" || doc.estado === statusFilter;
      const matchesPriority = priorityFilter === "todos" || doc.prioridad === priorityFilter;
      const matchesFav = !showOnlyFavorites || doc.favorito;
      return matchesCategory && matchesSearch && matchesDate && matchesStatus && matchesPriority && matchesFav;
    });

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay + contenedor principal */}
      <div className="fixed inset-0 z-50 bg-black/60">
        <div className="flex h-full w-full items-stretch">
          <div className="mx-auto h-full w-full max-w-7xl bg-white rounded-none md:rounded-lg md:my-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-violet-600">📄</span>
                Resultados y Documentos
              </h2>
              <button
                onClick={onClose}
                className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Tabs simples */}
            <div className="px-6 pt-4">
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 p-1 text-sm">
                {["documentos","resultados","categorias"].map(id => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={
                      "py-2 rounded-md font-medium " +
                      (activeTab === id ? "bg-white shadow text-violet-700" : "text-gray-600")
                    }
                  >
                    {id === "documentos" ? "Documentos" : id === "resultados" ? "Resultados" : "Categorías"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Tab: Documentos */}
              {activeTab === "documentos" && (
                <>
                  {/* Controles */}
                  <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
                      <input
                        className="w-64 rounded-lg border px-3 py-2 pl-9 outline-none focus:border-violet-600"
                        placeholder="Buscar documentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <select
                      className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600 w-48"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({c.count})
                        </option>
                      ))}
                    </select>

                    <input
                      type="month"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600 w-40"
                    />

                    <select
                      className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600 w-40"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="disponible">Disponible</option>
                      <option value="procesando">Procesando</option>
                      <option value="pendiente">Pendiente</option>
                    </select>

                    <select
                      className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600 w-40"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="todos">Todas las prioridades</option>
                      <option value="critico">Crítico</option>
                      <option value="urgente">Urgente</option>
                      <option value="normal">Normal</option>
                    </select>

                    <label className="flex items-center gap-2 ml-auto text-sm">
                      <input
                        type="checkbox"
                        checked={showOnlyFavorites}
                        onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                      />
                      Solo favoritos
                    </label>

                    <button
                      className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    >
                      {viewMode === "grid" ? "Vista Lista" : "Vista Cuadrícula"}
                    </button>
                    <button
                      className="rounded-lg px-3 py-2 bg-violet-600 text-white hover:bg-violet-700"
                      onClick={() => alert("Subir documento (simulado)")}
                    >
                      ⬆️ Subir Documento
                    </button>
                  </div>

                  {/* Grid/List */}
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {getFilteredDocuments().map((d) => (
                        <div key={d.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl" title={d.formato}>
                                {d.formato === "pdf" ? "📄" : d.formato === "jpg" || d.formato === "png" ? "🖼️" :
                                 d.formato === "xlsx" ? "📊" : d.formato === "dcm" ? "🧠" : "📁"}
                              </span>
                              <button
                                onClick={() => toggleFavorite(d.id)}
                                className={"text-sm " + (d.favorito ? "text-yellow-500" : "text-gray-400")}
                                title="Favorito"
                              >
                                ★
                              </button>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(d.estado)}`}>{d.estado}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(d.prioridad)}`}>{d.prioridad}</span>
                            </div>
                          </div>

                          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{d.nombre}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{d.descripcion}</p>

                          <div className="space-y-1 text-xs text-gray-500 mb-3">
                            <div>📅 {new Date(d.fecha).toLocaleDateString()}</div>
                            <div>👩‍⚕️ {d.doctor}</div>
                            <div>🏥 {d.institucion}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{d.tamaño} · {fileBadge(d.formato)}</span>
                            <div className="flex items-center gap-2">
                              <button
                                className="px-2 py-1 rounded hover:bg-gray-100"
                                onClick={() => { setSelectedDocument(d); setShowDocumentDetail(true); }}
                                title="Ver"
                              >👁️</button>
                              <button
                                className="px-2 py-1 rounded hover:bg-gray-100"
                                onClick={() => handleDownload(d)}
                                title="Descargar"
                              >⬇️</button>
                              <button
                                className="px-2 py-1 rounded hover:bg-gray-100"
                                onClick={() => handleShare(d)}
                                title="Compartir"
                              >🔗</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getFilteredDocuments().map((d) => (
                        <div key={d.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-2xl">
                                {d.formato === "pdf" ? "📄" : d.formato === "jpg" || d.formato === "png" ? "🖼️" :
                                 d.formato === "xlsx" ? "📊" : d.formato === "dcm" ? "🧠" : "📁"}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-gray-900">{d.nombre}</h4>
                                  <button
                                    onClick={() => toggleFavorite(d.id)}
                                    className={"text-sm " + (d.favorito ? "text-yellow-500" : "text-gray-400")}
                                    title="Favorito"
                                  >
                                    ★
                                  </button>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(d.estado)}`}>{d.estado}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(d.prioridad)}`}>{d.prioridad}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{d.descripcion}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                                  <span>📅 {new Date(d.fecha).toLocaleDateString()}</span>
                                  <span>👩‍⚕️ {d.doctor}</span>
                                  <span>🧪 {d.especialidad}</span>
                                  <span>⬇️ {d.tamaño}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50"
                                onClick={() => { setSelectedDocument(d); setShowDocumentDetail(true); }}
                              >
                                Ver
                              </button>
                              <button
                                className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50"
                                onClick={() => handleDownload(d)}
                              >
                                Descargar
                              </button>
                              <button
                                className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50"
                                onClick={() => handleShare(d)}
                              >
                                Compartir
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {getFilteredDocuments().length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-2">📄</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron documentos</h3>
                      <p className="text-gray-500">Ajusta los filtros o sube un nuevo documento.</p>
                    </div>
                  )}
                </>
              )}

              {/* Tab: Resultados (solo documentos con tabla de resultados) */}
              {activeTab === "resultados" && (
                <div className="space-y-4">
                  {documents.filter(d => d.resultados && d.resultados.length > 0).map((d) => (
                    <div key={d.id} className="border rounded-lg">
                      <div className="p-4 border-b flex items-center justify-between">
                        <div className="font-semibold flex items-center gap-2">
                          <span className="text-green-600">📊</span>
                          {d.nombre}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${getStatusClass(d.estado)}`}>{d.estado}</span>
                          <span className="text-gray-500">{new Date(d.fecha).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {d.resultados.map((r, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{r.parametro}</div>
                              <div className="text-xs text-gray-600">Referencia: {r.referencia}</div>
                            </div>
                            <div className="text-right">
                              <div className={
                                "text-lg font-semibold " +
                                (r.estado === "normal" ? "text-green-600" :
                                  r.estado === "critico" ? "text-red-600" : "text-yellow-600")
                              }>
                                {r.valor}
                              </div>
                              <span className={
                                "px-2 py-1 rounded-full text-xs " +
                                (r.estado === "normal" ? "bg-green-100 text-green-800" :
                                  r.estado === "critico" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800")
                              }>
                                {r.estado}
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Doctor:</span> {d.doctor} — {d.especialidad}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50"
                              onClick={() => handleDownload(d)}
                            >
                              Descargar
                            </button>
                            <button
                              className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50"
                              onClick={() => { setSelectedDocument(d); setShowDocumentDetail(true); }}
                            >
                              Ver completo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Categorías */}
              {activeTab === "categorias" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        className="border rounded-lg p-6 text-left hover:shadow-md transition-shadow"
                        onClick={() => { setSelectedCategory(c.id); setActiveTab("documentos"); }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-lg grid place-items-center text-white text-xl"
                            style={{ backgroundColor: c.color }}
                          >
                            {c.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{c.nombre}</div>
                            <div className="text-sm text-gray-600">{c.count} documentos</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-violet-600">{documents.length}</div>
                        <div className="text-sm text-gray-600">Total Documentos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {documents.filter(d => d.estado === "disponible").length}
                        </div>
                        <div className="text-sm text-gray-600">Disponibles</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {documents.filter(d => d.favorito).length}
                        </div>
                        <div className="text-sm text-gray-600">Favoritos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {documents.filter(d => d.compartido).length}
                        </div>
                        <div className="text-sm text-gray-600">Compartidos</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal detalle */}
      {showDocumentDetail && selectedDocument && (
        <div className="fixed inset-0 z-[60] bg-black/60">
          <div className="flex h-full w-full items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-xl">
                    {selectedDocument.formato === "pdf" ? "📄" :
                     selectedDocument.formato === "jpg" || selectedDocument.formato === "png" ? "🖼️" :
                     selectedDocument.formato === "xlsx" ? "📊" :
                     selectedDocument.formato === "dcm" ? "🧠" : "📁"}
                  </span>
                  {selectedDocument.nombre}
                </h3>
                <button
                  onClick={() => setShowDocumentDetail(false)}
                  className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100"
                >✕</button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Info label="Tipo" value={selectedDocument.tipo} />
                  <Info label="Fecha" value={new Date(selectedDocument.fecha).toLocaleDateString()} />
                  <Info label="Doctor" value={selectedDocument.doctor} />
                  <Info label="Especialidad" value={selectedDocument.especialidad} />
                  <Info label="Institución" value={selectedDocument.institucion} />
                  <Info label="Tamaño" value={selectedDocument.tamaño} />
                </div>

                <InfoBlock label="Descripción" value={selectedDocument.descripcion} />
                {selectedDocument.notas && <InfoBlock label="Notas" value={selectedDocument.notas} />}

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(selectedDocument.estado)}`}>
                    {selectedDocument.estado}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(selectedDocument.prioridad)}`}>
                    {selectedDocument.prioridad}
                  </span>
                  {selectedDocument.favorito && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Favorito</span>
                  )}
                  {selectedDocument.compartido && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Compartido</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    className="flex-1 rounded-lg px-4 py-2 bg-violet-600 text-white hover:bg-violet-700"
                    onClick={() => handleDownload(selectedDocument)}
                  >
                    Descargar
                  </button>
                  <button
                    className="flex-1 rounded-lg px-4 py-2 border bg-white hover:bg-gray-50"
                    onClick={() => handleShare(selectedDocument)}
                  >
                    Compartir
                  </button>
                  <button
                    className="rounded-lg px-4 py-2 border bg-white hover:bg-gray-50"
                    onClick={() => window.print()}
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Helpers UI */
function Info({ label, value }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}
function InfoBlock({ label, value }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
