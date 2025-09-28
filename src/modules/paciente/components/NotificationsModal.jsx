// src/components/pacientes/modals/NotificationsModal.jsx
import { useEffect, useState } from "react";
import {
  Bell,
  X,
  Calendar,
  Pill,
  FileText,
  MessageSquare,
  Settings,
  Check,
  Trash2,
  Search,
  Clock,
  VolumeX,
  Smartphone,
  Mail,
  BellRing,
} from "lucide-react";

export default function NotificationsModal({
  isOpen,
  onClose,
  unreadCount,
  onUpdateUnreadCount,
}) {
  const [activeTab, setActiveTab] = useState("notificaciones");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "cita",
      title: "Recordatorio de Cita",
      message:
        "Tu cita con Dr. María González es mañana a las 10:00 AM. Recuerda traer tus exámenes de laboratorio.",
      timestamp: "2024-01-14T18:00:00Z",
      read: false,
      priority: "alta",
      actionRequired: true,
      relatedId: "apt-1",
    },
    {
      id: "2",
      type: "medicamento",
      title: "Hora de Medicamento",
      message:
        "Es hora de tomar tu medicamento: Enalapril 10mg. Próxima dosis en 12 horas.",
      timestamp: "2024-01-14T08:00:00Z",
      read: false,
      priority: "alta",
      actionRequired: true,
    },
    {
      id: "3",
      type: "resultado",
      title: "Resultados Disponibles",
      message:
        "Los resultados de tu examen de sangre del 10 de enero ya están disponibles para consulta.",
      timestamp: "2024-01-13T14:30:00Z",
      read: false,
      priority: "media",
      actionRequired: true,
      relatedId: "result-123",
    },
    {
      id: "4",
      type: "mensaje",
      title: "Mensaje del Dr. Carlos Ruiz",
      message:
        "Hola Juan, he revisado tus últimos exámenes. Todo se ve bien. Continuemos con el tratamiento actual.",
      timestamp: "2024-01-13T11:15:00Z",
      read: true,
      priority: "media",
    },
    {
      id: "5",
      type: "recordatorio",
      title: "Chequeo Anual Pendiente",
      message:
        "Recuerda agendar tu chequeo médico anual. Han pasado 11 meses desde tu última consulta general.",
      timestamp: "2024-01-12T09:00:00Z",
      read: true,
      priority: "baja",
      actionRequired: true,
    },
    {
      id: "6",
      type: "cita",
      title: "Cita Reprogramada",
      message:
        "Tu cita del 18 de enero ha sido reprogramada para el 20 de enero a las 2:30 PM por solicitud del doctor.",
      timestamp: "2024-01-11T16:45:00Z",
      read: true,
      priority: "media",
    },
    {
      id: "7",
      type: "medicamento",
      title: "Renovación de Receta",
      message:
        "Tu receta de Metformina vence en 5 días. Contacta a tu médico para renovarla.",
      timestamp: "2024-01-11T10:00:00Z",
      read: false,
      priority: "media",
      actionRequired: true,
    },
    {
      id: "8",
      type: "resultado",
      title: "Resultado Urgente",
      message:
        "Se requiere tu atención inmediata. Los resultados de tu electrocardiograma muestran irregularidades. Contacta a tu cardiólogo.",
      timestamp: "2024-01-10T15:20:00Z",
      read: true,
      priority: "alta",
      actionRequired: true,
    },
  ]);

  const [preferences, setPreferences] = useState({
    citas: { enabled: true, anticipacion: 24, recordatorios: true, cancelaciones: true },
    medicamentos: {
      enabled: true,
      horarios: true,
      recordatoriosDosis: true,
      alertasInteracciones: true,
    },
    resultados: { enabled: true, nuevosResultados: true, alertasAnormales: true },
    mensajes: { enabled: true, equipoMedico: true, administrativos: false },
    canales: { push: true, email: true, sms: false },
    horarioSilencioso: { enabled: true, inicio: "22:00", fin: "07:00" },
  });

  // Actualiza contador de no leídas
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    onUpdateUnreadCount(unread);
  }, [notifications, onUpdateUnreadCount]);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "cita":
        return <Calendar className="w-5 h-5" />;
      case "medicamento":
        return <Pill className="w-5 h-5" />;
      case "resultado":
        return <FileText className="w-5 h-5" />;
      case "mensaje":
        return <MessageSquare className="w-5 h-5" />;
      case "recordatorio":
        return <BellRing className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baja":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "cita":
        return "#9083D5";
      case "medicamento":
        return "#10B981";
      case "resultado":
        return "#F59E0B";
      case "mensaje":
        return "#3B82F6";
      case "recordatorio":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "todas" || n.type === typeFilter;
      const matchesPriority = priorityFilter === "todas" || n.priority === priorityFilter;
      const matchesRead = !showOnlyUnread || !n.read;
      return matchesSearch && matchesType && matchesPriority && matchesRead;
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)} horas`;
    if (diffInHours < 48) return "Ayer";
    return date.toLocaleDateString();
    };

  const updatePreferences = (section, key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: "#9083D5" }} />
            <h2 className="text-xl font-semibold text-gray-900">Centro de Notificaciones</h2>
            {unreadCount > 0 && (
              <span
                className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: "#9083D5" }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border">
            <button
              onClick={() => setActiveTab("notificaciones")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "notificaciones" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600"
              }`}
            >
              Notificaciones
            </button>
            <button
              onClick={() => setActiveTab("configuracion")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "configuracion" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600"
              }`}
            >
              Configuración
            </button>
          </div>
        </div>

        {activeTab === "notificaciones" && (
          <div className="space-y-6 px-6 py-6">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-64 rounded-md border px-9 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="w-40 rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-900"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="todas">Todos los tipos</option>
                <option value="cita">Citas</option>
                <option value="medicamento">Medicamentos</option>
                <option value="resultado">Resultados</option>
                <option value="mensaje">Mensajes</option>
                <option value="recordatorio">Recordatorios</option>
              </select>

              <select
                className="w-40 rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-900"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta prioridad</option>
                <option value="media">Media prioridad</option>
                <option value="baja">Baja prioridad</option>
              </select>

              <label className="ml-2 inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={showOnlyUnread}
                  onChange={(e) => setShowOnlyUnread(e.target.checked)}
                />
                <span className="text-sm">Solo no leídas</span>
              </label>

              <div className="ml-auto">
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <Check className="h-4 w-4" />
                  Marcar todas como leídas
                </button>
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-3">
              {getFilteredNotifications().length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No hay notificaciones</h3>
                  <p className="text-gray-500">
                    {showOnlyUnread ? "No tienes notificaciones sin leer" : "No se encontraron notificaciones"}
                  </p>
                </div>
              ) : (
                getFilteredNotifications().map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${
                      !n.read ? "border-l-4" : ""
                    }`}
                    style={{ borderLeftColor: !n.read ? "#9083D5" : "transparent" }}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-1 items-start gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: getTypeColor(n.type) }}
                          >
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className={`font-semibold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>
                                {n.title}
                              </h4>
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${getPriorityColor(
                                  n.priority
                                )}`}
                              >
                                {n.priority}
                              </span>
                              {n.actionRequired && (
                                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                                  Acción requerida
                                </span>
                              )}
                              {!n.read && <span className="h-2 w-2 rounded-full" style={{ background: "#9083D5" }} />}
                            </div>
                            <p className={`mb-2 text-sm ${!n.read ? "text-gray-900" : "text-gray-600"}`}>{n.message}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(n.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                              title="Marcar como leída"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "configuracion" && (
          <div className="space-y-6 px-6 py-6">
            {/* Citas */}
            <section className="rounded-lg border bg-white">
              <header className="flex items-center gap-2 border-b px-6 py-4">
                <Calendar className="h-5 w-5" style={{ color: "#9083D5" }} />
                <h3 className="font-semibold">Notificaciones de Citas</h3>
              </header>
              <div className="space-y-4 p-6">
                <RowSwitch
                  title="Habilitar notificaciones de citas"
                  subtitle="Recibe alertas sobre tus citas médicas"
                  checked={preferences.citas.enabled}
                  onChange={(v) => updatePreferences("citas", "enabled", v)}
                />
                {preferences.citas.enabled && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Recordatorio con anticipación</label>
                      <select
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-900 md:w-64"
                        value={String(preferences.citas.anticipacion)}
                        onChange={(e) => updatePreferences("citas", "anticipacion", parseInt(e.target.value))}
                      >
                        <option value="1">1 hora antes</option>
                        <option value="2">2 horas antes</option>
                        <option value="6">6 horas antes</option>
                        <option value="12">12 horas antes</option>
                        <option value="24">24 horas antes</option>
                        <option value="48">48 horas antes</option>
                      </select>
                    </div>
                    <RowSwitch
                      title="Recordatorios adicionales"
                      subtitle="Recordatorios el día de la cita"
                      checked={preferences.citas.recordatorios}
                      onChange={(v) => updatePreferences("citas", "recordatorios", v)}
                    />
                    <RowSwitch
                      title="Notificar cancelaciones"
                      subtitle="Alertas cuando se cancelen o reprogramen citas"
                      checked={preferences.citas.cancelaciones}
                      onChange={(v) => updatePreferences("citas", "cancelaciones", v)}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Medicamentos */}
            <section className="rounded-lg border bg-white">
              <header className="flex items-center gap-2 border-b px-6 py-4">
                <Pill className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Notificaciones de Medicamentos</h3>
              </header>
              <div className="space-y-4 p-6">
                <RowSwitch
                  title="Habilitar notificaciones de medicamentos"
                  subtitle="Recordatorios para tomar medicamentos"
                  checked={preferences.medicamentos.enabled}
                  onChange={(v) => updatePreferences("medicamentos", "enabled", v)}
                />
                {preferences.medicamentos.enabled && (
                  <>
                    <RowSwitch
                      title="Recordatorios de horarios"
                      subtitle="Alertas en los horarios programados"
                      checked={preferences.medicamentos.horarios}
                      onChange={(v) => updatePreferences("medicamentos", "horarios", v)}
                    />
                    <RowSwitch
                      title="Recordatorios de dosis"
                      subtitle="Alertas para dosis perdidas"
                      checked={preferences.medicamentos.recordatoriosDosis}
                      onChange={(v) => updatePreferences("medicamentos", "recordatoriosDosis", v)}
                    />
                    <RowSwitch
                      title="Alertas de interacciones"
                      subtitle="Avisos sobre posibles interacciones"
                      checked={preferences.medicamentos.alertasInteracciones}
                      onChange={(v) => updatePreferences("medicamentos", "alertasInteracciones", v)}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Resultados */}
            <section className="rounded-lg border bg-white">
              <header className="flex items-center gap-2 border-b px-6 py-4">
                <FileText className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold">Notificaciones de Resultados</h3>
              </header>
              <div className="space-y-4 p-6">
                <RowSwitch
                  title="Habilitar notificaciones de resultados"
                  subtitle="Alertas sobre resultados de exámenes"
                  checked={preferences.resultados.enabled}
                  onChange={(v) => updatePreferences("resultados", "enabled", v)}
                />
                {preferences.resultados.enabled && (
                  <>
                    <RowSwitch
                      title="Nuevos resultados disponibles"
                      subtitle="Notificar cuando estén listos"
                      checked={preferences.resultados.nuevosResultados}
                      onChange={(v) => updatePreferences("resultados", "nuevosResultados", v)}
                    />
                    <RowSwitch
                      title="Alertas de resultados anormales"
                      subtitle="Notificaciones prioritarias para valores fuera de rango"
                      checked={preferences.resultados.alertasAnormales}
                      onChange={(v) => updatePreferences("resultados", "alertasAnormales", v)}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Mensajes */}
            <section className="rounded-lg border bg-white">
              <header className="flex items-center gap-2 border-b px-6 py-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Notificaciones de Mensajes</h3>
              </header>
              <div className="space-y-4 p-6">
                <RowSwitch
                  title="Habilitar notificaciones de mensajes"
                  subtitle="Comunicaciones del equipo médico"
                  checked={preferences.mensajes.enabled}
                  onChange={(v) => updatePreferences("mensajes", "enabled", v)}
                />
                {preferences.mensajes.enabled && (
                  <>
                    <RowSwitch
                      title="Mensajes del equipo médico"
                      subtitle="Doctores y especialistas"
                      checked={preferences.mensajes.equipoMedico}
                      onChange={(v) => updatePreferences("mensajes", "equipoMedico", v)}
                    />
                    <RowSwitch
                      title="Mensajes administrativos"
                      subtitle="Facturación y trámites"
                      checked={preferences.mensajes.administrativos}
                      onChange={(v) => updatePreferences("mensajes", "administrativos", v)}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Canales */}
            <section className="rounded-lg border bg-white">
              <header className="flex items-center gap-2 border-b px-6 py-4">
                <Settings className="h-5 w-5" style={{ color: "#9083D5" }} />
                <h3 className="font-semibold">Canales de Notificación</h3>
              </header>
              <div className="space-y-4 p-6">
                <RowSwitch
                  icon={<Smartphone className="h-4 w-4 text-gray-500" />}
                  title="Notificaciones push"
                  subtitle="Alertas en la aplicación"
                  checked={preferences.canales.push}
                  onChange={(v) => updatePreferences("canales", "push", v)}
                />
                <RowSwitch
                  icon={<Mail className="h-4 w-4 text-gray-500" />}
                  title="Correo electrónico"
                  subtitle="Notificaciones por email"
                  checked={preferences.canales.email}
                  onChange={(v) => updatePreferences("canales", "email", v)}
                />
                <RowSwitch
                  icon={<MessageSquare className="h-4 w-4 text-gray-500" />}
                  title="SMS"
                  subtitle="Mensajes de texto"
                  checked={preferences.canales.sms}
                  onChange={(v) => updatePreferences("canales", "sms", v)}
                />
              </div>
            </section>

            {/* Horario silencioso */}
            <section className="rounded-lg border bg-white">
              <header className="flex items-center gap-2 border-b px-6 py-4">
                <VolumeX className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Horario Silencioso</h3>
              </header>
              <div className="space-y-4 p-6">
                <RowSwitch
                  title="Habilitar horario silencioso"
                  subtitle="No recibir notificaciones en horarios específicos"
                  checked={preferences.horarioSilencioso.enabled}
                  onChange={(v) => updatePreferences("horarioSilencioso", "enabled", v)}
                />
                {preferences.horarioSilencioso.enabled && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Hora de inicio</label>
                      <input
                        type="time"
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-900"
                        value={preferences.horarioSilencioso.inicio}
                        onChange={(e) => updatePreferences("horarioSilencioso", "inicio", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Hora de fin</label>
                      <input
                        type="time"
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-900"
                        value={preferences.horarioSilencioso.fin}
                        onChange={(e) => updatePreferences("horarioSilencioso", "fin", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Guardar */}
            <div className="flex justify-end pb-6">
              <button
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white"
                style={{ backgroundColor: "#9083D5" }}
                onClick={() => {
                  // Aquí podrías hacer fetch/axios al backend para guardar preferencias
                  // Por ahora, solo feedback visual rápido:
                  alert("Configuración guardada.");
                }}
              >
                <Settings className="h-4 w-4" />
                Guardar Configuración
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Helpers UI simples --- */
function RowSwitch({ title, subtitle, checked, onChange, icon }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-2">
        {icon ? <div className="mt-0.5">{icon}</div> : null}
        <div>
          <div className="text-sm font-medium">{title}</div>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-gray-900 peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}
