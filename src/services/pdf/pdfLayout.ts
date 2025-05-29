
import jsPDF from 'jspdf';
import { ConfiguracionEmpresa } from '@/types/proposal';
import { addImageSafe } from './pdfUtils';

export const addPageHeader = (pdf: jsPDF, propuesta: any, configuracion?: ConfiguracionEmpresa) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Rectángulo principal del header
  pdf.setFillColor(245, 245, 245);
  pdf.rect(15, 10, pageWidth - 30, 25, 'F');
  
  // Líneas de borde
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.rect(15, 10, pageWidth - 30, 25);
  
  // Logo placeholder
  if (configuracion?.logo) {
    const logoAdded = addImageSafe(pdf, configuracion.logo, 'JPEG', 20, 15, 25, 15);
    if (!logoAdded) {
      addLogoPlaceholder(pdf);
    }
  } else {
    addLogoPlaceholder(pdf);
  }
  
  // Título principal
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('PROPUESTA TÉCNICO-ECONÓMICA', pageWidth / 2, 20, { align: 'center' });
  
  // Información del header en celdas
  const cellWidth = (pageWidth - 70) / 3;
  const startX = 50;
  
  // Líneas verticales divisorias
  pdf.line(startX + cellWidth, 10, startX + cellWidth, 35);
  pdf.line(startX + cellWidth * 2, 10, startX + cellWidth * 2, 35);
  
  // Contenido de las celdas
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  pdf.text(`Código: ${propuesta.codigoPropuesta}`, startX + 2, 28);
  pdf.text('Versión: 01', startX + cellWidth + 2, 28);
  
  const fechaActual = new Date().toISOString().split('T')[0];
  pdf.text(`Fecha: ${fechaActual}`, startX + cellWidth * 2 + 2, 28);
  
  pdf.setTextColor(0, 0, 0);
};

const addLogoPlaceholder = (pdf: jsPDF) => {
  pdf.setFillColor(200, 200, 200);
  pdf.rect(20, 15, 25, 15, 'F');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('LOGO', 32, 23, { align: 'center' });
};

export const addFooter = (pdf: jsPDF, configuracion?: ConfiguracionEmpresa) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const footerY = pageHeight - 10;
  
  if (configuracion) {
    const footerText = `${configuracion.nombreEmpresa} | Tel: ${configuracion.telefono} | Email: ${configuracion.email}`;
    pdf.text(footerText, pageWidth / 2, footerY, { align: 'center' });
    
    if (configuracion.website) {
      pdf.text(`Web: ${configuracion.website}`, pageWidth / 2, footerY + 3, { align: 'center' });
    }
  }
};
