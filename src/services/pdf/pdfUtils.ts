
import jsPDF from 'jspdf';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const checkPageBreak = (pdf: jsPDF, yPosition: number, neededHeight: number, pageHeight: number, onNewPage: () => void) => {
  if (yPosition + neededHeight > pageHeight - 30) {
    pdf.addPage();
    onNewPage();
    return 50; // New position after header
  }
  return yPosition;
};

export const addImageSafe = (pdf: jsPDF, imageData: string, format: string, x: number, y: number, width: number, height: number) => {
  try {
    pdf.addImage(imageData, format, x, y, width, height);
    return true;
  } catch (error) {
    console.log('Error al cargar imagen:', error);
    return false;
  }
};
