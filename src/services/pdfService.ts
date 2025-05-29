
import jsPDF from 'jspdf';
import { Propuesta, CaracteristicasTecnicas, PersonalEquipo, DesgloseCostos, ConfiguracionEmpresa } from '@/types/proposal';
import { checkPageBreak } from './pdf/pdfUtils';
import { addPageHeader, addFooter } from './pdf/pdfLayout';
import { addCompanyInfo, addClientInfo, addPersonalSection, addEquipmentSection, addCostsSection } from './pdf/pdfSections';

export interface PropuestaCompleta {
  propuesta: Propuesta;
  caracteristicas?: CaracteristicasTecnicas;
  personal?: PersonalEquipo;
  costos?: DesgloseCostos;
  configuracion?: ConfiguracionEmpresa;
}

// Función para generar código auto-incremental de propuesta
export const generateProposalCode = (): string => {
  const currentYear = new Date().getFullYear();
  
  // En producción, esto vendría de una base de datos o localStorage
  // Por ahora usamos un contador simple basado en el timestamp para simular el incremento
  const storedCounter = localStorage.getItem('proposalCounter');
  let counter = storedCounter ? parseInt(storedCounter) : 74; // Empezar desde 074
  
  counter += 1;
  localStorage.setItem('proposalCounter', counter.toString());
  
  // Formatear el número con ceros a la izquierda (3 dígitos)
  const formattedCounter = counter.toString().padStart(3, '0');
  
  return `P-${formattedCounter}-${currentYear}`;
};

export const generatePDF = async (data: PropuestaCompleta) => {
  const { propuesta, caracteristicas, personal, costos, configuracion } = data;
  
  // Crear instancia de jsPDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // Función para crear encabezado en nuevas páginas
  const createNewPageHeader = () => {
    addPageHeader(pdf, propuesta, configuracion);
    yPosition = 50;
  };

  // INICIALIZAR PDF - Agregar primer encabezado
  addPageHeader(pdf, propuesta, configuracion);
  yPosition = 50;

  // INFORMACIÓN DE LA EMPRESA
  yPosition = addCompanyInfo(pdf, yPosition, createNewPageHeader, configuracion);

  // INFORMACIÓN DEL CLIENTE
  yPosition = addClientInfo(pdf, yPosition, propuesta, createNewPageHeader);

  // Objetivo
  if (propuesta.objetivo) {
    yPosition = checkPageBreak(pdf, yPosition, 30, pageHeight, createNewPageHeader);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBJETIVO', 15, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const objetivoLines = pdf.splitTextToSize(propuesta.objetivo, pageWidth - 30);
    pdf.text(objetivoLines, 15, yPosition);
    yPosition += objetivoLines.length * 5 + 10;
  }

  // Alcance
  if (propuesta.alcance) {
    yPosition = checkPageBreak(pdf, yPosition, 30, pageHeight, createNewPageHeader);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ALCANCE', 15, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const alcanceLines = pdf.splitTextToSize(propuesta.alcance, pageWidth - 30);
    pdf.text(alcanceLines, 15, yPosition);
    yPosition += alcanceLines.length * 5 + 10;
  }

  // Metodología
  if (caracteristicas?.metodologia) {
    yPosition = checkPageBreak(pdf, yPosition, 30, pageHeight, createNewPageHeader);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('METODOLOGÍA', 15, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const metodologiaLines = pdf.splitTextToSize(caracteristicas.metodologia, pageWidth - 30);
    pdf.text(metodologiaLines, 15, yPosition);
    yPosition += metodologiaLines.length * 5 + 10;
  }

  // PERSONAL DEL PROYECTO
  yPosition = addPersonalSection(pdf, yPosition, createNewPageHeader, personal, configuracion);

  // EQUIPOS UTILIZADOS
  yPosition = addEquipmentSection(pdf, yPosition, createNewPageHeader, personal, configuracion);

  // Duración del estudio
  if (propuesta.duracion) {
    yPosition = checkPageBreak(pdf, yPosition, 15, pageHeight, createNewPageHeader);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DURACIÓN DEL ESTUDIO', 15, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${propuesta.duracion} días calendario`, 15, yPosition);
    yPosition += 15;
  }

  // COSTOS
  yPosition = addCostsSection(pdf, yPosition, createNewPageHeader, costos);

  // Compromisos de calidad
  if (configuracion?.compromisos && configuracion.compromisos.length > 0) {
    yPosition = checkPageBreak(pdf, yPosition, 40, pageHeight, createNewPageHeader);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMPROMISOS DE CALIDAD', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    configuracion.compromisos.forEach((compromiso) => {
      yPosition = checkPageBreak(pdf, yPosition, 8, pageHeight, createNewPageHeader);
      pdf.text(`• ${compromiso}`, 15, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  // FIRMA
  if (configuracion?.firma) {
    yPosition = checkPageBreak(pdf, yPosition, 50, pageHeight, createNewPageHeader);
    try {
      pdf.addImage(configuracion.firma, 'JPEG', 15, yPosition, 60, 25);
      yPosition += 30;
    } catch (error) {
      console.log('Error al cargar firma:', error);
    }
  }

  // Agregar footer a todas las páginas
  const totalPages = (pdf as any).internal.pages.length - 1; // Fix for the build error
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(pdf, configuracion);
  }

  return pdf;
};

export const downloadPDF = async (data: PropuestaCompleta, filename?: string) => {
  try {
    const pdf = await generatePDF(data);
    const fileName = filename || `Propuesta_${data.propuesta.codigoPropuesta}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw new Error('Error al generar el archivo PDF');
  }
};
