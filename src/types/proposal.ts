
export interface Propuesta {
  id?: string;
  fechaRecepcion: string;
  fechaAprobacion?: string;
  medioSolicitud: string;
  nombreSolicitante: string;
  nombreReceptor: string;
  empresaCliente: string;
  mesAproximadoServicio: string;
  tipoServicio: string;
  municipio: string;
  telefono: string;
  email: string;
  descripcionServicio: string;
  valorPropuesta: number;
  codigoPropuesta: string;
  seguimientoObservaciones: string;
  objetivo: string;
  alcance: string;
  duracion?: number;
  estado: 'PENDIENTE' | 'EN PROCESO' | 'ACEPTADA' | 'RECHAZADA';
  createdAt?: string;
  updatedAt?: string;
}

export interface CaracteristicasTecnicas {
  id?: string;
  propuestaId: string;
  metodologia: string;
  equiposUtilizados: string[];
  parametrosAnalizar: string[];
  normasReferencia: string[];
  procedimientos: string;
  controlCalidad: string;
  actividad?: string;
  metodo?: string;
}

export interface PersonalEquipo {
  id?: string;
  propuestaId: string;
  personal: {
    nombre: string;
    cargo: string;
    experiencia: string;
    responsabilidades: string;
    profesion?: string;
  }[];
  equipos: {
    nombre: string;
    marca: string;
    modelo: string;
    calibracion: string;
    funcion: string;
  }[];
}

export interface DesgloseCostos {
  id?: string;
  propuestaId: string;
  items: {
    concepto: string;
    cantidad: number;
    valorUnitario: number;
    valorTotal: number;
  }[];
  subtotal: number;
  iva: number;
  total: number;
}

export interface ConfiguracionEmpresa {
  id?: string;
  nombreEmpresa: string;
  telefono: string;
  direccion: string;
  email: string;
  resolucion: string;
  logo?: string;
  firma?: string;
  website?: string;
  compromisos: string[];
}

export interface Actividad {
  id?: string;
  nombre: string;
  descripcion?: string;
  metodos?: string[];
}

export interface Metodo {
  id?: string;
  actividadId: string;
  nombre: string;
  descripcion?: string;
  normas?: string[];
}
