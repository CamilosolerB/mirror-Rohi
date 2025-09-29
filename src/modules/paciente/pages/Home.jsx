"use client";

import React, { useState } from "react";

// Importa TUS componentes (rutas relativas desde /pages/Home.jsx)
import AppointmentsModal from "../components/appointments-modal";
import MedicalHistoryModal from "../components/medical-history-modal";
import NotificationsModal from "../components/NotificationsModal";
import { PaymentsModal } from "../components/payments-modal";
import ResultsDocumentsModal from "../components/results-documents-modal";
import PatientProfile from "../components/patient-profile";

// Íconos (opcional)
import {
  Calendar,
  FileText,
  Bell,
  CreditCard,
  FileSpreadsheet,
  User,
  UserCog,
} from "lucide-react";

export default function Home() {
  // Estados para abrir/cerrar modales
  const [openAppointments, setOpenAppointments] = useState(false);
  const [openMedicalHistory, setOpenMedicalHistory] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const [openResultsDocs, setOpenResultsDocs] = useState(false);

  // Estado demo para contador de notificaciones
  const [unreadCount, setUnreadCount] = useState(3);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  // Datos demo para perfil (ahora en estado para poder actualizar desde el modal)
  const [patientData, setPatientData] = useState({
    nombre: "Juan Carlos",
    apellido: "García López",
    email: "juan.garcia@email.com",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-">
            BIENVENIDO A ROHI IPS
          </h1>
            <h2 className="text-xl font-bold text-[#9083D5]">Crear cuenta</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenNotifications(true)}
              className="relative inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              title="Centro de notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-violet-600 text-white text-[10px] px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile icon replaces Agendar */}
            <button
              onClick={() => setShowProfileSidebar(true)}
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-gray-100"
              title="Perfil"
              aria-label="Perfil"
            >
              👤
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Tarjetas de acceso rápido (sin shadcn/ui) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <HomeCard
            title="Citas"
            desc="Gestiona y revisa tus citas médicas."
            icon={<Calendar className="w-5 h-5" />}
            onClick={() => setOpenAppointments(true)}
          />

          <HomeCard
            title="Historial Médico"
            desc="Revisa consultas, diagnósticos y tratamientos."
            icon={<FileText className="w-5 h-5" />}
            onClick={() => setOpenMedicalHistory(true)}
          />

          <HomeCard
            title="Resultados y Documentos"
            desc="Descarga laboratorios, imágenes e informes."
            icon={<FileSpreadsheet className="w-5 h-5" />}
            onClick={() => setOpenResultsDocs(true)}
          />

          <HomeCard
            title="Pagos"
            desc="Consulta y descarga tus comprobantes."
            icon={<CreditCard className="w-5 h-5" />}
            onClick={() => setOpenPayments(true)}
          />

          <HomeCard
            title="Perfil"
            desc="Actualiza tus datos personales."
            icon={<User className="w-5 h-5" />}
            onClick={() => setOpenProfileModal(true)}
            cta="Abrir"
          />
          
          {/* Tarjeta de Secretaría eliminada */}
        </div>

        {/* Sección de perfil integrada ahora en modal/drawer; sección estática eliminada */}

        {/* Sección de Secretaría eliminada */}
      </main>

      {/* ======= Modales ======= */}

      {/* Citas */}
      <AppointmentsModal
        isOpen={openAppointments}
        onClose={() => setOpenAppointments(false)}
      />

      {/* Historial Médico */}
      <MedicalHistoryModal
        isOpen={openMedicalHistory}
        onClose={() => setOpenMedicalHistory(false)}
        patientData={patientData}
      />

      {/* Notificaciones */}
      <NotificationsModal
        isOpen={openNotifications}
        onClose={() => setOpenNotifications(false)}
        unreadCount={unreadCount}
        onUpdateUnreadCount={setUnreadCount}
      />

      {/* Pagos */}
      <PaymentsModal
        isOpen={openPayments}
        onClose={() => setOpenPayments(false)}
      />

      {/* Resultados / Documentos */}
      <ResultsDocumentsModal
        isOpen={openResultsDocs}
        onClose={() => setOpenResultsDocs(false)}
      />

      {/* Perfil en modal (renderizado desde la sección de 'Mi Perfil') */}
      {/* Profile sidebar drawer (opened from header) */}
      {showProfileSidebar && (
        <div className="fixed inset-y-0 right-0 z-[60] w-72 bg-white shadow-lg border-l">
          <div className="p-4 flex items-center justify-between border-b">
            <h3 className="font-semibold">Cuenta</h3>
            <button className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100" onClick={() => setShowProfileSidebar(false)}>✕</button>
          </div>
          <div className="p-4 space-y-3">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50" onClick={() => { setOpenProfileModal(true); setShowProfileSidebar(false); }}>
              Mi Perfil
            </button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-red-600" onClick={() => { alert('Cerrar sesión (a implementar)'); }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function HomeCard({ title, desc, icon, onClick, cta = "Abrir" }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 text-violet-700 mb-2">{icon}<span className="font-medium">{title}</span></div>
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      <button
        onClick={onClick}
        className="inline-flex items-center rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        {cta}
      </button>
    </div>
  );
}
