"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Eye, Download, UserCheck, LogOut, FileText, User } from "lucide-react"

export function SecretaryPanel() {
  const [solicitudesRepresentante, setSolicitudesRepresentante] = useState([
    {
      id: "1",
      pacienteNombre: "María García",
      pacienteEmail: "maria.garcia@email.com",
      fechaSolicitud: "2024-01-15",
      documento: "carta_representante_maria.pdf",
      estado: "pendiente",
    },
    {
      id: "2",
      pacienteNombre: "Carlos López",
      pacienteEmail: "carlos.lopez@email.com",
      fechaSolicitud: "2024-01-14",
      documento: "solicitud_representante_carlos.pdf",
      estado: "pendiente",
    },
  ])

  const [solicitudesDesvinculacion, setSolicitudesDesvinculacion] = useState([
    {
      id: "1",
      pacienteNombre: "Ana Rodríguez",
      pacienteEmail: "ana.rodriguez@email.com",
      fechaSolicitud: "2024-01-16",
      documento: "solicitud_retiro_ana.pdf",
      estado: "pendiente",
    },
  ])

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleAprobarRepresentante = async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const success = Math.random() > 0.2

      if (success) {
        setSolicitudesRepresentante((prev) =>
          prev.map((sol) => (sol.id === id ? { ...sol, estado: "aprobada" } : sol)),
        )
        setSuccessMessage("Representante legal actualizado correctamente")
        setShowSuccessPopup(true)
        setTimeout(() => setShowSuccessPopup(false), 3000)
      } else {
        setShowErrorPopup(true)
        setTimeout(() => setShowErrorPopup(false), 3000)
      }
    } catch {
      setShowErrorPopup(true)
      setTimeout(() => setShowErrorPopup(false), 3000)
    }
  }

  const handleRechazarRepresentante = async (id) => {
    setSolicitudesRepresentante((prev) =>
      prev.map((sol) => (sol.id === id ? { ...sol, estado: "rechazada" } : sol)),
    )
  }

  const handleAprobarDesvinculacion = async (id) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const success = Math.random() > 0.2

      if (success) {
        setSolicitudesDesvinculacion((prev) =>
          prev.map((sol) => (sol.id === id ? { ...sol, estado: "aprobada" } : sol)),
        )
        setSuccessMessage("Desvinculación realizada correctamente")
        setShowSuccessPopup(true)
        setTimeout(() => setShowSuccessPopup(false), 3000)
      } else {
        setShowErrorPopup(true)
        setTimeout(() => setShowErrorPopup(false), 3000)
      }
    } catch {
      setShowErrorPopup(true)
      setTimeout(() => setShowErrorPopup(false), 3000)
    }
  }

  const handleRechazarDesvinculacion = async (id) => {
    setSolicitudesDesvinculacion((prev) =>
      prev.map((sol) => (sol.id === id ? { ...sol, estado: "rechazada" } : sol)),
    )
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      case "aprobada":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Aprobada
          </Badge>
        )
      case "rechazada":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rechazada
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Secretario</h1>
          <p className="text-gray-600">Gestión de solicitudes de pacientes</p>
        </div>

        <Tabs defaultValue="representante" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="representante" className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Cambios de Representante</span>
            </TabsTrigger>
            <TabsTrigger value="desvinculacion" className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Desvinculaciones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="representante" className="mt-6">
            <div className="grid gap-4">
              {solicitudesRepresentante.map((solicitud) => (
                <Card key={solicitud.id} className="w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <User className="w-5 h-5" style={{ color: "#9083D5" }} />
                        <span>{solicitud.pacienteNombre}</span>
                      </CardTitle>
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Email del paciente</p>
                        <p className="font-medium">{solicitud.pacienteEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de solicitud</p>
                        <p className="font-medium">{solicitud.fechaSolicitud}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Documento</p>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{solicitud.documento}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                        <Eye className="w-4 h-4" />
                        <span>Ver documento</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                        <Download className="w-4 h-4" />
                        <span>Descargar</span>
                      </Button>

                      {solicitud.estado === "pendiente" && (
                        <>
                          <Button
                            onClick={() => handleAprobarRepresentante(solicitud.id)}
                            size="sm"
                            className="flex items-center space-x-1 text-white"
                            style={{ backgroundColor: "#9083D5" }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Aprobar</span>
                          </Button>
                          <Button
                            onClick={() => handleRechazarRepresentante(solicitud.id)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Rechazar</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="desvinculacion" className="mt-6">
            <div className="grid gap-4">
              {solicitudesDesvinculacion.map((solicitud) => (
                <Card key={solicitud.id} className="w-full border-red-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <User className="w-5 h-5 text-red-600" />
                        <span>{solicitud.pacienteNombre}</span>
                      </CardTitle>
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Email del paciente</p>
                        <p className="font-medium">{solicitud.pacienteEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de solicitud</p>
                        <p className="font-medium">{solicitud.fechaSolicitud}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Documento</p>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{solicitud.documento}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-800">
                        <strong>Atención:</strong> La desvinculación es irreversible y eliminará todos los datos del
                        paciente.
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                        <Eye className="w-4 h-4" />
                        <span>Ver documento</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                        <Download className="w-4 h-4" />
                        <span>Descargar</span>
                      </Button>

                      {solicitud.estado === "pendiente" && (
                        <>
                          <Button
                            onClick={() => handleAprobarDesvinculacion(solicitud.id)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Aprobar Desvinculación</span>
                          </Button>
                          <Button
                            onClick={() => handleRechazarDesvinculacion(solicitud.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Rechazar</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#9083D5" }}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Éxito!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600">Hubo un error en la actualización, intenta de nuevo más tarde</p>
          </div>
        </div>
      )}
    </div>
  )
}
