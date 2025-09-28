"use client"

import { useState } from "react"

// === TUS MODALES (carpeta: src/modules/paciente/components) ===
import { AppointmentsModal } from "../components/appointments-modal"
import { MedicalHistoryModal } from "../components/medical-history-modal"
import { NotificationsModal } from "../components/NotificationsModal"
import { PaymentsModal } from "../components/payments-modal"
import { ResultsDocumentsModal } from "../components/results-documents-modal"
import { SecretaryPanel } from "../components/SecretaryPanel"

// === UI de shadcn (alias @ → /src) ===
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  // Estado de modales
  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(false)
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false)
  const [isResultsDocumentsOpen, setIsResultsDocumentsOpen] = useState(false)

  // Notificaciones
  const [unreadCount, setUnreadCount] = useState(0)

  // Datos de paciente de ejemplo (ajusta si ya los traes de tu store o API)
  const patientData = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@email.com",
    documento: "CC 1.234.567.890",
    telefono: "+57 300 000 0000",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Encabezado */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Panel del Paciente</h1>
          <p className="text-gray-600">
            Bienvenido {patientData.nombre}, gestiona tu información y trámites desde aquí.
          </p>
        </header>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen de paciente (simple, sin depender de patient-profile para evitar incompatibilidades) */}
          <Card>
            <CardContent className="p-6 space-y-2">
              <h2 className="text-xl font-semibold mb-2">Mis datos</h2>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-medium">Nombre: </span>
                  {patientData.nombre} {patientData.apellido}
                </p>
                <p>
                  <span className="font-medium">Documento: </span>
                  {patientData.documento}
                </p>
                <p>
                  <span className="font-medium">Email: </span>
                  {patientData.email}
                </p>
                <p>
                  <span className="font-medium">Teléfono: </span>
                  {patientData.telefono}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Acciones rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={() => setIsAppointmentsOpen(true)}>Ver Citas</Button>
                <Button onClick={() => setIsMedicalHistoryOpen(true)}>Historial Médico</Button>
                <Button onClick={() => setIsNotificationsOpen(true)}>
                  Notificaciones {unreadCount > 0 ? `(${unreadCount})` : ""}
                </Button>
                <Button onClick={() => setIsPaymentsOpen(true)}>Pagos</Button>
                <Button className="sm:col-span-2" onClick={() => setIsResultsDocumentsOpen(true)}>
                  Resultados y Documentos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panel de Secretaría (opcional) */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Trámites con Secretaría</h2>
              <SecretaryPanel />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* === MODALES === */}
      <AppointmentsModal isOpen={isAppointmentsOpen} onClose={() => setIsAppointmentsOpen(false)} />

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

      <PaymentsModal isOpen={isPaymentsOpen} onClose={() => setIsPaymentsOpen(false)} />

      <ResultsDocumentsModal
        isOpen={isResultsDocumentsOpen}
        onClose={() => setIsResultsDocumentsOpen(false)}
      />
    </div>
  )
}
