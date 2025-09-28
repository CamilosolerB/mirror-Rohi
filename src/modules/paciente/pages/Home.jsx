"use client"

import { useState } from "react"

// === Modales (src/modules/paciente/components) ===
import { AppointmentsModal } from "../components/appointments-modal"
import { MedicalHistoryModal } from "../components/medical-history-modal"
import { NotificationsModal } from "../components/NotificationsModal"
import { PaymentsModal } from "../components/payments-modal"
import { ResultsDocumentsModal } from "../components/results-documents-modal"
import { SecretaryPanel } from "../components/SecretaryPanel" // opcional: si no lo necesitas, elimina esta línea y su Card

// Si tu PatientProfile exporta "default", usa:
// import PatientProfile from "../components/patient-profile"
// Si exporta nombrado (como el resto), usa:
import { PatientProfile } from "../components/patient-profile"

// === UI (src/components/ui/*) – rutas relativas desde Home.jsx ===
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Separator } from "../../../components/ui/separator"

export default function Home() {
  // Estados de los modales
  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(false)
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false)
  const [isResultsDocumentsOpen, setIsResultsDocumentsOpen] = useState(false)

  // Contador de no leídas (notificaciones)
  const [unreadCount, setUnreadCount] = useState(0)

  // Datos mínimos del paciente para los componentes que lo requieren
  const patientData = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@email.com",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel del Paciente</h1>
          <p className="text-gray-600">
            Bienvenido {patientData.nombre}, gestiona tu información y trámites desde aquí.
          </p>
        </div>

        <Separator />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Perfil */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mi Perfil</h2>
              <PatientProfile patientData={patientData} />
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={() => setIsAppointmentsOpen(true)}>Ver Citas</Button>
                <Button onClick={() => setIsMedicalHistoryOpen(true)}>Historial Médico</Button>
                <Button onClick={() => setIsNotificationsOpen(true)}>
                  Notificaciones {unreadCount > 0 ? `(${unreadCount})` : ""}
                </Button>
                <Button onClick={() => setIsPaymentsOpen(true)}>Pagos</Button>
                <Button
                  className="sm:col-span-2"
                  onClick={() => setIsResultsDocumentsOpen(true)}
                >
                  Resultados y Documentos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* (Opcional) Panel del secretario si lo usas en esta vista */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Trámites con Secretaría</h2>
              <SecretaryPanel />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== Modales ===== */}
      <AppointmentsModal
        isOpen={isAppointmentsOpen}
        onClose={() => setIsAppointmentsOpen(false)}
      />

      <MedicalHistoryModal
        isOpen={isMedicalHistoryOpen}
        onClose={() => setIsMedicalHistoryOpen(false)}
        patientData={patientData}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        unreadCount={unreadCount}
        onUpdateUnreadCount={setUnreadCount}
      />

      <PaymentsModal
        isOpen={isPaymentsOpen}
        onClose={() => setIsPaymentsOpen(false)}
      />

      <ResultsDocumentsModal
        isOpen={isResultsDocumentsOpen}
        onClose={() => setIsResultsDocumentsOpen(false)}
      />
    </div>
  )
}
