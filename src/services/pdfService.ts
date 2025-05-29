
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
  
  // Función para agregar nueva página si es necesario
  const checkPageBreak = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
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

  // Encabezado con logo (si existe)
  if (configuracion?.logo) {
    try {
      pdf.addImage(configuracion.logo, 'JPEG', 15, 10, 30, 20);
    } catch (error) {
      console.log('Error al cargar logo:', error);
    }
  }

  // Título principal
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROPUESTA COMERCIAL', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Código de propuesta
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Código: ${propuesta.codigoPropuesta}`, 15, yPosition);
  yPosition += 10;

  // Fecha de entrega
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Fecha de entrega: ${new Date().toLocaleDateString('es-ES')}`, 15, yPosition);
  yPosition += 15;

  // Información de EIMAS
  if (configuracion) {
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMACIÓN LEGAL DE EIMAS', 15, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Empresa: ${configuracion.nombreEmpresa}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Teléfono: ${configuracion.telefono}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Dirección: ${configuracion.direccion}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Email: ${configuracion.email}`, 15, yPosition);
    yPosition += 5;
    pdf.text(`Resolución: ${configuracion.resolucion}`, 15, yPosition);
    yPosition += 15;
  }

  // Información del cliente
  checkPageBreak(50);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL CLIENTE', 15, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Empresa: ${propuesta.empresaCliente}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Contacto: ${propuesta.nombreSolicitante}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Teléfono: ${propuesta.telefono}`, 15, yPosition);
  yPosition += 5;
  pdf.text(`Email: ${propuesta.email}`, 15, yPosition);
  yPosition += 15;

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

  // Personal (tabla)
  if (personal?.personal && personal.personal.length > 0) {
    checkPageBreak(50);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERSONAL DEL PROYECTO', 15, yPosition);
    yPosition += 15;
    
    // Encabezados de tabla
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Nombre', 15, yPosition);
    pdf.text('Cargo', 80, yPosition);
    pdf.text('Experiencia', 130, yPosition);
    yPosition += 8;
    
    // Línea separadora
    pdf.line(15, yPosition - 2, pageWidth - 15, yPosition - 2);
    
    pdf.setFont('helvetica', 'normal');
    personal.personal.forEach((persona) => {
      checkPageBreak(10);
      pdf.text(persona.nombre, 15, yPosition);
      pdf.text(persona.cargo, 80, yPosition);
      pdf.text(persona.experiencia, 130, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  // Equipos (tabla)
  if (personal?.equipos && personal.equipos.length > 0) {
    checkPageBreak(50);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EQUIPOS UTILIZADOS', 15, yPosition);
    yPosition += 15;
    
    // Encabezados de tabla
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Equipo', 15, yPosition);
    pdf.text('Marca', 70, yPosition);
    pdf.text('Modelo', 110, yPosition);
    pdf.text('Calibración', 150, yPosition);
    yPosition += 8;
    
    // Línea separadora
    pdf.line(15, yPosition - 2, pageWidth - 15, yPosition - 2);
    
    pdf.setFont('helvetica', 'normal');
    personal.equipos.forEach((equipo) => {
      checkPageBreak(10);
      pdf.text(equipo.nombre, 15, yPosition);
      pdf.text(equipo.marca, 70, yPosition);
      pdf.text(equipo.modelo, 110, yPosition);
      pdf.text(equipo.calibracion, 150, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
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

  // Costos
  if (costos && costos.items.length > 0) {
    checkPageBreak(60);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COSTO DE LA PROPUESTA', 15, yPosition);
    yPosition += 15;
    
    // Tabla de costos
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Concepto', 15, yPosition);
    pdf.text('Cant.', 100, yPosition);
    pdf.text('Valor Unit.', 125, yPosition);
    pdf.text('Total', 165, yPosition);
    yPosition += 8;
    
    pdf.line(15, yPosition - 2, pageWidth - 15, yPosition - 2);
    
    pdf.setFont('helvetica', 'normal');
    costos.items.forEach((item) => {
      checkPageBreak(8);
      pdf.text(item.concepto, 15, yPosition);
      pdf.text(item.cantidad.toString(), 100, yPosition);
      pdf.text(formatCurrency(item.valorUnitario), 125, yPosition);
      pdf.text(formatCurrency(item.valorTotal), 165, yPosition);
      yPosition += 6;
    });
    
    yPosition += 5;
    pdf.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 8;
    
    // Totales
    pdf.setFont('helvetica', 'bold');
    pdf.text('Subtotal:', 130, yPosition);
    pdf.text(formatCurrency(costos.subtotal), 165, yPosition);
    yPosition += 6;
    
    pdf.text('IVA (19%):', 130, yPosition);
    pdf.text(formatCurrency(costos.iva), 165, yPosition);
    yPosition += 6;
    
    pdf.setFontSize(12);
    pdf.text('TOTAL:', 130, yPosition);
    pdf.text(formatCurrency(costos.total), 165, yPosition);
    yPosition += 15;
  }

  // Compromisos
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

  // Firma
  if (configuracion?.firma) {
    checkPageBreak(40);
    try {
      pdf.addImage(configuracion.firma, 'JPEG', 15, yPosition, 50, 20);
      yPosition += 25;
    } catch (error) {
      console.log('Error al cargar firma:', error);
    }
  }

  // Pie de página con datos de contacto
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const footerY = pageHeight - 15;
  if (configuracion) {
    pdf.text(`${configuracion.nombreEmpresa} | Tel: ${configuracion.telefono} | Email: ${configuracion.email}`, pageWidth / 2, footerY, { align: 'center' });
    if (configuracion.website) {
      pdf.text(`Web: ${configuracion.website}`, pageWidth / 2, footerY + 5, { align: 'center' });
    }
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
