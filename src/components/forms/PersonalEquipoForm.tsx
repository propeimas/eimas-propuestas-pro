
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PersonalEquipo } from "@/types/proposal";

interface PersonalEquipoFormProps {
  data: PersonalEquipo;
  onDataChange: (data: PersonalEquipo) => void;
}

export function PersonalEquipoForm({ data, onDataChange }: PersonalEquipoFormProps) {
  // Estados para el personal
  const [nuevoPersonal, setNuevoPersonal] = useState({
    nombre: "",
    cargo: "",
    experiencia: "",
    responsabilidades: ""
  });

  // Estados para equipos
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    calibracion: "",
    funcion: ""
  });

  // Estado para fecha de calibración
  const [fechaCalibracion, setFechaCalibracion] = useState<Date>();

  // Listas de opciones predefinidas (sin duplicados)
  const opcionesPersonal = {
    nombres: ["Juan Pérez", "María García", "Carlos Rodríguez", "Ana López", "Miguel Torres"],
    cargos: ["Ingeniero Ambiental", "Técnico en Monitoreo", "Coordinador de Proyecto", "Analista de Laboratorio", "Supervisor de Campo"],
    experiencias: ["1-2 años", "3-5 años", "5-10 años", "10+ años"],
    responsabilidades: [
      "Coordinación general del proyecto",
      "Toma de muestras en campo",
      "Análisis de laboratorio",
      "Elaboración de informes",
      "Supervisión técnica"
    ]
  };

  const opcionesEquipos = {
    nombres: ["Sonómetro", "Analizador de Gases", "Estación Meteorológica", "Muestreador de Aire", "GPS"],
    marcas: ["CASELLA", "TESTO", "DAVIS", "GILIAN", "GARMIN"],
    modelos: ["CEL-350", "350-XL", "Vantage Pro2", "GilAir Plus", "eTrex 32x"],
    funciones: [
      "Medición de ruido ambiental",
      "Análisis de calidad del aire",
      "Monitoreo meteorológico",
      "Muestreo de material particulado",
      "Georreferenciación"
    ]
  };

  // Función para obtener opciones únicas (sin duplicados con los ya agregados)
  const getOpcionesDisponibles = (opciones: string[], yaUsados: string[]) => {
    return opciones.filter(opcion => !yaUsados.includes(opcion));
  };

  const agregarPersonal = () => {
    if (nuevoPersonal.nombre.trim() && nuevoPersonal.cargo.trim()) {
      // Verificar que no esté duplicado
      const yaExiste = data.personal.some(p => 
        p.nombre === nuevoPersonal.nombre && p.cargo === nuevoPersonal.cargo
      );
      
      if (!yaExiste) {
        onDataChange({
          ...data,
          personal: [...data.personal, { ...nuevoPersonal }]
        });
        setNuevoPersonal({
          nombre: "",
          cargo: "",
          experiencia: "",
          responsabilidades: ""
        });
      }
    }
  };

  const eliminarPersonal = (index: number) => {
    onDataChange({
      ...data,
      personal: data.personal.filter((_, i) => i !== index)
    });
  };

  const agregarEquipo = () => {
    if (nuevoEquipo.nombre.trim() && nuevoEquipo.marca.trim()) {
      // Verificar que no esté duplicado
      const yaExiste = data.equipos.some(e => 
        e.nombre === nuevoEquipo.nombre && e.marca === nuevoEquipo.marca && e.modelo === nuevoEquipo.modelo
      );
      
      if (!yaExiste) {
        const equipoFinal = {
          ...nuevoEquipo,
          calibracion: fechaCalibracion ? format(fechaCalibracion, "dd/MM/yyyy") : ""
        };
        
        onDataChange({
          ...data,
          equipos: [...data.equipos, equipoFinal]
        });
        
        setNuevoEquipo({
          nombre: "",
          marca: "",
          modelo: "",
          calibracion: "",
          funcion: ""
        });
        setFechaCalibracion(undefined);
      }
    }
  };

  const eliminarEquipo = (index: number) => {
    onDataChange({
      ...data,
      equipos: data.equipos.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-secondary" />
            <span>Personal del Proyecto</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Select onValueChange={(value) => setNuevoPersonal({ ...nuevoPersonal, nombre: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nombre" />
                </SelectTrigger>
                <SelectContent>
                  {getOpcionesDisponibles(opcionesPersonal.nombres, data.personal.map(p => p.nombre)).map((nombre) => (
                    <SelectItem key={nombre} value={nombre}>
                      {nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Select onValueChange={(value) => setNuevoPersonal({ ...nuevoPersonal, cargo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cargo" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesPersonal.cargos.map((cargo) => (
                    <SelectItem key={cargo} value={cargo}>
                      {cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Experiencia</Label>
              <Select onValueChange={(value) => setNuevoPersonal({ ...nuevoPersonal, experiencia: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesPersonal.experiencias.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsabilidades</Label>
              <Select onValueChange={(value) => setNuevoPersonal({ ...nuevoPersonal, responsabilidades: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar responsabilidades" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesPersonal.responsabilidades.map((resp) => (
                    <SelectItem key={resp} value={resp}>
                      {resp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" onClick={agregarPersonal} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Personal
          </Button>

          {data.personal.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Experiencia</TableHead>
                    <TableHead>Responsabilidades</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.personal.map((persona, index) => (
                    <TableRow key={index}>
                      <TableCell>{persona.nombre}</TableCell>
                      <TableCell>{persona.cargo}</TableCell>
                      <TableCell>{persona.experiencia}</TableCell>
                      <TableCell>{persona.responsabilidades}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => eliminarPersonal(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipos y Herramientas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nombre del Equipo *</Label>
              <Select onValueChange={(value) => setNuevoEquipo({ ...nuevoEquipo, nombre: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {getOpcionesDisponibles(opcionesEquipos.nombres, data.equipos.map(e => e.nombre)).map((equipo) => (
                    <SelectItem key={equipo} value={equipo}>
                      {equipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marca *</Label>
              <Select onValueChange={(value) => setNuevoEquipo({ ...nuevoEquipo, marca: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesEquipos.marcas.map((marca) => (
                    <SelectItem key={marca} value={marca}>
                      {marca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select onValueChange={(value) => setNuevoEquipo({ ...nuevoEquipo, modelo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesEquipos.modelos.map((modelo) => (
                    <SelectItem key={modelo} value={modelo}>
                      {modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha de Calibración</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaCalibracion && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaCalibracion ? (
                      format(fechaCalibracion, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaCalibracion}
                    onSelect={setFechaCalibracion}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Función</Label>
              <Select onValueChange={(value) => setNuevoEquipo({ ...nuevoEquipo, funcion: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar función" />
                </SelectTrigger>
                <SelectContent>
                  {opcionesEquipos.funciones.map((funcion) => (
                    <SelectItem key={funcion} value={funcion}>
                      {funcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" onClick={agregarEquipo} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Equipo
          </Button>

          {data.equipos.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Calibración</TableHead>
                    <TableHead>Función</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.equipos.map((equipo, index) => (
                    <TableRow key={index}>
                      <TableCell>{equipo.nombre}</TableCell>
                      <TableCell>{equipo.marca}</TableCell>
                      <TableCell>{equipo.modelo}</TableCell>
                      <TableCell>{equipo.calibracion}</TableCell>
                      <TableCell>{equipo.funcion}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => eliminarEquipo(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
  );
}
