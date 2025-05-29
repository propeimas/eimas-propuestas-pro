
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Trash2 } from "lucide-react";
import { PersonalEquipo } from "@/types/proposal";

interface PersonalEquipoFormProps {
  data: PersonalEquipo;
  onDataChange: (data: PersonalEquipo) => void;
}

export function PersonalEquipoForm({ data, onDataChange }: PersonalEquipoFormProps) {
  const [nuevoPersonal, setNuevoPersonal] = useState({
    nombre: "",
    cargo: "",
    experiencia: "",
    responsabilidades: ""
  });

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    calibracion: "",
    funcion: ""
  });

  const agregarPersonal = () => {
    if (nuevoPersonal.nombre.trim() && nuevoPersonal.cargo.trim()) {
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
  };

  const eliminarPersonal = (index: number) => {
    onDataChange({
      ...data,
      personal: data.personal.filter((_, i) => i !== index)
    });
  };

  const agregarEquipo = () => {
    if (nuevoEquipo.nombre.trim() && nuevoEquipo.marca.trim()) {
      onDataChange({
        ...data,
        equipos: [...data.equipos, { ...nuevoEquipo }]
      });
      setNuevoEquipo({
        nombre: "",
        marca: "",
        modelo: "",
        calibracion: "",
        funcion: ""
      });
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
              <Input 
                placeholder="Nombre completo"
                value={nuevoPersonal.nombre}
                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Input 
                placeholder="Cargo o posición"
                value={nuevoPersonal.cargo}
                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, cargo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Experiencia</Label>
              <Input 
                placeholder="Años de experiencia"
                value={nuevoPersonal.experiencia}
                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, experiencia: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Responsabilidades</Label>
              <Textarea 
                placeholder="Responsabilidades en el proyecto"
                value={nuevoPersonal.responsabilidades}
                onChange={(e) => setNuevoPersonal({ ...nuevoPersonal, responsabilidades: e.target.value })}
                rows={2}
              />
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
              <Input 
                placeholder="Nombre del equipo"
                value={nuevoEquipo.nombre}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Marca *</Label>
              <Input 
                placeholder="Marca del equipo"
                value={nuevoEquipo.marca}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, marca: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Input 
                placeholder="Modelo del equipo"
                value={nuevoEquipo.modelo}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, modelo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Calibración</Label>
              <Input 
                placeholder="Fecha de calibración"
                value={nuevoEquipo.calibracion}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, calibracion: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Función</Label>
              <Textarea 
                placeholder="Función del equipo en el proyecto"
                value={nuevoEquipo.funcion}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, funcion: e.target.value })}
                rows={2}
              />
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
