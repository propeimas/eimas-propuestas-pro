
import { ConfiguracionEmpresa } from '@/types/proposal';

const CONFIGURACION_KEY = 'eimas_configuracion';

// Convertir archivo a base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Guardar configuración en localStorage
export const saveConfiguracion = async (configuracion: ConfiguracionEmpresa): Promise<void> => {
  try {
    localStorage.setItem(CONFIGURACION_KEY, JSON.stringify(configuracion));
  } catch (error) {
    console.error('Error saving configuracion:', error);
    throw error;
  }
};

// Obtener configuración de localStorage
export const getConfiguracion = (): ConfiguracionEmpresa | null => {
  try {
    const saved = localStorage.getItem(CONFIGURACION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  } catch (error) {
    console.error('Error getting configuracion:', error);
    return null;
  }
};

// Configuración por defecto
export const getDefaultConfiguracion = (): ConfiguracionEmpresa => {
  return {
    nombreEmpresa: "EIMAS - Ingeniería Ambiental",
    telefono: "",
    direccion: "",
    email: "",
    resolucion: "",
    website: "",
    logo: "",
    firma: "",
    compromisos: [
      "Entrega puntual del informe técnico",
      "Verificación con laboratorio acreditado ante el IDEAM",
      "Uso de equipos calibrados y certificados",
      "Personal técnico especializado y certificado",
      "Cumplimiento de normativa ambiental vigente",
      "Disponibilidad para aclaraciones post-entrega"
    ]
  };
};
