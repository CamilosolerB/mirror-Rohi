import { useState } from "react";

/** Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 */
export default function AppointmentsModal({ isOpen, onClose }) {
  const [viewMode, setViewMode] = useState("week"); // "week" | "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState("calendario"); // calendario | historial | agendar | resumen
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    servicio: "",
    fecha: "",
    hora: "",
    modalidad: "presencial",
    motivo: "",
  });

  // Datos simulados
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      date: "2024-01-15",
      time: "10:00",
      doctor: "Dr. María González",
      specialty: "Cardiología",
      status: "programada",
      type: "Consulta general",
      modalidad: "presencial",
      ubicacion: "Sede Norte - Consultorio 205",
      motivo: "Control rutinario",
      instrucciones: "Traer exámenes de laboratorio recientes",
    },
    {
      id: "2",
      date: "2024-01-18",
      time: "14:30",
      doctor: "Dr. Carlos Ruiz",
      specialty: "Neurología",
      status: "reprogramada",
      type: "Control",
      modalidad: "virtual",
      enlaceVirtual: "https://meet.rohi-ips.com/neurology-123",
      motivo: "Seguimiento tratamiento",
      instrucciones: "Tener lista la medicación actual",
    },
    {
      id: "3",
      date: "2024-01-22",
      time: "09:15",
      doctor: "Dra. Ana López",
      specialty: "Dermatología",
      status: "programada",
      type: "Revisión",
      modalidad: "presencial",
      ubicacion: "Sede Centro - Consultorio 102",
      motivo: "Revisión lunar",
      instrucciones: "No aplicar cremas 24h antes",
    },
    {
      id: "4",
      date: "2024-01-10",
      time: "16:00",
      doctor: "Dr. Luis Martín",
      specialty: "Medicina General",
      status: "completada",
      type: "Consulta",
      modalidad: "presencial",
      ubicacion: "Sede Sur - Consultorio 301",
      motivo: "Chequeo anual",
      instrucciones: "Ayuno de 12 horas",
    },
    {
      id: "5",
      date: "2024-01-08",
      time: "11:30",
      doctor: "Dra. Carmen Vega",
      specialty: "Ginecología",
      status: "cancelada",
      type: "Control",
      modalidad: "presencial",
      ubicacion: "Sede Norte - Consultorio 150",
      motivo: "Control anual",
      instrucciones: "Traer citología previa",
    },
  ]);

  const serviciosDisponibles = [
    "Medicina General",
    "Cardiología",
    "Neurología",
    "Dermatología",
    "Ginecología",
    "Pediatría",
    "Oftalmología",
    "Ortopedia",
  ];

  const horariosDisponibles = [
    "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
    "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
  ];

  // ------ Calendario helpers ------
  const handleDragStart = (appointment) => setDraggedAppointment(appointment);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, newDate) => {
    e.preventDefault();
    if (draggedAppointment) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === draggedAppointment.id ? { ...apt, date: newDate } : apt))
      );
      setDraggedAppointment(null);
      setSuccessMessage("Cita reprogramada correctamente");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    }
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i); days.push(d);
    }
    return days;
    // Nota: Semana inicia domingo; ajusta si quieres lunes.
  };

  const getMonthDays = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => new Date(y, m, i + 1));
  };

  const getAppointmentsForDate = (date) => appointments.filter((apt) => apt.date === date);

  const canRescheduleOrCancel = (appointment) => {
    const dt = new Date(appointment.date + " " + appointment.time);
    const hoursDiff = (dt.getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursDiff > 24 && (appointment.status === "programada" || appointment.status === "reprogramada");
  };

  // ------ Listado & filtros ------
  const getStatusColor = (status) => {
    switch (status) {
      case "programada": return "bg-blue-100 text-blue-800";
      case "reprogramada": return "bg-yellow-100 text-yellow-800";
      case "cancelada": return "bg-red-100 text-red-800";
      case "completada": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFilteredAppointments = () =>
    appointments.filter((apt) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        apt.doctor.toLowerCase().includes(term) ||
        apt.specialty.toLowerCase().includes(term) ||
        apt.type.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "todos" || apt.status === statusFilter;
      const matchesDate = !dateFilter || apt.date.startsWith(dateFilter); // dateFilter viene de <input type="month" />
      return matchesSearch && matchesStatus && matchesDate;
    });

  const getNextAppointment = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments
      .filter((apt) => apt.date >= today && (apt.status === "programada" || apt.status === "reprogramada"))
      .sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time))[0];
  };

  // ------ Crear / Reprogramar / Cancelar ------
  const handleNewAppointment = async () => {
    const { servicio, fecha, hora, motivo, modalidad } = newAppointment;
    if (!servicio || !fecha || !hora || !motivo) {
      setErrorMessage("Por favor completa todos los campos obligatorios");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
      return;
    }
    try {
      await new Promise((r) => setTimeout(r, 800));
      const newId = (appointments.length + 1).toString();
      const apt = {
        id: newId,
        date: fecha,
        time: hora,
        doctor: "Dr. Asignado",
        specialty: servicio,
        status: "programada",
        type: "Consulta",
        modalidad,
        ubicacion: modalidad === "presencial" ? "Sede a confirmar" : undefined,
        enlaceVirtual: modalidad === "virtual" ? "Se enviará por correo" : undefined,
        motivo,
        instrucciones: "Se confirmarán detalles por correo",
      };
      setAppointments((prev) => [...prev, apt]);
      setNewAppointment({ servicio: "", fecha: "", hora: "", modalidad: "presencial", motivo: "" });
      setSuccessMessage("Cita agendada correctamente. Recibirás confirmación por correo.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch {
      setErrorMessage("No hay disponibilidad para la fecha y hora seleccionadas");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !newAppointment.fecha || !newAppointment.hora) return;
    try {
      await new Promise((r) => setTimeout(r, 800));
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, date: newAppointment.fecha, time: newAppointment.hora, status: "reprogramada" }
            : apt
        )
      );
      setShowReschedule(false);
      setSelectedAppointment(null);
      setNewAppointment({ servicio: "", fecha: "", hora: "", modalidad: "presencial", motivo: "" });
      setSuccessMessage("Cita reprogramada correctamente");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch {
      setErrorMessage("No se pudo reprogramar la cita. Intenta con otra fecha.");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await new Promise((r) => setTimeout(r, 700));
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: "cancelada" } : apt)));
      setSuccessMessage("Cita cancelada correctamente");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch {
      setErrorMessage("No se pudo cancelar la cita. Contacta con atención al cliente.");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  // ------ Render principal ------
  if (!isOpen) return null;

  return (
    <>
      {/* Modal principal */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-lg">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Citas</h2>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
              title="Cerrar"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {["calendario","historial","agendar","resumen"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={
                    "px-3 py-2 text-sm rounded-md border capitalize " +
                    (activeTab === t
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {/* --- CALENDARIO --- */}
            {activeTab === "calendario" && (
              <div className="space-y-6 mt-6">
                {/* Controles de vista */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      className={"px-3 py-1 rounded border " + (viewMode==="week" ? "bg-violet-600 text-white border-violet-600":"border-gray-300")}
                      onClick={() => setViewMode("week")}
                    >
                      Semana
                    </button>
                    <button
                      className={"px-3 py-1 rounded border " + (viewMode==="month" ? "bg-violet-600 text-white border-violet-600":"border-gray-300")}
                      onClick={() => setViewMode("month")}
                    >
                      Mes
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 rounded border border-gray-300"
                      onClick={() => {
                        const d = new Date(currentDate);
                        if (viewMode === "week") d.setDate(d.getDate() - 7);
                        else d.setMonth(d.getMonth() - 1);
                        setCurrentDate(d);
                      }}
                      title="Anterior"
                    >
                      ‹
                    </button>
                    <span className="font-medium text-gray-900 min-w-[200px] text-center">
                      {viewMode === "week"
                        ? `Semana del ${currentDate.toLocaleDateString()}`
                        : currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                    </span>
                    <button
                      className="px-3 py-1 rounded border border-gray-300"
                      onClick={() => {
                        const d = new Date(currentDate);
                        if (viewMode === "week") d.setDate(d.getDate() + 7);
                        else d.setMonth(d.getMonth() + 1);
                        setCurrentDate(d);
                      }}
                      title="Siguiente"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Calendario */}
                <div className="border rounded-lg overflow-hidden">
                  {viewMode === "week" ? (
                    <div className="grid grid-cols-7 gap-0">
                      {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map((d) => (
                        <div key={d} className="bg-gray-50 p-3 text-center font-medium text-sm border-b">{d}</div>
                      ))}
                      {getWeekDays().map((day, idx) => (
                        <div
                          key={idx}
                          className="min-h-[120px] p-2 border-r border-b bg-white"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, formatDate(day))}
                        >
                          <div className="text-sm font-medium text-gray-900 mb-2">{day.getDate()}</div>
                          <div className="space-y-1">
                            {getAppointmentsForDate(formatDate(day)).map((apt) => (
                              <div
                                key={apt.id}
                                draggable={canRescheduleOrCancel(apt)}
                                onDragStart={() => handleDragStart(apt)}
                                onClick={() => { setSelectedAppointment(apt); setShowAppointmentDetail(true); }}
                                className="p-2 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow bg-violet-600 text-white"
                              >
                                <div className="font-medium">{apt.time}</div>
                                <div className="truncate">{apt.doctor}</div>
                                <div className="mt-1 text-[10px] opacity-90">
                                  {apt.modalidad === "virtual" ? "Virtual" : "Presencial"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-0">
                      {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map((d) => (
                        <div key={d} className="bg-gray-50 p-3 text-center font-medium text-sm border-b">{d}</div>
                      ))}
                      {getMonthDays().map((day, idx) => (
                        <div
                          key={idx}
                          className="min-h-[80px] p-1 border-r border-b bg-white"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, formatDate(day))}
                        >
                          <div className="text-xs font-medium text-gray-900 mb-1">{day.getDate()}</div>
                          <div className="space-y-1">
                            {getAppointmentsForDate(formatDate(day)).map((apt) => (
                              <div
                                key={apt.id}
                                draggable={canRescheduleOrCancel(apt)}
                                onDragStart={() => handleDragStart(apt)}
                                onClick={() => { setSelectedAppointment(apt); setShowAppointmentDetail(true); }}
                                className="w-2 h-2 rounded-full cursor-pointer bg-violet-600"
                                title={`${apt.time} - ${apt.doctor}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- HISTORIAL --- */}
            {activeTab === "historial" && (
              <div className="space-y-6 mt-6">
                {/* Filtros */}
                <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">🔎</span>
                    <input
                      className="w-64 rounded-lg border px-3 py-2 outline-none focus:border-violet-600"
                      placeholder="Buscar por doctor, especialidad o servicio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="programada">Programada</option>
                    <option value="reprogramada">Reprogramada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="completada">Completada</option>
                  </select>

                  <input
                    type="month"
                    className="rounded-lg border px-3 py-2 outline-none focus:border-violet-600"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />

                  <button
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() => { setSearchTerm(""); setStatusFilter("todos"); setDateFilter(""); }}
                  >
                    Limpiar filtros
                  </button>
                </div>

                {/* Lista */}
                <div className="space-y-3">
                  {getFilteredAppointments().map((apt) => (
                    <div key={apt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-violet-600 text-white grid place-items-center text-lg">
                            {apt.modalidad === "virtual" ? "📹" : "📍"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{apt.doctor}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {apt.specialty} - {apt.type}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span>📅 {new Date(apt.date).toLocaleDateString()}</span>
                              <span>⏰ {apt.time}</span>
                              {apt.modalidad === "presencial" && apt.ubicacion && <span>📍 {apt.ubicacion}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-primary px-3 py-1.5"
                            onClick={() => { setSelectedAppointment(apt); setShowAppointmentDetail(true); }}
                          >
                            Ver detalles
                          </button>
                          {canRescheduleOrCancel(apt) && (
                            <>
                              <button
                                className="btn btn-primary px-3 py-1.5"
                                onClick={() => { setSelectedAppointment(apt); setShowReschedule(true); }}
                              >
                                ✏️ Reprogramar
                              </button>
                              <button
                                className="rounded-lg border px-3 py-1.5 text-sm text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleCancelAppointment(apt.id)}
                              >
                                🗑️ Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- AGENDAR --- */}
            {activeTab === "agendar" && (
              <div className="space-y-6 mt-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-4 border-b">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <span className="text-violet-600">＋</span> Agendar Nueva Cita
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Servicio/Especialidad *</label>
                        <select
                          className="select"
                          value={newAppointment.servicio}
                          onChange={(e) => setNewAppointment((p) => ({ ...p, servicio: e.target.value }))}
                        >
                          <option value="">Selecciona un servicio</option>
                          {serviciosDisponibles.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Modalidad *</label>
                        <select
                          className="select"
                          value={newAppointment.modalidad}
                          onChange={(e) => setNewAppointment((p) => ({ ...p, modalidad: e.target.value }))}
                        >
                          <option value="presencial">Presencial</option>
                          <option value="virtual">Virtual</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Fecha *</label>
                        <input
                          type="date"
                          className="input"
                          value={newAppointment.fecha}
                          onChange={(e) => setNewAppointment((p) => ({ ...p, fecha: e.target.value }))}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Hora *</label>
                        <select
                          className="select"
                          value={newAppointment.hora}
                          onChange={(e) => setNewAppointment((p) => ({ ...p, hora: e.target.value }))}
                        >
                          <option value="">Selecciona una hora</option>
                          {horariosDisponibles.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Motivo de la consulta *</label>
                      <input
                        className="input"
                        value={newAppointment.motivo}
                        onChange={(e) => setNewAppointment((p) => ({ ...p, motivo: e.target.value }))}
                        placeholder="Describe brevemente el motivo de tu consulta"
                      />
                    </div>

                    <button className="btn btn-primary w-full" onClick={handleNewAppointment}>
                      ＋ Agendar Cita
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- RESUMEN --- */}
            {activeTab === "resumen" && (
              <div className="space-y-6 mt-6">
                {/* Próxima cita */}
                {getNextAppointment() && (() => {
                  const nextApt = getNextAppointment();
                  return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Próxima Cita</h3>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-violet-600 text-white grid place-items-center text-xl">
                              {nextApt.modalidad === "virtual" ? "📹" : "📍"}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{nextApt.doctor}</h4>
                              <p className="text-sm text-gray-600">
                                {nextApt.specialty} - {nextApt.type}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                                <span>{new Date(nextApt.date).toLocaleDateString()} - {nextApt.time}</span>
                                <span className="capitalize">{nextApt.modalidad}</span>
                              </div>
                              {nextApt.instrucciones && (
                                <p className="text-sm text-blue-700 mt-2">
                                  <strong>Instrucciones:</strong> {nextApt.instrucciones}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {canRescheduleOrCancel(nextApt) && (
                              <>
                                <button
                                  className="btn btn-primary px-3 py-1.5"
                                  onClick={() => { setSelectedAppointment(nextApt); setShowReschedule(true); }}
                                >
                                  Reprogramar
                                </button>
                                <button
                                  className="rounded-lg border px-3 py-1.5 text-sm text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleCancelAppointment(nextApt.id)}
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            {nextApt.modalidad === "virtual" && nextApt.enlaceVirtual && (
                              <button
                                className="btn btn-primary"
                                onClick={() => window.open(nextApt.enlaceVirtual, "_blank")}
                              >
                                Unirse
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard
                    value={appointments.filter((a) => a.status === "programada" || a.status === "reprogramada").length}
                    label="Citas Programadas"
                    className="text-violet-600"
                  />
                  <StatCard value={appointments.filter((a) => a.status === "completada").length} label="Citas Completadas" className="text-green-600" />
                  <StatCard value={appointments.filter((a) => a.status === "cancelada").length} label="Citas Canceladas" className="text-red-600" />
                  <StatCard value={appointments.filter((a) => a.modalidad === "virtual").length} label="Citas Virtuales" className="text-blue-600" />
                </div>

                {/* Acciones rápidas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Acciones Rápidas</h3>
                  </div>
                  <div className="p-4 flex flex-wrap gap-3">
                    <button className="btn btn-primary" onClick={() => setActiveTab("agendar")}>＋ Agendar Nueva Cita</button>
                    <button className="btn btn-primary" onClick={() => setActiveTab("historial")}>📅 Ver Historial Completo</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detalle de cita */}
      {showAppointmentDetail && selectedAppointment && (
        <SmallModal onClose={() => setShowAppointmentDetail(false)} title="Detalle de la Cita">
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">{selectedAppointment.doctor}</h4>
              <p className="text-gray-600">{selectedAppointment.specialty}</p>
            </div>
            <Row label="Fecha" value={new Date(selectedAppointment.date).toLocaleDateString()} />
            <Row label="Hora" value={selectedAppointment.time} />
            <Row label="Modalidad" value={selectedAppointment.modalidad} />
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Estado:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                {selectedAppointment.status}
              </span>
            </div>
            {selectedAppointment.ubicacion && <Row label="Ubicación" value={selectedAppointment.ubicacion} />}
            {selectedAppointment.motivo && <Row label="Motivo" value={selectedAppointment.motivo} />}
            {selectedAppointment.instrucciones && <Row label="Instrucciones" value={selectedAppointment.instrucciones} />}
            {selectedAppointment.modalidad === "virtual" && selectedAppointment.enlaceVirtual && (
              <button className="btn btn-primary w-full" onClick={() => window.open(selectedAppointment.enlaceVirtual, "_blank")}>
                Unirse a la cita virtual
              </button>
            )}
          </div>
        </SmallModal>
      )}

      {/* Reprogramar */}
      {showReschedule && selectedAppointment && (
        <SmallModal onClose={() => setShowReschedule(false)} title="Reprogramar Cita">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nueva Fecha</label>
              <input
                type="date"
                className="input"
                value={newAppointment.fecha}
                onChange={(e) => setNewAppointment((p) => ({ ...p, fecha: e.target.value }))}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nueva Hora</label>
              <select
                className="select"
                value={newAppointment.hora}
                onChange={(e) => setNewAppointment((p) => ({ ...p, hora: e.target.value }))}
              >
                <option value="">Selecciona una hora</option>
                {horariosDisponibles.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline flex-1" onClick={() => setShowReschedule(false)}>Cancelar</button>
              <button className="btn btn-primary flex-1" onClick={handleRescheduleAppointment}>Reprogramar</button>
            </div>
          </div>
        </SmallModal>
      )}

      {/* Popups */}
      {showSuccessPopup && (
        <Popup type="success" message={successMessage || "Operación exitosa"} onClose={() => setShowSuccessPopup(false)} />
      )}
      {showErrorPopup && (
        <Popup type="error" message={errorMessage || "Ocurrió un error"} onClose={() => setShowErrorPopup(false)} />
      )}
    </>
  );
}

/* ---------- Subcomponentes pequeños ---------- */

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-500">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function StatCard({ value, label, className = "" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-4 text-center">
        <div className={`text-2xl font-bold ${className}`}>{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function SmallModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 grid place-items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Popup({ type = "success", message = "", onClose }) {
  const ok = type === "success";
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 grid place-items-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
        <div
          className={
            "w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center " +
            (ok ? "bg-violet-600 text-white" : "bg-red-100 text-red-600")
          }
        >
          {ok ? "✓" : "!"}
        </div>
        <h3 className="text-lg font-semibold mb-1">{ok ? "¡Éxito!" : "Error"}</h3>
        <p className="text-gray-600">{message}</p>
        <button className="btn btn-primary mt-4 w-full" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

/* ---------- utilidades de estilo (opcionales) ----------
   Si quieres atajos, pega esto en tu index.css (Tailwind v3):
   .input { @apply w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-600; }
   .select { @apply w-full rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600; }
   .btn { @apply rounded-lg px-4 py-2 font-medium transition disabled:opacity-60; }
   .btn-primary { @apply bg-violet-600 text-white hover:bg-violet-700; }
   .btn-outline { @apply bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100; }
*/
