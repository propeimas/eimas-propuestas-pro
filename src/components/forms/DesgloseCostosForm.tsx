
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, DollarSign, Trash2 } from "lucide-react";
import { DesgloseCostos } from "@/types/proposal";

interface DesgloseCostosFormProps {
  data: DesgloseCostos;
  onDataChange: (data: DesgloseCostos) => void;
}

export function DesgloseCostosForm({ data, onDataChange }: DesgloseCostosFormProps) {
  const [nuevoItem, setNuevoItem] = useState({
    concepto: "",
    cantidad: 1,
    valorUnitario: 0,
    valorTotal: 0
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const calcularTotales = (items: typeof data.items) => {
    const subtotal = items.reduce((sum, item) => sum + item.valorTotal, 0);
    const iva = subtotal * 0.19; // IVA del 19%
    const total = subtotal + iva;
    
    return { subtotal, iva, total };
  };

  const agregarItem = () => {
    if (nuevoItem.concepto.trim() && nuevoItem.cantidad > 0 && nuevoItem.valorUnitario > 0) {
      const valorTotal = nuevoItem.cantidad * nuevoItem.valorUnitario;
      const itemCompleto = { ...nuevoItem, valorTotal };
      const nuevosItems = [...data.items, itemCompleto];
      const { subtotal, iva, total } = calcularTotales(nuevosItems);
      
      onDataChange({
        ...data,
        items: nuevosItems,
        subtotal,
        iva,
        total
      });
      
      setNuevoItem({
        concepto: "",
        cantidad: 1,
        valorUnitario: 0,
        valorTotal: 0
      });
    }
  };

  const eliminarItem = (index: number) => {
    const nuevosItems = data.items.filter((_, i) => i !== index);
    const { subtotal, iva, total } = calcularTotales(nuevosItems);
    
    onDataChange({
      ...data,
      items: nuevosItems,
      subtotal,
      iva,
      total
    });
  };

  useEffect(() => {
    setNuevoItem(prev => ({
      ...prev,
      valorTotal: prev.cantidad * prev.valorUnitario
    }));
  }, [nuevoItem.cantidad, nuevoItem.valorUnitario]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-secondary" />
          <span>Desglose de Costos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label>Concepto *</Label>
            <Input 
              placeholder="Descripción del item"
              value={nuevoItem.concepto}
              onChange={(e) => setNuevoItem({ ...nuevoItem, concepto: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Cantidad *</Label>
            <Input 
              type="number"
              min="1"
              value={nuevoItem.cantidad}
              onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: Number(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Valor Unitario *</Label>
            <Input 
              type="number"
              min="0"
              placeholder="0"
              value={nuevoItem.valorUnitario || ""}
              onChange={(e) => setNuevoItem({ ...nuevoItem, valorUnitario: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Valor Total</Label>
            <Input 
              value={formatCurrency(nuevoItem.valorTotal)}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
        
        <Button type="button" onClick={agregarItem} className="w-full eimas-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Item
        </Button>

        {data.items.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-right">Valor Unitario</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.concepto}</TableCell>
                    <TableCell className="text-center">{item.cantidad}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.valorTotal)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => eliminarItem(index)}
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

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">IVA (19%):</span>
              <span>{formatCurrency(data.iva)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>TOTAL:</span>
              <span className="text-secondary">{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
