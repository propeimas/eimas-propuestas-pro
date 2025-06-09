
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit2, Trash2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getStoredProposals, deleteStoredProposal, StoredProposal } from "@/services/proposalStorage";
import { downloadPDF } from "@/services/pdfService";

export default function VerPropuestas() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [propuestas, setPropuestas] = useState<StoredProposal[]>([]);
  const [filteredPropuestas, setFilteredPropuestas] = useState<StoredProposal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar propuestas al montar el componente
  useEffect(() => {
    loadPropuestas();
  }, []);

  const loadPropuestas = async () => {
    setLoading(true);
    try {
      const storedProposals = await getStoredProposals();
      setPropuestas(storedProposals);
      setFilteredPropuestas(storedProposals);
    } catch (error) {
      console.error('Error loading propuestas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las propuestas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar propuestas por término de búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPropuestas(propuestas);
    } else {
      const filtered = propuestas.filter(item => 
        item.propuesta.codigoPropuesta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.propuesta.empresaCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.propuesta.tipoServicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.propuesta.nombreSolicitante?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPropuestas(filtered);
    }
  }, [searchTerm, propuestas]);

  const handleEdit = (propuestaId: string) => {
    navigate(`/nueva-propuesta/${propuestaId}`);
  };

  const handleDelete = async (propuestaId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta propuesta?')) {
      return;
    }

    try {
      const success = await deleteStoredProposal(propuestaId);
      if (success) {
        toast({
          title: "Propuesta eliminada",
          description: `La propuesta ha sido eliminada exitosamente`,
        });
        // Recargar la lista
        await loadPropuestas();
      } else {
        throw new Error('No se pudo eliminar la propuesta');
      }
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la propuesta",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = async (propuestaData: StoredProposal) => {
    try {
      // Configuración de empresa ejemplo
      const configuracion = {
        nombreEmpresa: "EIMAS - Estudios e Investigaciones en Monitoreo Ambiental y Sanitario",
        telefono: "+57 300 123 4567",
        direccion: "Calle 123 #45-67, Bogotá, Colombia",
        email: "info@eimas.com.co",
        resolucion: "Resolución 1234 del 2024",
        compromisos: [
          "Entrega puntual del informe",
          "Verificación con laboratorio acreditado",
          "Uso de equipos calibrados",
          "Personal certificado y calificado",
          "Cumplimiento de normatividad vigente"
        ]
      };

      await downloadPDF({
        propuesta: propuestaData.propuesta,
        caracteristicas: propuestaData.caracteristicas,
        personal: propuestaData.personal,
        costos: propuestaData.costos,
        configuracion
      });

      toast({
        title: "PDF descargado",
        description: `PDF de la propuesta ${propuestaData.propuesta.codigoPropuesta} descargado exitosamente`,
      });
    } catch (error) {
      toast({
        title: "Error al generar PDF",
        description: "No se pudo generar el archivo PDF",
        variant: "destructive"
      });
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'ACEPTADA': return 'default';
      case 'PENDIENTE': return 'secondary';
      case 'EN PROCESO': return 'outline';
      case 'RECHAZADA': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Ver Propuestas" 
          subtitle="Gestión y visualización de propuestas comerciales"
        />
        <div className="p-6">
          <div className="text-center">Cargando propuestas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Ver Propuestas" 
        subtitle="Gestión y visualización de propuestas comerciales"
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-secondary" />
                <span>Listado de Propuestas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Barra de búsqueda */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Buscar por código, cliente, tipo de servicio o solicitante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={loadPropuestas} variant="outline">
                  Actualizar
                </Button>
              </div>

              {/* Tabla de propuestas */}
              {filteredPropuestas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {propuestas.length === 0 ? 
                    "No hay propuestas guardadas" : 
                    "No se encontraron propuestas con ese criterio de búsqueda"
                  }
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo de Servicio</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPropuestas.map((item) => (
                      <TableRow key={item.propuesta.id}>
                        <TableCell className="font-medium">
                          {item.propuesta.codigoPropuesta}
                        </TableCell>
                        <TableCell>{item.propuesta.empresaCliente}</TableCell>
                        <TableCell>{item.propuesta.tipoServicio}</TableCell>
                        <TableCell>{item.propuesta.nombreSolicitante}</TableCell>
                        <TableCell>
                          <Badge variant={getEstadoBadgeVariant(item.propuesta.estado)}>
                            {item.propuesta.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ${item.propuesta.valorPropuesta?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell>
                          {item.propuesta.fechaRecepcion ? 
                            new Date(item.propuesta.fechaRecepcion).toLocaleDateString() : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(item.propuesta.id!)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadPDF(item)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(item.propuesta.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
