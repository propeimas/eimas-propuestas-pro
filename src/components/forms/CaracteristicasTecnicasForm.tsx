
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Settings } from "lucide-react";
import { CaracteristicasTecnicas } from "@/types/proposal";

interface CaracteristicasTecnicasFormProps {
  data: CaracteristicasTecnicas;
  onDataChange: (data: CaracteristicasTecnicas) => void;
}

export function CaracteristicasTecnicasForm({ data, onDataChange }: CaracteristicasTecnicasFormProps) {
  const [nuevoEquipo, setNuevoEquipo] = useState("");
  const [nuevoParametro, setNuevoParametro] = useState("");
  const [nuevaNorma, setNuevaNorma] = useState("");

  const agregarEquipo = () => {
    if (nuevoEquipo.trim()) {
      onDataChange({
        ...data,
        equiposUtilizados: [...data.equiposUtilizados, nuevoEquipo.trim()]
      });
      setNuevoEquipo("");
    }
  };

  const eliminarEquipo = (index: number) => {
    onDataChange({
      ...data,
      equiposUtilizados: data.equiposUtilizados.filter((_, i) => i !== index)
    });
  };

  const agregarParametro = () => {
    if (nuevoParametro.trim()) {
      onDataChange({
        ...data,
        parametrosAnalizar: [...data.parametrosAnalizar, nuevoParametro.trim()]
      });
      setNuevoParametro("");
    }
  };

  const eliminarParametro = (index: number) => {
    onDataChange({
      ...data,
      parametrosAnalizar: data.parametrosAnalizar.filter((_, i) => i !== index)
    });
  };

  const agregarNorma = () => {
    if (nuevaNorma.trim()) {
      onDataChange({
        ...data,
        normasReferencia: [...data.normasReferencia, nuevaNorma.trim()]
      });
      setNuevaNorma("");
    }
  };

  const eliminarNorma = (index: number) => {
    onDataChange({
      ...data,
      normasReferencia: data.normasReferencia.filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-secondary" />
          <span>Características Técnicas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Metodología *</Label>
          <Textarea 
            placeholder="Describe la metodología a utilizar..."
            value={data.metodologia}
            onChange={(e) => onDataChange({ ...data, metodologia: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <Label>Equipos Utilizados</Label>
          <div className="flex space-x-2">
            <Input 
              placeholder="Agregar equipo..."
              value={nuevoEquipo}
              onChange={(e) => setNuevoEquipo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && agregarEquipo()}
            />
            <Button type="button" onClick={agregarEquipo} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.equiposUtilizados.map((equipo, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{equipo}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => eliminarEquipo(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Parámetros a Analizar</Label>
          <div className="flex space-x-2">
            <Input 
              placeholder="Agregar parámetro..."
              value={nuevoParametro}
              onChange={(e) => setNuevoParametro(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && agregarParametro()}
            />
            <Button type="button" onClick={agregarParametro} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.parametrosAnalizar.map((parametro, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{parametro}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => eliminarParametro(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Normas de Referencia</Label>
          <div className="flex space-x-2">
            <Input 
              placeholder="Agregar norma..."
              value={nuevaNorma}
              onChange={(e) => setNuevaNorma(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && agregarNorma()}
            />
            <Button type="button" onClick={agregarNorma} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.normasReferencia.map((norma, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{norma}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => eliminarNorma(index)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Procedimientos</Label>
          <Textarea 
            placeholder="Describe los procedimientos a seguir..."
            value={data.procedimientos}
            onChange={(e) => onDataChange({ ...data, procedimientos: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Control de Calidad</Label>
          <Textarea 
            placeholder="Describe las medidas de control de calidad..."
            value={data.controlCalidad}
            onChange={(e) => onDataChange({ ...data, controlCalidad: e.target.value })}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
