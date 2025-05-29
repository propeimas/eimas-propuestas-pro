
import jsPDF from 'jspdf';
import { Propuesta, CaracteristicasTecnicas, PersonalEquipo, DesgloseCostos, ConfiguracionEmpresa } from '@/types/proposal';
import { checkPageBreak, formatCurrency, addImageSafe } from './pdfUtils';
import { createProfessionalTable } from './pdfTables';
import { addPageHeader } from './pdfLayout';

export const addCompanyInfo = (
  pdf: jsPDF, 
  yPosition: number, 
  onPageBreak: () => void,
  configuracion?: ConfiguracionEmpresa
): number => {
  if (!configuracion) return yPosition;
  
  const pageHeight = pdf.internal.pageSize.getHeight();
  yPosition = checkPageBreak(pdf, yPosition, 50, pageHeight, onPageBreak);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 60, 60);
  pdf.text('INFORMACIÓN LEGAL DE LA EMPRESA', 15, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Empresa: ${configuracion.nombreEmpresa}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Teléfono: ${configuracion.telefono}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Dirección: ${configuracion.direccion}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Email: ${configuracion.email}`, 15, yPosition);
  yPosition += 5;
  if (configuracion.resolucion) {
    pdf.text(`Resolución: ${configuracion.resolucion}`, 15, yPosition);
    yPosition += 5;
  }
  
  return yPosition + 10;
};

export const addClientInfo = (
  pdf: jsPDF, 
  yPosition: number, 
  propuesta: Propuesta, 
  onPageBreak: () => void
): number => {
  const pageHeight = pdf.internal.pageSize.getHeight();
  yPosition = checkPageBreak(pdf, yPosition, 40, pageHeight, onPageBreak);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 60, 60);
  pdf.text('INFORMACIÓN DEL CLIENTE', 15, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Empresa: ${propuesta.empresaCliente}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Contacto: ${propuesta.nombreSolicitante}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Teléfono: ${propuesta.telefono}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Email: ${propuesta.email}`, 15, yPosition);
  
  return yPosition + 12;
};

export const addPersonalSection = (
  pdf: jsPDF,
  yPosition: number,
  onPageBreak: () => void,
  personal?: PersonalEquipo,
  configuracion?: ConfiguracionEmpresa
): number => {
  if (!personal?.personal || personal.personal.length === 0) return yPosition;
  
  const pageHeight = pdf.internal.pageSize.getHeight();
  yPosition = checkPageBreak(pdf, yPosition, 60, pageHeight, onPageBreak);
  
  // Título de sección
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 60, 60);
  pdf.text('8    PERSONAL', 15, yPosition);
  yPosition += 10;
  
  // Texto introductorio
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const introText = `Para la ejecución del proyecto, ${configuracion?.nombreEmpresa || 'la empresa'} dispondrá del siguiente personal.`;
  pdf.text(introText, 15, yPosition);
  yPosition += 10;
  
  // Preparar datos para la tabla
  const headers = ['NOMBRE', 'PROFESIÓN', 'AÑOS DE EXPERIENCIA'];
  const data = personal.personal.map(persona => [
    persona.nombre,
    persona.cargo,
    persona.experiencia
  ]);
  
  const columnWidths = [60, 70, 50];
  
  return createProfessionalTable(pdf, headers, data, yPosition, columnWidths);
};

export const addEquipmentSection = (
  pdf: jsPDF,
  yPosition: number,
  onPageBreak: () => void,
  personal?: PersonalEquipo,
  configuracion?: ConfiguracionEmpresa
): number => {
  if (!personal?.equipos || personal.equipos.length === 0) return yPosition;
  
  const pageHeight = pdf.internal.pageSize.getHeight();
  yPosition = checkPageBreak(pdf, yPosition, 60, pageHeight, onPageBreak);
  
  // Título de subsección
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 60, 60);
  pdf.text('8.1    EQUIPOS', 15, yPosition);
  yPosition += 10;
  
  // Texto introductorio
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const introText = `Para la ejecución del proyecto, ${configuracion?.nombreEmpresa || 'la empresa'} dispondrá de los siguientes equipos.`;
  pdf.text(introText, 15, yPosition);
  yPosition += 10;
  
  // Preparar datos para la tabla de equipos
  const headers = ['EQUIPO', 'TIPO MUESTREO'];
  const data = personal.equipos.map(equipo => [
    equipo.nombre,
    `${equipo.marca} ${equipo.modelo}`.trim()
  ]);
  
  const columnWidths = [90, 90];
  
  return createProfessionalTable(pdf, headers, data, yPosition, columnWidths);
};

export const addCostsSection = (
  pdf: jsPDF,
  yPosition: number,
  onPageBreak: () => void,
  costos?: DesgloseCostos
): number => {
  if (!costos || costos.items.length === 0) return yPosition;
  
  const pageHeight = pdf.internal.pageSize.getHeight();
  yPosition = checkPageBreak(pdf, yPosition, 80, pageHeight, onPageBreak);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 60, 60);
  pdf.text('COSTO DE LA PROPUESTA', 15, yPosition);
  yPosition += 12;
  
  // Preparar datos para tabla de costos
  const headers = ['CONCEPTO', 'CANT.', 'VALOR UNIT.', 'TOTAL'];
  const data = costos.items.map(item => [
    item.concepto,
    item.cantidad.toString(),
    formatCurrency(item.valorUnitario),
    formatCurrency(item.valorTotal)
  ]);
  
  const columnWidths = [80, 25, 37.5, 37.5];
  
  yPosition = createProfessionalTable(pdf, headers, data, yPosition, columnWidths);
  
  // Totales en formato profesional
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  // Línea separadora antes de totales
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(15 + 80 + 25, yPosition, 15 + 180, yPosition);
  yPosition += 8;
  
  // Subtotal
  pdf.text('Subtotal:', 15 + 80 + 25 + 5, yPosition);
  pdf.text(formatCurrency(costos.subtotal), 15 + 180 - 5, yPosition, { align: 'right' });
  yPosition += 6;
  
  // IVA
  pdf.text('IVA (19%):', 15 + 80 + 25 + 5, yPosition);
  pdf.text(formatCurrency(costos.iva), 15 + 180 - 5, yPosition, { align: 'right' });
  yPosition += 6;
  
  // Total final
  pdf.setFontSize(11);
  pdf.text('TOTAL:', 15 + 80 + 25 + 5, yPosition);
  pdf.text(formatCurrency(costos.total), 15 + 180 - 5, yPosition, { align: 'right' });
  
  return yPosition + 15;
};
