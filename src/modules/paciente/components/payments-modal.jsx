"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  X,
  Search,
  Download,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Printer,
} from "lucide-react";

export function PaymentsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("historial");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todos");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Datos de ejemplo de pagos
  const [payments] = useState([
    {
      id: "1",
      reference: "PAY-2024-001",
      date: "2024-01-15",
      amount: 150000,
      method: "Tarjeta de Crédito",
      status: "pagado",
      service: "Consulta Cardiología",
      description: "Consulta especializada en cardiología",
      invoiceNumber: "INV-2024-001",
    },
    {
      id: "2",
      reference: "PAY-2024-002",
      date: "2024-01-10",
      amount: 85000,
      method: "PSE",
      status: "pagado",
      service: "Exámenes de Laboratorio",
      description: "Perfil lipídico y hemograma completo",
      invoiceNumber: "INV-2024-002",
    },
    {
      id: "3",
      reference: "PAY-2024-003",
      date: "2024-01-08",
      amount: 200000,
      method: "Efectivo",
      status: "pagado",
      service: "Ecografía Abdominal",
      description: "Ecografía abdominal completa",
      invoiceNumber: "INV-2024-003",
    },
    {
      id: "4",
      reference: "PAY-2024-004",
      date: "2024-01-05",
      amount: 120000,
      method: "Tarjeta de Débito",
      status: "pendiente",
      service: "Consulta Dermatología",
      description: "Consulta dermatológica de control",
      invoiceNumber: "INV-2024-004",
    },
  ]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "todos" || payment.status === statusFilter;

    const matchesDate =
      dateFilter === "todos" ||
      (() => {
        const paymentDate = new Date(payment.date);
        const now = new Date();

        switch (dateFilter) {
          case "ultima-semana": {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          }
          case "ultimo-mes": {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return paymentDate >= monthAgo;
          }
          case "ultimo-trimestre": {
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return paymentDate >= quarterAgo;
          }
          default:
            return true;
        }
      })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPagado = filteredPayments
    .filter((p) => p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pagado":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pendiente":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "fallido":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pagado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "fallido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadReceipt = async (payment) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pdfContent = `
        ROHI IPS
        Comprobante de Pago
        
        Número de Factura: ${payment.invoiceNumber}
        Referencia: ${payment.reference}
        Fecha: ${formatDate(payment.date)}
        
        Paciente: Juan Carlos García López
        Servicio: ${payment.service}
        Descripción: ${payment.description}
        
        Método de Pago: ${payment.method}
        Valor Total: ${formatCurrency(payment.amount)}
        Estado: ${payment.status.toUpperCase()}
        
        Este documento es un comprobante oficial de pago.
      `;

      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `comprobante-${payment.reference}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintReceipt = (payment) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #9083D5; margin: 0;">ROHI IPS</h1>
          <h2 style="margin: 10px 0;">Comprobante de Pago</h2>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
          <p><strong>Número de Factura:</strong> ${payment.invoiceNumber}</p>
          <p><strong>Referencia:</strong> ${payment.reference}</p>
          <p><strong>Fecha:</strong> ${formatDate(payment.date)}</p>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px;">
          <p><strong>Paciente:</strong> Juan Carlos García López</p>
          <p><strong>Servicio:</strong> ${payment.service}</p>
          <p><strong>Descripción:</strong> ${payment.description}</p>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 20px; background-color: #f9f9f9;">
          <p><strong>Método de Pago:</strong> ${payment.method}</p>
          <p><strong>Valor Total:</strong> ${formatCurrency(payment.amount)}</p>
          <p><strong>Estado:</strong> ${payment.status.toUpperCase()}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
          <p>Este documento es un comprobante oficial de pago.</p>
          <p>Generado el ${new Date().toLocaleDateString("es-ES")}</p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#9083D5" }}
            >
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Pagos</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
              <TabsTrigger value="historial">Historial de Pagos</TabsTrigger>
              <TabsTrigger value="detalle">Detalle de Pago</TabsTrigger>
            </TabsList>

            <TabsContent value="historial" className="flex-1 overflow-hidden p-6 pt-4">
              <div className="h-full flex flex-col space-y-4">
                {/* Filtros y búsqueda */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por referencia, servicio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="fallido">Fallido</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los períodos</SelectItem>
                      <SelectItem value="ultima-semana">Última semana</SelectItem>
                      <SelectItem value="ultimo-mes">Último mes</SelectItem>
                      <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Total Pagado</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalPagado)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" style={{ color: "#9083D5" }} />
                        <div>
                          <p className="text-sm text-gray-600">Total Transacciones</p>
                          <p className="text-lg font-semibold text-gray-900">{filteredPayments.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Pagos Exitosos</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {filteredPayments.filter((p) => p.status === "pagado").length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de pagos */}
                <div className="flex-1 overflow-auto">
                  <div className="space-y-3">
                    {filteredPayments.map((payment) => (
                      <Card key={payment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {getStatusIcon(payment.status)}
                                <h3 className="font-semibold text-gray-900">{payment.service}</h3>
                                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Referencia:</span> {payment.reference}
                                </div>
                                <div>
                                  <span className="font-medium">Fecha:</span> {formatDate(payment.date)}
                                </div>
                                <div>
                                  <span className="font-medium">Método:</span> {payment.method}
                                </div>
                                <div>
                                  <span className="font-medium">Valor:</span> {formatCurrency(payment.amount)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setActiveTab("detalle");
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>

                              {payment.status === "pagado" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadReceipt(payment)}
                                  disabled={isLoading}
                                  style={{ borderColor: "#9083D5", color: "#9083D5" }}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  {isLoading ? "Generando..." : "PDF"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredPayments.length === 0 && (
                      <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No se encontraron pagos con los filtros aplicados</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detalle" className="flex-1 overflow-auto p-6 pt-4">
              {selectedPayment ? (
                <div className="max-w-2xl mx-auto space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" style={{ color: "#9083D5" }} />
                        <span>Detalle del Pago</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Referencia del Pago</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedPayment.reference}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Número de Factura</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedPayment.invoiceNumber}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Fecha de Transacción</label>
                          <p className="text-lg font-semibold text-gray-900">{formatDate(selectedPayment.date)}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Método de Pago</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedPayment.method}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Valor Total</label>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedPayment.amount)}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Estado del Pago</label>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(selectedPayment.status)}
                            <Badge className={getStatusColor(selectedPayment.status)}>{selectedPayment.status}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <label className="text-sm font-medium text-gray-600">Servicio</label>
                        <p className="text-lg font-semibold text-gray-900 mb-2">{selectedPayment.service}</p>
                        <label className="text-sm font-medium text-gray-600">Descripción</label>
                        <p className="text-gray-700">{selectedPayment.description}</p>
                      </div>

                      {selectedPayment.status === "pagado" && (
                        <div className="border-t pt-4">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={() => handleDownloadReceipt(selectedPayment)}
                              disabled={isLoading}
                              className="flex-1 text-white"
                              style={{ backgroundColor: "#9083D5" }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {isLoading ? "Generando PDF..." : "Descargar Comprobante PDF"}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => handlePrintReceipt(selectedPayment)}
                              className="flex-1"
                              style={{ borderColor: "#9083D5", color: "#9083D5" }}
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Imprimir Comprobante
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Selecciona un pago del historial para ver los detalles</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Pop-ups de éxito y error */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-60">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Comprobante descargado correctamente</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-60">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>No fue posible generar el comprobante, intenta nuevamente</span>
          </div>
        </div>
      )}
    </div>
  );
}
