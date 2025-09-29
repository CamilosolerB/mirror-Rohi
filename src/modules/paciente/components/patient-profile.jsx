 import { useState } from "react";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - patientData: { nombre, apellido, ciudad, telefono, email }
 * - onUpdateData: (data) => void
 */
export default function Patient_profile({ isOpen, onClose, patientData, onUpdateData }) {
  const [formData, setFormData] = useState(patientData || {
    nombre: "",
    apellido: "",
    ciudad: "",
    telefono: "",
    email: "",
  });

  const [activeTab, setActiveTab] = useState("datos"); // 'datos' | 'preferencias' | 'seguridad' | 'representante' | 'desvinculacion'

  const [preferences, setPreferences] = useState({
    idioma: "es",
    tema: "claro",
    notificaciones: {
      recordatoriosCita: { email: true, sms: true, whatsapp: false },
      cambiosAgenda: { email: true, sms: false, whatsapp: false },
      resultadosDisponibles: { email: true, sms: true, whatsapp: true },
      mensajesSistema: { email: true, sms: false, whatsapp: false },
    },
    sincronizacionCalendario: {
      googleCalendar: false,
      outlook: false,
    },
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    verificationCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [representanteFile, setRepresentanteFile] = useState(null);
  const [desvinculacionFile, setDesvinculacionFile] = useState(null);
  const [isUploadingRepresentante, setIsUploadingRepresentante] = useState(false);
  const [isUploadingDesvinculacion, setIsUploadingDesvinculacion] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [show2FACode, setShow2FACode] = useState(false);

  const [sessionHistory, setSessionHistory] = useState([
    { id: 1, device: "desktop", deviceName: "Chrome en Windows", location: "Bogotá, Colombia", date: "2024-01-15", time: "14:30", current: true },
    { id: 2, device: "mobile", deviceName: "Safari en iPhone", location: "Medellín, Colombia", date: "2024-01-14", time: "09:15", current: false },
    { id: 3, device: "desktop", deviceName: "Firefox en Mac", location: "Cali, Colombia", date: "2024-01-13", time: "16:45", current: false },
  ]);

  if (!isOpen) return null;

  // ---------------- handlers ----------------
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (category, subcategory, field, value) => {
    setPreferences((prev) => {
      const next = { ...prev };
      if (subcategory) {
        next[category] = { ...(prev[category] || {}) };
        next[category][subcategory] = { ...(prev[category][subcategory] || {}) };
        next[category][subcategory][field] = value;
      } else if (field) {
        next[category] = { ...(prev[category] || {}) };
        next[category][field] = value;
      } else {
        next[category] = value;
      }
      return next;
    });
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData((prev) => ({ ...prev, [field]: value }));
  };

  const isPasswordValid = () => {
    const { currentPassword, newPassword, confirmPassword } = securityData;
    return (
      currentPassword.length > 0 &&
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /\d/.test(newPassword) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
      newPassword === confirmPassword
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      onUpdateData && onUpdateData(formData);
      setSuccessMessage("Datos actualizados correctamente");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch {
      setErrorMessage("Hubo un error, intenta de nuevo más tarde");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPreferences = () => {
    setPreferences({
      idioma: "es",
      tema: "claro",
      notificaciones: {
        recordatoriosCita: { email: true, sms: true, whatsapp: false },
        cambiosAgenda: { email: true, sms: false, whatsapp: false },
        resultadosDisponibles: { email: true, sms: true, whatsapp: true },
        mensajesSistema: { email: true, sms: false, whatsapp: false },
      },
      sincronizacionCalendario: { googleCalendar: false, outlook: false },
    });
    setSuccessMessage("Preferencias restablecidas");
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 1500);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSuccessMessage("Preferencias guardadas");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 1500);
    } catch {
      setErrorMessage("Error al guardar preferencias");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async (enabled) => {
    setSecurityData((p) => ({ ...p, twoFactorEnabled: enabled }));
    setSuccessMessage(
      enabled ? "Código de verificación enviado a tu correo" : "Autenticación de dos pasos desactivada"
    );
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2000);
  };

  const handleChangePassword = async () => {
    if (!isPasswordValid()) return;
    setIsChangingPassword(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      if (securityData.twoFactorEnabled) {
        setShow2FACode(true);
        setSuccessMessage("Ingresa el código de verificación enviado a tu correo");
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 2000);
      } else {
        setSecurityData((p) => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setSuccessMessage("Contraseña cambiada correctamente");
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 1500);
      }
    } catch {
      setErrorMessage("Error al cambiar la contraseña");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerify2FA = async () => {
    if (securityData.verificationCode.length !== 6) return;
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setShow2FACode(false);
      setSecurityData((p) => ({
        ...p,
        verificationCode: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setSuccessMessage("Verificación exitosa. Contraseña cambiada.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch {
      setErrorMessage("Código de verificación incorrecto");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  const handleRepresentanteFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setRepresentanteFile(file);
    } else {
      setErrorMessage("Solo PDF o imágenes");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  const handleDesvinculacionFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setDesvinculacionFile(file);
    } else {
      setErrorMessage("Solo PDF o imágenes");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  const handleSolicitarCambioRepresentante = async () => {
    if (!representanteFile) {
      setErrorMessage("Debe cargar un documento");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
      return;
    }
    setIsUploadingRepresentante(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setRepresentanteFile(null);
      setSuccessMessage("Solicitud enviada. Un secretario revisará su documento.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch {
      setErrorMessage("Error al enviar la solicitud");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    } finally {
      setIsUploadingRepresentante(false);
    }
  };

  const handleSolicitarDesvinculacion = async () => {
    if (!desvinculacionFile) {
      setErrorMessage("Debe cargar un documento");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
      return;
    }
    setIsUploadingDesvinculacion(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setDesvinculacionFile(null);
      setSuccessMessage("Solicitud de desvinculación enviada.");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch {
      setErrorMessage("Error al enviar la solicitud");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    } finally {
      setIsUploadingDesvinculacion(false);
    }
  };

  const handleCloseSession = async (sessionId) => {
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccessMessage("Sesión cerrada correctamente");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 1500);
      // Opcional: setSessionHistory(sessionHistory.filter(s => s.id !== sessionId));
    } catch {
      setErrorMessage("Error al cerrar la sesión");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  const handleCloseAllSessions = async () => {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessMessage("Todas las sesiones han sido cerradas");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch {
      setErrorMessage("Error al cerrar las sesiones");
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    }
  };

  // ---------------- UI helpers ----------------
  const Initials = () => {
    const n = (formData.nombre || "").trim();
    const a = (formData.apellido || "").trim();
    const ini = `${n ? n[0] : ""}${a ? a[0] : ""}`.toUpperCase() || "P";
    return (
      <div className="h-10 w-10 rounded-full bg-violet-500 text-white grid place-items-center text-sm font-semibold">
        {ini}
      </div>
    );
  };

  const TabButton = ({ value, children }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={
        "px-3 py-2 text-sm rounded-md border " +
        (activeTab === value
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
      }
    >
      {children}
    </button>
  );

  // ---------------- Render ----------------
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        {/* Fixed-height modal with scrollable content to avoid resizing when tabs change */}
        <div className="w-full max-w-5xl h-[80vh] sm:h-[85vh] flex flex-col bg-white rounded-2xl shadow-lg">
          {/* Header (sticky) */}
          <div className="sticky top-0 z-20 bg-white border-b">
            <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Initials />
              <h2 className="text-lg font-semibold text-gray-900">Mi Perfil</h2>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
              aria-label="Cerrar"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
          </div>

          {/* Tabs and content (scrollable) */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <TabButton value="datos">Datos Personales</TabButton>
              <TabButton value="preferencias">Preferencias</TabButton>
              <TabButton value="seguridad">Seguridad</TabButton>
              <TabButton value="representante">Representante Legal</TabButton>
              <TabButton value="desvinculacion">Desvinculación</TabButton>
            </div>

            {/* --- DATOS PERSONALES --- */}
            {activeTab === "datos" && (
              <div className="mt-6 space-y-4 pb-6">
                <Field label="Nombre del paciente">
                  <input
                    className="input"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingresa tu nombre"
                  />
                </Field>

                <Field label="Apellido del paciente">
                  <input
                    className="input"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    placeholder="Ingresa tu apellido"
                  />
                </Field>

                <Field label="Ciudad">
                  <input
                    className="input"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange("ciudad", e.target.value)}
                    placeholder="Ingresa tu ciudad"
                  />
                </Field>

                <Field label="Teléfono">
                  <input
                    className="input"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    placeholder="Ingresa tu teléfono"
                  />
                </Field>

                <Field label="Correo electrónico">
                  <input
                    className="input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Ingresa tu correo electrónico"
                  />
                </Field>

                <div className="flex gap-3 pt-2 sticky bottom-0 bg-white/80 backdrop-blur-sm p-3 -mx-4">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 flex-1"
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            )}

            {/* --- PREFERENCIAS --- */}
            {activeTab === "preferencias" && (
              <div className="mt-6 space-y-6">
                {/* Idioma / Tema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-4">
                    <h4 className="card-title mb-3">Idioma</h4>
                    <select
                      className="select"
                      value={preferences.idioma}
                      onChange={(e) => handlePreferenceChange("idioma", "", "", e.target.value)}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="card p-4">
                    <h4 className="card-title mb-3">Tema</h4>
                    <select
                      className="select"
                      value={preferences.tema}
                      onChange={(e) => handlePreferenceChange("tema", "", "", e.target.value)}
                    >
                      <option value="claro">Claro</option>
                      <option value="oscuro">Oscuro</option>
                    </select>
                  </div>
                </div>

                {/* Notificaciones */}
                <div className="card p-6 space-y-6">
                  <h4 className="card-title">Configuración de Notificaciones</h4>

                  <NotifRow
                    title="Recordatorios de Cita"
                    values={preferences.notificaciones.recordatoriosCita}
                    onChange={(k, v) => handlePreferenceChange("notificaciones", "recordatoriosCita", k, v)}
                  />
                  <NotifRow
                    title="Cambios de Agenda"
                    values={preferences.notificaciones.cambiosAgenda}
                    onChange={(k, v) => handlePreferenceChange("notificaciones", "cambiosAgenda", k, v)}
                  />
                  <NotifRow
                    title="Resultados Disponibles"
                    values={preferences.notificaciones.resultadosDisponibles}
                    onChange={(k, v) => handlePreferenceChange("notificaciones", "resultadosDisponibles", k, v)}
                  />
                  <NotifRow
                    title="Mensajes del Sistema"
                    values={preferences.notificaciones.mensajesSistema}
                    onChange={(k, v) => handlePreferenceChange("notificaciones", "mensajesSistema", k, v)}
                  />
                </div>

                {/* Calendarios */}
                <div className="card p-6 space-y-3">
                  <h4 className="card-title">Sincronización de Calendario</h4>
                  <ToggleRow
                    label="Google Calendar"
                    checked={preferences.sincronizacionCalendario.googleCalendar}
                    onChange={(v) => handlePreferenceChange("sincronizacionCalendario", "", "googleCalendar", v)}
                  />
                  <ToggleRow
                    label="Microsoft Outlook"
                    checked={preferences.sincronizacionCalendario.outlook}
                    onChange={(v) => handlePreferenceChange("sincronizacionCalendario", "", "outlook", v)}
                  />
                </div>

                <div className="flex gap-3">
                  <button className="btn btn-outline" onClick={handleResetPreferences} disabled={isLoading}>
                    Restablecer
                  </button>
                  <button className="btn btn-primary flex-1" onClick={handleSavePreferences} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Preferencias"}
                  </button>
                </div>
              </div>
            )}

            {/* --- SEGURIDAD --- */}
            {activeTab === "seguridad" && (
              <div className="mt-6 space-y-6">
                {/* Cambio de contraseña */}
                <div className="card p-6 space-y-4">
                  <h4 className="card-title">Cambiar Contraseña</h4>
                  <Field label="Contraseña Actual">
                    <input
                      className="input"
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                    />
                  </Field>

                  <Field label="Nueva Contraseña">
                    <input
                      className="input"
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                    />
                    <PasswordHints value={securityData.newPassword} />
                  </Field>

                  <Field label="Confirmar Nueva Contraseña">
                    <input
                      className="input"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                    />
                    {securityData.confirmPassword &&
                      securityData.newPassword !== securityData.confirmPassword && (
                        <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                      )}
                  </Field>

                  <button
                    className="btn btn-primary w-full"
                    onClick={handleChangePassword}
                    disabled={!isPasswordValid() || isChangingPassword}
                  >
                    {isChangingPassword ? "Cambiando contraseña..." : "Cambiar Contraseña"}
                  </button>
                </div>

                {/* 2FA */}
                <div className="card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="card-title">Autenticación de Dos Pasos (2FA)</h4>
                    <Switch
                      checked={securityData.twoFactorEnabled}
                      onChange={(e) => handleToggle2FA(e.target.checked)}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Agrega una capa extra de seguridad a tu cuenta requiriendo un código de verificación.
                  </p>

                  {securityData.twoFactorEnabled && (
                    <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        Los códigos de verificación se enviarán a: {formData.email || patientData?.email}
                      </p>

                      {show2FACode && (
                        <div className="space-y-2">
                          <Field label="Código de verificación">
                            <input
                              className="input"
                              maxLength={6}
                              value={securityData.verificationCode}
                              onChange={(e) => handleSecurityChange("verificationCode", e.target.value)}
                              placeholder="Ingresa 6 dígitos"
                            />
                          </Field>
                          <button
                            className="btn btn-primary w-full"
                            onClick={handleVerify2FA}
                            disabled={securityData.verificationCode.length !== 6}
                          >
                            Verificar Código
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Historial de sesiones */}
                <div className="card p-6 space-y-4">
                  <h4 className="card-title">Historial de Sesiones</h4>
                  <div className="space-y-3">
                    {sessionHistory.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{s.deviceName}</p>
                          <p className="text-sm text-gray-600">{s.location}</p>
                          <p className="text-xs text-gray-500">
                            {s.date} - {s.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.current && (
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Actual</span>
                          )}
                          {!s.current && (
                            <button
                              className="btn btn-outline !text-red-600 !border-red-200 hover:!bg-red-50"
                              onClick={() => handleCloseSession(s.id)}
                            >
                              Cerrar sesión
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-outline w-full !text-red-600 !border-red-200 hover:!bg-red-50"
                    onClick={handleCloseAllSessions}
                  >
                    Cerrar todas las sesiones (excepto esta)
                  </button>
                </div>
              </div>
            )}

            {/* --- REPRESENTANTE LEGAL --- */}
            {activeTab === "representante" && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Carga una carta (PDF o imagen) que estipule formalmente el cambio de representante legal.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="representante-file"
                    accept=".pdf,image/*"
                    onChange={handleRepresentanteFileChange}
                    className="hidden"
                  />
                  <label htmlFor="representante-file" className="cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 grid place-items-center">⬆</div>
                    <p className="text-gray-600 mb-1">
                      {representanteFile ? representanteFile.name : "Haz clic para cargar el documento"}
                    </p>
                    <p className="text-xs text-gray-500">PDF o imagen (máx. 10MB)</p>
                  </label>
                </div>

                {representanteFile && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm truncate">{representanteFile.name}</span>
                    <button className="h-6 w-6 grid place-items-center rounded btn btn-outline" onClick={() => setRepresentanteFile(null)}>✕</button>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleSolicitarCambioRepresentante}
                  disabled={!representanteFile || isUploadingRepresentante}
                >
                  {isUploadingRepresentante ? "Enviando solicitud..." : "Solicitar Cambio de Representante"}
                </button>
              </div>
            )}

            {/* --- DESVINCULACIÓN --- */}
            {activeTab === "desvinculacion" && (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Carga un documento (PDF o imagen) que formalice tu petición de retiro de la IPS.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="desvinculacion-file"
                    accept=".pdf,image/*"
                    onChange={handleDesvinculacionFileChange}
                    className="hidden"
                  />
                  <label htmlFor="desvinculacion-file" className="cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 grid place-items-center">⬆</div>
                    <p className="text-gray-600 mb-1">
                      {desvinculacionFile ? desvinculacionFile.name : "Haz clic para cargar el documento"}
                    </p>
                    <p className="text-xs text-gray-500">PDF o imagen (máx. 10MB)</p>
                  </label>
                </div>

                {desvinculacionFile && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm truncate">{desvinculacionFile.name}</span>
                    <button className="h-6 w-6 grid place-items-center rounded btn btn-outline" onClick={() => setDesvinculacionFile(null)}>✕</button>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  <strong>Importante:</strong> La desvinculación es un proceso irreversible. Una vez aprobada, perderás
                  acceso a todos los servicios de la IPS.
                </div>

                <button
                  className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white py-2.5 font-medium disabled:opacity-60"
                  onClick={handleSolicitarDesvinculacion}
                  disabled={!desvinculacionFile || isUploadingDesvinculacion}
                >
                  {isUploadingDesvinculacion ? "Enviando solicitud..." : "Solicitar Desvinculación"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <Popup onClose={() => setShowSuccessPopup(false)} type="success" message={successMessage || "Operación exitosa"} />
      )}
      {showErrorPopup && (
        <Popup onClose={() => setShowErrorPopup(false)} type="error" message={errorMessage || "Ocurrió un error"} />
      )}
    </>
  );
}

/* ---------- Subcomponentes simples (estilos Tailwind) ---------- */

function Field({ label, children }) {
  // Responsive: apila en pantallas muy pequeñas, en linea en sm+
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <label className="text-sm font-medium text-gray-700 sm:w-40">{label}:</label>
      <div className="mt-1 sm:mt-0 flex-1">{children}</div>
    </div>
  );
}

function NotifRow({ title, values, onChange }) {
  return (
    <div>
      <h5 className="font-medium text-gray-800 mb-2">{title}</h5>
      <div className="grid grid-cols-3 gap-3">
        {["email", "sms", "whatsapp"].map((k) => (
          <label key={k} className="flex items-center justify-between p-3 border rounded-lg text-sm">
            <span className="capitalize">{k}</span>
            <Switch checked={!!values[k]} onChange={(e) => onChange(k, e.target.checked)} />
          </label>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-3 border rounded-lg">
      <span className="font-medium">{label}</span>
      <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function PasswordHints({ value }) {
  return (
    <div className="text-xs text-gray-500 space-y-1 mt-1">
      <p>La contraseña debe contener:</p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li className={value.length >= 8 ? "text-green-600" : "text-gray-500"}>Mínimo 8 caracteres</li>
        <li className={/[A-Z]/.test(value) ? "text-green-600" : "text-gray-500"}>Al menos una mayúscula</li>
        <li className={/[a-z]/.test(value) ? "text-green-600" : "text-gray-500"}>Al menos una minúscula</li>
        <li className={/\d/.test(value) ? "text-green-600" : "text-gray-500"}>Al menos un número</li>
        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(value) ? "text-green-600" : "text-gray-500"}>
          Al menos un carácter especial
        </li>
      </ul>
    </div>
  );
}

function Popup({ type = "success", message = "", onClose }) {
  const ok = type === "success";
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 grid place-items-center p-4">
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
        <button className="btn btn-primary mt-4 w-full" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* ---------- utilidades de estilo (atajos Tailwind) ---------- */
/* Úsalos como clases utilitarias en el JSX de arriba */
const _styleGuide = `
.input { @apply w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-600; }
.select { @apply w-full rounded-lg border px-3 py-2 bg-white outline-none focus:border-violet-600; }
.btn { @apply rounded-lg px-4 py-2 font-medium transition disabled:opacity-60; }
.btn-primary { @apply bg-violet-600 text-white hover:bg-violet-700; }
.btn-outline { @apply bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100; }
.card { @apply bg-white rounded-2xl shadow-sm border border-gray-100; }
.card-title { @apply font-semibold text-gray-900; }
`;

/* Como Tailwind no admite @apply en runtime, si quieres esos atajos,
   copia las reglas de _styleGuide dentro de tu CSS global (index.css)
   o reemplaza las clases utilitarias directamente en el JSX.
*/

/* Switch básico (checkbox estilizado) */
function Switch({ checked, onChange }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-violet-600 transition-colors"></div>
      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
    </label>
  );
}
