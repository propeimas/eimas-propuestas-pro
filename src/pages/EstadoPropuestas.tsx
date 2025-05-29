
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Clock, CheckCircle, XCircle, FileText } from "lucide-react";

export default function EstadoPropuestas() {
  const estadisticas = {
    total: 0,
    pendientes: 0,
    enProceso: 0,
    aceptadas: 0,
    rechazadas: 0
  };

  const propuestasPorMes = [
    { mes: "Enero", cantidad: 0 },
    { mes: "Febrero", cantidad: 0 },
    { mes: "Marzo", cantidad: 0 },
    { mes: "Abril", cantidad: 0 },
    { mes: "Mayo", cantidad: 0 },
  ];

  const getProgresoEstado = (estado: string, total: number) => {
    if (total === 0) return 0;
    switch (estado) {
      case 'pendientes': return (estadisticas.pendientes / total) * 100;
      case 'enProceso': return (estadisticas.enProceso / total) * 100;
      case 'aceptadas': return (estadisticas.aceptadas / total) * 100;
      case 'rechazadas': return (estadisticas.rechazadas / total) * 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Estado de Propuestas" 
        subtitle="Seguimiento y análisis del estado de las propuestas"
      />
      
      <div className="p-6 space-y-6">
        {/* Resumen de estados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.pendientes}</div>
              <Progress 
                value={getProgresoEstado('pendientes', estadisticas.total)} 
                className="mt-2 h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {getProgresoEstado('pendientes', estadisticas.total).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <BarChart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.enProceso}</div>
              <Progress 
                value={getProgresoEstado('enProceso', estadisticas.total)} 
                className="mt-2 h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {getProgresoEstado('enProceso', estadisticas.total).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.aceptadas}</div>
              <Progress 
                value={getProgresoEstado('aceptadas', estadisticas.total)} 
                className="mt-2 h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {getProgresoEstado('aceptadas', estadisticas.total).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.rechazadas}</div>
              <Progress 
                value={getProgresoEstado('rechazadas', estadisticas.total)} 
                className="mt-2 h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {getProgresoEstado('rechazadas', estadisticas.total).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de propuestas por mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-secondary" />
              <span>Propuestas por Mes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propuestasPorMes.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium">{item.mes}</div>
                  <div className="flex-1">
                    <Progress value={(item.cantidad / Math.max(...propuestasPorMes.map(p => p.cantidad), 1)) * 100} className="h-4" />
                  </div>
                  <div className="w-12 text-sm text-muted-foreground">{item.cantidad}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estado por tipo de servicio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-secondary" />
              <span>Distribución por Estado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {estadisticas.total === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-gray-500">
                  Crea algunas propuestas para ver las estadísticas aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pendientes</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {estadisticas.pendientes}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">En Proceso</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {estadisticas.enProceso}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Aceptadas</span>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {estadisticas.aceptadas}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rechazadas</span>
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    {estadisticas.rechazadas}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
