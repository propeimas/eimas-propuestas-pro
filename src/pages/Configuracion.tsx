
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Upload, Save, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Configuracion() {
  const { toast } = useToast();
  const [configuracion, setConfiguracion] = useState({
    nombreEmpresa: "EIMAS - Ingeniería Ambiental",
    telefono: "",
    direccion: "",
    email: "",
    resolucion: "",
    website: "",
    logo: "",
    firma: ""
  });

  const [compromisos, setCompromisos] = useState([
    "Entrega puntual del informe técnico",
    "Verificación con laboratorio acreditado ante el IDEAM",
    "Uso de equipos calibrados y certificados",
    "Personal técnico especializado y certificado",
    "Cumplimiento de normativa ambiental vigente",
    "Disponibilidad para aclaraciones post-entrega"
  ]);

  const handleInputChange = (field: string, value: string) => {
    setConfiguracion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí se implementaría la subida del archivo
      console.log("Logo seleccionado:", file.name);
      toast({
        title: "Logo seleccionado",
        description: `Archivo: ${file.name}`,
      });
    }
  };

  const handleFirmaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí se implementaría la subida del archivo
      console.log("Firma seleccionada:", file.name);
      toast({
        title: "Firma seleccionada", 
        description: `Archivo: ${file.name}`,
      });
    }
  };

  const handleSave = () => {
    // Aquí se guardaría en Firestore
    console.log("Configuración guardada:", { configuracion, compromisos });
    toast({
      title: "Configuración guardada",
      description: "Los datos de la empresa han sido actualizados exitosamente",
    });
  };

  const addCompromiso = () => {
    setCompromisos(prev => [...prev, ""]);
  };

  const updateCompromiso = (index: number, value: string) => {
    setCompromisos(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeCompromiso = (index: number) => {
    setCompromisos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Configuración" 
        subtitle="Datos de la empresa para propuestas y documentos"
      />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Información básica de la empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-secondary" />
                <span>Información de la Empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre de la Empresa *</Label>
                  <Input 
                    value={configuracion.nombreEmpresa}
                    onChange={(e) => handleInputChange('nombreEmpresa', e.target.value)}
                    placeholder="Razón social de la empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Teléfono *</Label>
                  <Input 
                    value={configuracion.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="Número de contacto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dirección *</Label>
                <Input 
                  value={configuracion.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Dirección física de la empresa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Correo Electrónico *</Label>
                  <Input 
                    type="email"
                    value={configuracion.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Página Web</Label>
                  <Input 
                    value={configuracion.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resolución / Acreditación *</Label>
                <Input 
                  value={configuracion.resolucion}
                  onChange={(e) => handleInputChange('resolucion', e.target.value)}
                  placeholder="Número de resolución o acreditación"
                />
              </div>
            </CardContent>
          </Card>

          {/* Archivos de la empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-secondary" />
                <span>Archivos de la Empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Logo de la Empresa</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label 
                        htmlFor="logo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                      >
                        Subir Logo
                      </Label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Firma Digital</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFirmaUpload}
                        className="hidden"
                        id="firma-upload"
                      />
                      <Label 
                        htmlFor="firma-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                      >
                        Subir Firma
                      </Label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF hasta 2MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compromisos de calidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-secondary" />
                  <span>Compromisos de Calidad EIMAS</span>
                </div>
                <Button onClick={addCompromiso} size="sm" variant="outline">
                  Agregar Compromiso
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {compromisos.map((compromiso, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Textarea
                      value={compromiso}
                      onChange={(e) => updateCompromiso(index, e.target.value)}
                      placeholder="Escribir compromiso de calidad..."
                      rows={2}
                    />
                  </div>
                  <Button 
                    onClick={() => removeCompromiso(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Botón de guardar */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="eimas-gradient">
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
