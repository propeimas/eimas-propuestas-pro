
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Eye, BarChart, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    {
      title: "Propuestas Totales",
      value: "0",
      description: "Total de propuestas registradas",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pendientes",
      value: "0",
      description: "Propuestas en estado pendiente",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "En Proceso",
      value: "0",
      description: "Propuestas en desarrollo",
      icon: BarChart,
      color: "text-blue-600",
    },
    {
      title: "Aceptadas",
      value: "0",
      description: "Propuestas finalizadas exitosamente",
      icon: Eye,
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Panel de Control" 
        subtitle="Bienvenido al sistema de gestión de propuestas EIMAS"
      />
      
      <div className="p-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-secondary" />
                <span>Nueva Propuesta</span>
              </CardTitle>
              <CardDescription>
                Crear una nueva propuesta para servicios de ingeniería ambiental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full eimas-gradient">
                <Link to="/nueva-propuesta">
                  Crear Propuesta
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-secondary" />
                <span>Ver Propuestas</span>
              </CardTitle>
              <CardDescription>
                Visualizar, editar y gestionar todas las propuestas existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/propuestas">
                  Ver Todas
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-secondary" />
                <span>Estado de Propuestas</span>
              </CardTitle>
              <CardDescription>
                Revisar el estado y seguimiento de todas las propuestas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/estado-propuestas">
                  Ver Estados
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información de la empresa */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">EIMAS - Ingeniería Ambiental</CardTitle>
            <CardDescription className="text-center">
              Sistema profesional de gestión de propuestas técnicas y comerciales
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Generación automática de códigos de propuesta</p>
              <p>✓ Exportación profesional a PDF</p>
              <p>✓ Seguimiento completo del estado de propuestas</p>
              <p>✓ Gestión integral de costos y recursos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
