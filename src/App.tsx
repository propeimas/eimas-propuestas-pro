
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NuevaPropuesta from '@/pages/NuevaPropuesta';
import VerPropuestas from '@/pages/VerPropuestas';
import EstadoPropuestas from '@/pages/EstadoPropuestas';
import Configuracion from '@/pages/Configuracion';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/nueva-propuesta" element={<NuevaPropuesta />} />
                <Route path="/nueva-propuesta/:id" element={<NuevaPropuesta />} />
                <Route path="/propuestas" element={<VerPropuestas />} />
                <Route path="/estado-propuestas" element={<EstadoPropuestas />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </SidebarProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
