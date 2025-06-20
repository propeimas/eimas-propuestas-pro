import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Save, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Propuesta, CaracteristicasTecnicas, PersonalEquipo, DesgloseCostos } from "@/types/proposal";
import { useToast } from "@/hooks/use-toast";
import { CaracteristicasTecnicasForm } from "@/components/forms/CaracteristicasTecnicasForm";
import { PersonalEquipoForm } from "@/components/forms/PersonalEquipoForm";
import { DesgloseCostosForm } from "@/components/forms/DesgloseCostosForm";
import { downloadPDF, generateProposalCode } from "@/services/pdfService";
import { Combobox } from "@/components/ui/combobox";
import { saveCompleteProposal, getStoredProposal } from "@/services/proposalStorage";

export default function NuevaPropuesta() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  // Estados para cada formulario
  const [formData, setFormData] = useState<Partial<Propuesta>>({
    fechaRecepcion: new Date().toISOString().split('T')[0],
    medioSolicitud: '',
    nombreSolicitante: '',
    nombreReceptor: '',
    empresaCliente: '',
    mesAproximadoServicio: '',
    tipoServicio: '',
    municipio: '',
    telefono: '',
    email: '',
    descripcionServicio: '',
    valorPropuesta: 0,
    seguimientoObservaciones: '',
    objetivo: '',
    alcance: '',
    estado: 'PENDIENTE'
  });

  const [caracteristicas, setCaracteristicas] = useState<CaracteristicasTecnicas>({
    propuestaId: '',
    metodologia: '',
    equiposUtilizados: [],
    parametrosAnalizar: [],
    normasReferencia: [],
    procedimientos: '',
    controlCalidad: ''
  });

  const [personalEquipo, setPersonalEquipo] = useState<PersonalEquipo>({
    propuestaId: '',
    personal: [],
    equipos: []
  });

  const [desgloseCostos, setDesgloseCostos] = useState<DesgloseCostos>({
    propuestaId: '',
    items: [],
    subtotal: 0,
    iva: 0,
    total: 0
  });

  // Estados para fechas
  const [fechaRecepcion, setFechaRecepcion] = useState<Date>(new Date());
  const [fechaAprobacion, setFechaAprobacion] = useState<Date>();
  const [mesServicio, setMesServicio] = useState<Date>();

  // Estados para tipos de servicio personalizados
  const [tiposServicioPersonalizados, setTiposServicioPersonalizados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing && id) {
      loadProposalData(id);
    }
  }, [isEditing, id]);

  const loadProposalData = async (proposalId: string) => {
    setLoading(true);
    try {
      const proposalData = await getStoredProposal(proposalId);
      if (proposalData) {
        // Cargar datos principales
        setFormData(proposalData.propuesta);
        
        // Cargar fechas
        if (proposalData.propuesta.fechaRecepcion) {
          setFechaRecepcion(new Date(proposalData.propuesta.fechaRecepcion));
        }
        if (proposalData.propuesta.fechaAprobacion) {
          setFechaAprobacion(new Date(proposalData.propuesta.fechaAprobacion));
        }
        if (proposalData.propuesta.mesAproximadoServicio) {
          setMesServicio(new Date(proposalData.propuesta.mesAproximadoServicio));
        }
        
        // Cargar otros datos
        setCaracteristicas(proposalData.caracteristicas);
        setPersonalEquipo(proposalData.personal);
        setDesgloseCostos(proposalData.costos);
        
        toast({
          title: "Propuesta cargada",
          description: "Los datos de la propuesta han sido cargados para edición",
        });
      }
    } catch (error) {
      toast({
        title: "Error al cargar propuesta",
        description: "No se pudieron cargar los datos de la propuesta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const mediosSolicitud = [
    "Email",
    "WhatsApp", 
    "Llamada telefónica",
    "Reunión presencial",
    "Página web",
    "Referido"
  ];

  const tiposServicioBase = [
    "Monitoreo de calidad del aire",
    "Monitoreo de ruido ambiental",
    "Estudios de impacto ambiental",
    "Caracterización de residuos",
    "Monitoreo de agua",
    "Consultoría ambiental",
    "Otro"
  ];

  // Combinar tipos base con personalizados
  const tiposServicio = [...tiposServicioBase, ...tiposServicioPersonalizados];

  const estados = [
    "PENDIENTE",
    "EN PROCESO", 
    "ACEPTADA",
    "RECHAZADA"
  ];

  const handleInputChange = (field: keyof Propuesta, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTipoServicioChange = (value: string) => {
    // Si es un tipo nuevo, agregarlo a la lista personalizada
    if (!tiposServicioBase.includes(value) && !tiposServicioPersonalizados.includes(value)) {
      setTiposServicioPersonalizados(prev => [...prev, value]);
    }
    handleInputChange('tipoServicio', value);
  };

  // Función para validar datos antes de guardar
  const validateFormData = () => {
    const errors: string[] = [];
    
    if (!fechaRecepcion) errors.push("Fecha de recepción es requerida");
    if (!formData.medioSolicitud) errors.push("Medio de solicitud es requerido");
    if (!formData.nombreSolicitante) errors.push("Nombre del solicitante es requerido");
    if (!formData.nombreReceptor) errors.push("Nombre del receptor es requerido");
    if (!formData.empresaCliente) errors.push("Empresa cliente es requerida");
    if (!formData.tipoServicio) errors.push("Tipo de servicio es requerido");
    if (!formData.municipio) errors.push("Municipio es requerido");
    if (!formData.telefono) errors.push("Teléfono es requerido");
    if (!formData.email) errors.push("Email es requerido");
    if (!formData.descripcionServicio) errors.push("Descripción del servicio es requerida");
    
    // Validar valor de propuesta: considerar tanto el valor manual como el desglose de costos
    const tieneValorManual = formData.valorPropuesta && formData.valorPropuesta > 0;
    const tieneDesgloseCostos = desgloseCostos.items.length > 0 && desgloseCostos.total > 0;
    
    if (!tieneValorManual && !tieneDesgloseCostos) {
      errors.push("Debe ingresar un valor de propuesta o agregar ítems al desglose de costos");
    }
    
    return errors;
  };

  // Función para limpiar formulario
  const clearForm = () => {
    setFormData({
      fechaRecepcion: new Date().toISOString().split('T')[0],
      medioSolicitud: '',
      nombreSolicitante: '',
      nombreReceptor: '',
      empresaCliente: '',
      mesAproximadoServicio: '',
      tipoServicio: '',
      municipio: '',
      telefono: '',
      email: '',
      descripcionServicio: '',
      valorPropuesta: 0,
      seguimientoObservaciones: '',
      objetivo: '',
      alcance: '',
      estado: 'PENDIENTE'
    });
    
    setCaracteristicas({
      propuestaId: '',
      metodologia: '',
      equiposUtilizados: [],
      parametrosAnalizar: [],
      normasReferencia: [],
      procedimientos: '',
      controlCalidad: ''
    });
    
    setPersonalEquipo({
      propuestaId: '',
      personal: [],
      equipos: []
    });
    
    setDesgloseCostos({
      propuestaId: '',
      items: [],
      subtotal: 0,
      iva: 0,
      total: 0
    });
    
    setFechaRecepcion(new Date());
    setFechaAprobacion(undefined);
    setMesServicio(undefined);
  };

  const handleGeneratePDF = async () => {
    try {
      const errors = validateFormData();
      
      if (errors.length > 0) {
        toast({
          title: "Errores en el formulario",
          description: errors.join(", "),
          variant: "destructive"
        });
        return;
      }

      const codigoPropuesta = formData.codigoPropuesta || generateProposalCode();
      
      // Usar el valor del desglose si está disponible, sino el valor manual
      const valorFinal = desgloseCostos.total > 0 ? desgloseCostos.total : (formData.valorPropuesta || 0);
      
      const propuesta: Propuesta = {
        ...formData as Propuesta,
        codigoPropuesta,
        valorPropuesta: valorFinal,
        fechaRecepcion: fechaRecepcion ? fechaRecepcion.toISOString().split('T')[0] : '',
        fechaAprobacion: fechaAprobacion ? fechaAprobacion.toISOString().split('T')[0] : '',
        mesAproximadoServicio: mesServicio ? mesServicio.toISOString().split('T')[0] : '',
        duracion: fechaRecepcion && fechaAprobacion ? 
          Math.ceil((fechaAprobacion.getTime() - fechaRecepcion.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Configuración de empresa ejemplo (en producción vendría de Firestore)
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
        propuesta,
        caracteristicas,
        personal: personalEquipo,
        costos: desgloseCostos,
        configuracion
      });

      toast({
        title: "PDF generado exitosamente",
        description: `Se ha descargado la propuesta ${codigoPropuesta}`,
      });
    } catch (error) {
      toast({
        title: "Error al generar PDF",
        description: "Hubo un problema al crear el archivo PDF",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateFormData();
    
    if (errors.length > 0) {
      toast({
        title: "Errores en el formulario",
        description: errors.join(", "),
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const codigoPropuesta = formData.codigoPropuesta || generateProposalCode();
      
      // Usar el valor del desglose si está disponible, sino el valor manual
      const valorFinal = desgloseCostos.total > 0 ? desgloseCostos.total : (formData.valorPropuesta || 0);
      
      const propuesta: Propuesta = {
        ...formData as Propuesta,
        codigoPropuesta,
        valorPropuesta: valorFinal,
        fechaRecepcion: fechaRecepcion ? fechaRecepcion.toISOString().split('T')[0] : '',
        fechaAprobacion: fechaAprobacion ? fechaAprobacion.toISOString().split('T')[0] : '',
        mesAproximadoServicio: mesServicio ? mesServicio.toISOString().split('T')[0] : '',
        duracion: fechaRecepcion && fechaAprobacion ? 
          Math.ceil((fechaAprobacion.getTime() - fechaRecepcion.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Crear objeto completo de la propuesta con todos los datos
      const propuestaCompleta = {
        propuesta,
        caracteristicas: {
          ...caracteristicas,
          propuestaId: codigoPropuesta
        },
        personal: {
          ...personalEquipo,
          propuestaId: codigoPropuesta
        },
        costos: {
          ...desgloseCostos,
          propuestaId: codigoPropuesta
        }
      };
      
      // Guardar en Firestore
      await saveCompleteProposal(propuestaCompleta);
      
      console.log('Propuesta guardada en Firestore:', propuesta);
      
      // Mostrar mensaje de éxito
      toast({
        title: "Propuesta guardada exitosamente",
        description: `Código de propuesta: ${codigoPropuesta}. La propuesta ha sido guardada en Firestore.`,
      });

      // Limpiar formulario después de guardar exitosamente
      setTimeout(() => {
        clearForm();
        if (isEditing) {
          navigate('/propuestas');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error al guardar propuesta:', error);
      toast({
        title: "Error al guardar",
        description: "Hubo un problema al guardar la propuesta en Firestore. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title={isEditing ? "Editar Propuesta" : "Nueva Propuesta"} 
          subtitle={isEditing ? "Modificar propuesta existente" : "Crear una nueva propuesta de servicios de ingeniería ambiental"}
        />
        <div className="p-6">
          <div className="text-center">Cargando datos de la propuesta...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={isEditing ? "Editar Propuesta" : "Nueva Propuesta"} 
        subtitle={isEditing ? "Modificar propuesta existente" : "Crear una nueva propuesta de servicios de ingeniería ambiental"}
      />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Datos Generales</TabsTrigger>
              <TabsTrigger value="tecnicas">Características Técnicas</TabsTrigger>
              <TabsTrigger value="personal">Personal y Equipos</TabsTrigger>
              <TabsTrigger value="costos">Desglose de Costos</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    <span>Formulario Principal - Datos Generales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Recepción de Solicitud *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !fechaRecepcion && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaRecepcion ? (
                              format(fechaRecepcion, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fechaRecepcion}
                            onSelect={setFechaRecepcion}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha de Aprobación</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !fechaAprobacion && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaAprobacion ? (
                              format(fechaAprobacion, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={fechaAprobacion}
                            onSelect={setFechaAprobacion}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Mes Aproximado del Servicio</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !mesServicio && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {mesServicio ? (
                              format(mesServicio, "MMMM yyyy", { locale: es })
                            ) : (
                              <span>Seleccionar mes</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={mesServicio}
                            onSelect={setMesServicio}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Medio por el cual se hace la solicitud *</Label>
                      <Select 
                        value={formData.medioSolicitud || ''} 
                        onValueChange={(value) => handleInputChange('medioSolicitud', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar medio" />
                        </SelectTrigger>
                        <SelectContent>
                          {mediosSolicitud.map((medio) => (
                            <SelectItem key={medio} value={medio}>
                              {medio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado de la propuesta</Label>
                      <Select 
                        value={formData.estado || 'PENDIENTE'}
                        onValueChange={(value) => handleInputChange('estado', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de quien hace la solicitud *</Label>
                      <Input 
                        placeholder="Nombre completo del solicitante"
                        value={formData.nombreSolicitante || ''}
                        onChange={(e) => handleInputChange('nombreSolicitante', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Nombre de quien recibe la solicitud *</Label>
                      <Input 
                        placeholder="Nombre del receptor"
                        value={formData.nombreReceptor || ''}
                        onChange={(e) => handleInputChange('nombreReceptor', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Información de la empresa cliente */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nombre de la empresa que requiere el servicio *</Label>
                      <Input 
                        placeholder="Razón social de la empresa cliente"
                        value={formData.empresaCliente || ''}
                        onChange={(e) => handleInputChange('empresaCliente', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de servicio *</Label>
                        <Combobox
                          options={tiposServicio}
                          value={formData.tipoServicio || ''}
                          onValueChange={handleTipoServicioChange}
                          placeholder="Seleccionar o escribir tipo de servicio"
                          allowCustom={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Municipio donde se realizaría el monitoreo *</Label>
                        <Input 
                          placeholder="Ciudad/Municipio"
                          value={formData.municipio || ''}
                          onChange={(e) => handleInputChange('municipio', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Teléfono *</Label>
                        <Input 
                          type="tel"
                          placeholder="Número de contacto"
                          value={formData.telefono || ''}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Correo electrónico *</Label>
                        <Input 
                          type="email"
                          placeholder="email@empresa.com"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción y costos */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Descripción del servicio solicitado *</Label>
                      <Textarea 
                        placeholder="Detalle completo del servicio requerido..."
                        rows={4}
                        value={formData.descripcionServicio || ''}
                        onChange={(e) => handleInputChange('descripcionServicio', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Objetivo</Label>
                      <Textarea 
                        placeholder="Objetivo principal del servicio..."
                        rows={3}
                        value={formData.objetivo || ''}
                        onChange={(e) => handleInputChange('objetivo', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Alcance</Label>
                      <Textarea 
                        placeholder="Alcance del trabajo a realizar..."
                        rows={3}
                        value={formData.alcance || ''}
                        onChange={(e) => handleInputChange('alcance', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valor de la propuesta (COP) *</Label>
                        <Input 
                          type="number"
                          placeholder="0"
                          value={formData.valorPropuesta || ''}
                          onChange={(e) => handleInputChange('valorPropuesta', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Seguimiento y observaciones</Label>
                      <Textarea 
                        placeholder="Observaciones adicionales, seguimiento, comentarios..."
                        rows={3}
                        value={formData.seguimientoObservaciones || ''}
                        onChange={(e) => handleInputChange('seguimientoObservaciones', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tecnicas">
              <CaracteristicasTecnicasForm 
                data={caracteristicas}
                onDataChange={setCaracteristicas}
              />
            </TabsContent>

            <TabsContent value="personal">
              <PersonalEquipoForm 
                data={personalEquipo}
                onDataChange={setPersonalEquipo}
              />
            </TabsContent>

            <TabsContent value="costos">
              <DesgloseCostosForm 
                data={desgloseCostos}
                onDataChange={setDesgloseCostos}
              />
            </TabsContent>
          </Tabs>

          {/* Botones de acción */}
          <div className="flex justify-between space-x-4 pt-6 border-t bg-white p-6 rounded-lg mt-6">
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={clearForm}>
                Limpiar Formulario
              </Button>
              <Button type="button" onClick={handleGeneratePDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Generar PDF
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={handleSubmit} 
                className="eimas-gradient"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar Propuesta' : 'Guardar Propuesta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
