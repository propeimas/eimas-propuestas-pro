
import jsPDF from 'jspdf';

export const createProfessionalTable = (
  pdf: jsPDF, 
  headers: string[], 
  data: string[][], 
  startY: number, 
  columnWidths: number[]
): number => {
  const tableStartX = 15;
  let currentY = startY;
  
  // Dibujar encabezados
  pdf.setFillColor(240, 240, 240);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.3);
  
  let currentX = tableStartX;
  
  // Rectángulos de encabezado
  headers.forEach((header, index) => {
    pdf.rect(currentX, currentY, columnWidths[index], 8, 'FD');
    currentX += columnWidths[index];
  });
  
  // Texto de encabezados
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  currentX = tableStartX;
  headers.forEach((header, index) => {
    pdf.text(header, currentX + columnWidths[index] / 2, currentY + 5.5, { align: 'center' });
    currentX += columnWidths[index];
  });
  
  currentY += 8;
  
  // Dibujar filas de datos
  pdf.setFillColor(255, 255, 255);
  pdf.setFont('helvetica', 'normal');
  
  data.forEach((row) => {
    currentX = tableStartX;
    
    // Rectángulos de fila
    row.forEach((cell, cellIndex) => {
      pdf.rect(currentX, currentY, columnWidths[cellIndex], 7, 'D');
      currentX += columnWidths[cellIndex];
    });
    
    // Texto de la fila
    currentX = tableStartX;
    row.forEach((cell, cellIndex) => {
      const cellText = cell.toString();
      const maxWidth = columnWidths[cellIndex] - 4;
      const lines = pdf.splitTextToSize(cellText, maxWidth);
      pdf.text(lines, currentX + 2, currentY + 5);
      currentX += columnWidths[cellIndex];
    });
    
    currentY += 7;
  });
  
  return currentY + 5;
};
