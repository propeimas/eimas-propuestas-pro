import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Propuesta, CaracteristicasTecnicas, PersonalEquipo, DesgloseCostos, ConfiguracionEmpresa } from '@/types/proposal';

export interface PropuestaCompleta {
  propuesta: Propuesta;
  caracteristicas?: CaracteristicasTecnicas;
  personal?: PersonalEquipo;
  costos?: DesgloseCostos;
  configuracion?: ConfiguracionEmpresa;
}

export const generatePDF = async (data: PropuestaCompleta) => {
  const { propuesta, caracteristicas, personal, costos, configuracion } = data;
  
  // Crear instancia de jsPDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // HELPER FUNCTIONS - Funciones auxiliares para el diseño profesional
  
  // Función para agregar nueva página si es necesario
  const checkPageBreak = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - 30) { // Más margen para footer
      pdf.addPage();
      addPageHeader(); // Agregar encabezado profesional en cada página
      yPosition = 50; // Posición después del header
    }
  };

  // Función para formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // NUEVO: Función para crear encabezado profesional en cada página
  const addPageHeader = () => {
    // Rectángulo principal del header
    pdf.setFillColor(245, 245, 245); // Gris claro
    pdf.rect(15, 10, pageWidth - 30, 25, 'F');
    
    // Líneas de borde
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 10, pageWidth - 30, 25);
    
    // Logo placeholder (si existe)
    if (configuracion?.logo) {
      try {
        pdf.addImage(configuracion.logo, 'JPEG', 20, 15, 25, 15);
      } catch (error) {
        console.log('Error al cargar logo:', error);
        // Placeholder para logo
        pdf.setFillColor(200, 200, 200);
        pdf.rect(20, 15, 25, 15, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text('LOGO', 32, 23, { align: 'center' });
      }
    } else {
      // Placeholder para logo si no existe
      pdf.setFillColor(200, 200, 200);
      pdf.rect(20, 15, 25, 15, 'F');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('LOGO', 32, 23, { align: 'center' });
    }
    
    // Título principal
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('PROPUESTA TÉCNICO-ECONÓMICA', pageWidth / 2, 20, { align: 'center' });
    
    // Información del header en celdas
    const cellWidth = (pageWidth - 70) / 3; // Ancho de cada celda
    const startX = 50; // Después del logo
    
    // Líneas verticales divisorias
    pdf.line(startX + cellWidth, 10, startX + cellWidth, 35);
    pdf.line(startX + cellWidth * 2, 10, startX + cellWidth * 2, 35);
    
    // Contenido de las celdas
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    
    // Celda 1: Código
    pdf.text(`Código: ${propuesta.codigoPropuesta}`, startX + 2, 28);
    
    // Celda 2: Versión
    pdf.text('Versión: 01', startX + cellWidth + 2, 28);
    
    // Celda 3: Fecha
    const fechaActual = new Date().toISOString().split('T')[0];
    pdf.text(`Fecha: ${fechaActual}`, startX + cellWidth * 2 + 2, 28);
    
    pdf.setTextColor(0, 0, 0); // Reset color
  };

  // NUEVO: Función para crear tabla profesional
  const createProfessionalTable = (headers: string[], data: string[][], startY: number, columnWidths: number[]) => {
    const tableStartX = 15;
    let currentY = startY;
    
    // Verificar si hay espacio para la tabla
    const tableHeight = (data.length + 1) * 8 + 10;
    checkPageBreak(tableHeight);
    currentY = yPosition;
    
    // Dibujar encabezados
    pdf.setFillColor(240, 240, 240); // Gris claro para encabezados
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
    pdf.setFillColor(255, 255, 255); // Fondo blanco para datos
    pdf.setFont('helvetica', 'normal');
    
    data.forEach((row, rowIndex) => {
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
    
    return currentY + 5; // Retornar nueva posición Y
  };

  // INICIALIZAR PDF - Agregar primer encabezado
  addPageHeader();
  yPosition = 50; // Posición después del header profesional

  // INFORMACIÓN DE LA EMPRESA - Mejorado con mejor espaciado
  if (configuracion) {
    checkPageBreak(50);
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
    yPosition += 10;
  }

  // INFORMACIÓN DEL CLIENTE - Mejorado
  checkPageBreak(40);
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
  yPosition += 12;

  // Objetivo
  if (propuesta.objetivo) {
    checkPageBreak(30);
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
    checkPageBreak(30);
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
    checkPageBreak(30);
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

  // PERSONAL DEL PROYECTO - TABLA PROFESIONAL MEJORADA
  if (personal?.personal && personal.personal.length > 0) {
    checkPageBreak(60);
    
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
    
    // Anchos de columna optimizados
    const columnWidths = [60, 70, 50]; // Total: 180mm (cabe bien en A4)
    
    // Crear tabla profesional
    yPosition = createProfessionalTable(headers, data, yPosition, columnWidths);
    yPosition += 5;
  }

  // EQUIPOS UTILIZADOS - TABLA PROFESIONAL MEJORADA
  if (personal?.equipos && personal.equipos.length > 0) {
    checkPageBreak(60);
    
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
    const introTextEquipos = `Para la ejecución del proyecto, ${configuracion?.nombreEmpresa || 'la empresa'} dispondrá de los siguientes equipos.`;
    pdf.text(introTextEquipos, 15, yPosition);
    yPosition += 10;
    
    // Preparar datos para la tabla de equipos
    const headersEquipos = ['EQUIPO', 'TIPO MUESTREO'];
    const dataEquipos = personal.equipos.map(equipo => [
      equipo.nombre,
      `${equipo.marca} ${equipo.modelo}`.trim()
    ]);
    
    // Anchos de columna para equipos
    const columnWidthsEquipos = [90, 90]; // Total: 180mm
    
    // Crear tabla profesional para equipos
    yPosition = createProfessionalTable(headersEquipos, dataEquipos, yPosition, columnWidthsEquipos);
    yPosition += 5;
  }

  // Duración del estudio
  if (propuesta.duracion) {
    checkPageBreak(15);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DURACIÓN DEL ESTUDIO', 15, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${propuesta.duracion} días calendario`, 15, yPosition);
    yPosition += 15;
  }

  // COSTOS - TABLA PROFESIONAL MEJORADA
  if (costos && costos.items.length > 0) {
    checkPageBreak(80);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('COSTO DE LA PROPUESTA', 15, yPosition);
    yPosition += 12;
    
    // Preparar datos para tabla de costos
    const headersCostos = ['CONCEPTO', 'CANT.', 'VALOR UNIT.', 'TOTAL'];
    const dataCostos = costos.items.map(item => [
      item.concepto,
      item.cantidad.toString(),
      formatCurrency(item.valorUnitario),
      formatCurrency(item.valorTotal)
    ]);
    
    // Anchos de columna para costos
    const columnWidthsCostos = [80, 25, 37.5, 37.5]; // Total: 180mm
    
    // Crear tabla profesional para costos
    yPosition = createProfessionalTable(headersCostos, dataCostos, yPosition, columnWidthsCostos);
    
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
    yPosition += 15;
  }

  // Compromisos de calidad
  if (configuracion?.compromisos && configuracion.compromisos.length > 0) {
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMPROMISOS DE CALIDAD', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    configuracion.compromisos.forEach((compromiso) => {
      checkPageBreak(8);
      pdf.text(`• ${compromiso}`, 15, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  // FIRMA - Mejorado
  if (configuracion?.firma) {
    checkPageBreak(50);
    try {
      pdf.addImage(configuracion.firma, 'JPEG', 15, yPosition, 60, 25);
      yPosition += 30;
    } catch (error) {
      console.log('Error al cargar firma:', error);
    }
  }

  // PIE DE PÁGINA PROFESIONAL - En todas las páginas
  const addFooter = () => {
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

  // Agregar footer a todas las páginas
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter();
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
