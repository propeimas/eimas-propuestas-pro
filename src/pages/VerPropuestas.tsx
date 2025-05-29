
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerPropuestas() {
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo - se conectará con Firestore
  const propuestas = [
    {
      id: "1",
      codigoPropuesta: "P-EMPRESA1-29052025-01",
      fechaRecepcion: "2025-05-29",
      empresaCliente: "Empresa Ejemplo S.A.S",
      tipoServicio: "Monitoreo de calidad del aire",
      valorPropuesta: 15000000,
      estado: "PENDIENTE"
    },
    // Más propuestas se cargarán desde Firestore
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'EN PROCESO': 'bg-blue-100 text-blue-800 border-blue-300', 
      'ACEPTADA': 'bg-green-100 text-green-800 border-green-300',
      'RECHAZADA': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <Badge className={`${variants[estado as keyof typeof variants]} border`}>
        {estado}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredPropuestas = propuestas.filter(propuesta =>
    propuesta.empresaCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    propuesta.codigoPropuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    propuesta.tipoServicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Ver Propuestas" 
        subtitle="Gestionar todas las propuestas de servicios"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-secondary" />
                <span>Lista de Propuestas</span>
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Buscar propuestas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Button asChild className="eimas-gradient">
                  <Link to="/nueva-propuesta">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Propuesta
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredPropuestas.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No hay propuestas registradas
                </h3>
                <p className="text-gray-500 mb-6">
                  Comienza creando tu primera propuesta de servicios de ingeniería ambiental
                </p>
                <Button asChild className="eimas-gradient">
                  <Link to="/nueva-propuesta">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primera Propuesta
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Fecha Recepción</TableHead>
                      <TableHead>Empresa Cliente</TableHead>
                      <TableHead>Tipo de Servicio</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropuestas.map((propuesta) => (
                      <TableRow key={propuesta.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {propuesta.codigoPropuesta}
                        </TableCell>
                        <TableCell>
                          {new Date(propuesta.fechaRecepcion).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>{propuesta.empresaCliente}</TableCell>
                        <TableCell>{propuesta.tipoServicio}</TableCell>
                        <TableCell>{formatCurrency(propuesta.valorPropuesta)}</TableCell>
                        <TableCell>
                          {getEstadoBadge(propuesta.estado)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              title="Descargar PDF"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              title="Editar propuesta"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              title="Eliminar propuesta"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
