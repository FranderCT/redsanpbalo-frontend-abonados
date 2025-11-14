import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Project } from "../../Models/Project";
import LogoRedSanPabloHG from "../../../../assets/images/LogoRedSanPabloHG.png";

// Función para formatear fechas
const formatDate = (d?: Date | string | null) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("es-ES");
};

// Función para cargar imagen como base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("No se pudo obtener el contexto del canvas"));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateProjectPDF = async (project: Project) => {
  const doc = new jsPDF();
  
  // Colores corporativos
  const primaryColor = [9, 21, 64] as [number, number, number]; // #091540
  const accentColor = [59, 130, 246] as [number, number, number]; // blue-500
  const lightGray = [243, 244, 246] as [number, number, number]; // gray-100
  
  let yPosition = 20;

  try {
    // Cargar y agregar logo
    const logoBase64 = await loadImageAsBase64(LogoRedSanPabloHG);
    doc.addImage(logoBase64, "PNG", 15, yPosition, 50, 15);
  } catch (error) {
    console.warn("No se pudo cargar el logo:", error);
  }

  // Título principal
  doc.setFillColor(...primaryColor);
  doc.rect(0, yPosition + 20, 210, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("REPORTE DE PROYECTO", 105, yPosition + 29, { align: "center" });

  yPosition += 45;

  // Información general del proyecto
  doc.setFillColor(...lightGray);
  doc.rect(15, yPosition, 180, 10, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN GENERAL", 20, yPosition + 7);

  yPosition += 15;

  // Tabla de información general
  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: [
      ["ID del Proyecto", project.Id?.toString() || "—"],
      ["Nombre", project.Name || "—"],
      ["Ubicación", project.Location || "—"],
      ["Fecha de Inicio", formatDate(project.InnitialDate)],
      ["Fecha de Fin", formatDate(project.EndDate)],
      ["Estado", project.ProjectState?.Name || "—"],
      ["Encargado", project.User ? `${project.User.Name} ${project.User.Surname1 || ""}`.trim() : "—"],
    ],
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: primaryColor, cellWidth: 50 },
      1: { textColor: [50, 50, 50] },
    },
    margin: { left: 15, right: 15 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Objetivo y Descripción
  doc.setFillColor(...lightGray);
  doc.rect(15, yPosition, 180, 10, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("OBJETIVO Y DESCRIPCIÓN", 20, yPosition + 7);

  yPosition += 15;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);

  // Objetivo
  doc.setFont("helvetica", "bold");
  doc.text("Objetivo:", 15, yPosition);
  doc.setFont("helvetica", "normal");
  const objectiveLines = doc.splitTextToSize(project.Objective || "Sin objetivo especificado", 170);
  doc.text(objectiveLines, 15, yPosition + 5);
  yPosition += 5 + objectiveLines.length * 5;

  // Descripción
  yPosition += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Descripción:", 15, yPosition);
  doc.setFont("helvetica", "normal");
  const descriptionLines = doc.splitTextToSize(project.Description || "Sin descripción", 170);
  doc.text(descriptionLines, 15, yPosition + 5);
  yPosition += 5 + descriptionLines.length * 5;

  // Observaciones
  if (project.Observation) {
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 15, yPosition);
    doc.setFont("helvetica", "normal");
    const observationLines = doc.splitTextToSize(project.Observation, 170);
    doc.text(observationLines, 15, yPosition + 5);
    yPosition += 5 + observationLines.length * 5;
  }

  // Nueva página para proyección
  doc.addPage();
  yPosition = 20;

  // Proyección del Proyecto
  doc.setFillColor(...accentColor);
  doc.rect(15, yPosition, 180, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PROYECCIÓN DEL PROYECTO", 20, yPosition + 7);

  yPosition += 15;

  if (project.ProjectProjection?.Observation) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const projectionObsLines = doc.splitTextToSize(project.ProjectProjection.Observation, 170);
    doc.text(projectionObsLines, 15, yPosition);
    yPosition += projectionObsLines.length * 5 + 10;
  }

  // Tabla de productos estimados
  if (project.ProjectProjection?.ProductDetails && project.ProjectProjection.ProductDetails.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Productos Estimados", 15, yPosition);
    yPosition += 7;

    const projectionTableData = project.ProjectProjection.ProductDetails.map((pd: any) => [
      pd.Product?.Name || "—",
      pd.Product?.Type || "—",
      pd.Product?.Category?.Name || "—",
      pd.Quantity?.toString() || "0",
      pd.Product?.UnitMeasure?.Name || "—",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Producto", "Tipo", "Categoría", "Cantidad", "Unidad"]],
      body: projectionTableData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 15, right: 15 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Gastos reales - Nueva página si no hay espacio
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  // Total de gastos reales
  if (project.TotalActualExpense?.ProductDetails && project.TotalActualExpense.ProductDetails.length > 0) {
    doc.setFillColor(...accentColor);
    doc.rect(15, yPosition, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("GASTOS REALES DEL PROYECTO", 20, yPosition + 7);

    yPosition += 15;

    // Calcular comparativa
    const comparisonData = project.TotalActualExpense.ProductDetails.map((detail: any) => {
      const projectedProduct = project.ProjectProjection?.ProductDetails?.find(
        (pd: any) => pd.Product?.Id === detail.Product?.Id
      );
      const projectedQuantity = projectedProduct?.Quantity || 0;
      const realQuantity = detail.Quantity || 0;
      const difference = realQuantity - projectedQuantity;
      const status = difference > 0 ? "Sobre presupuesto" : difference < 0 ? "Bajo presupuesto" : "En presupuesto";

      return [
        detail.Product?.Name || "—",
        detail.Product?.Type || "—",
        projectedQuantity.toString(),
        realQuantity.toString(),
        difference.toString(),
        status,
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [["Producto", "Tipo", "Proyectado", "Utilizado", "Diferencia", "Estado"]],
      body: comparisonData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 15, right: 15 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Trazabilidad del proyecto
  if (project.TraceProject && project.TraceProject.length > 0) {
    // Nueva página si no hay espacio
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(...accentColor);
    doc.rect(15, yPosition, 180, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TRAZABILIDAD DEL PROYECTO", 20, yPosition + 7);

    yPosition += 15;

    const traceData = project.TraceProject
      .filter((trace: any) => trace.IsActive !== false)
      .map((trace: any) => [
        trace.Name || "—",
        formatDate(trace.date),
        trace.Observation || "—",
      ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Nombre", "Fecha", "Observación"]],
      body: traceData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 100 },
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: 15, right: 15 },
    });
  }

  // Pie de página en todas las páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Red San Pablo - Página ${i} de ${pageCount}`,
      105,
      285,
      { align: "center" }
    );
    doc.text(
      `Generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}`,
      105,
      290,
      { align: "center" }
    );
  }

  // Guardar el PDF
  const fileName = `Proyecto_${project.Name?.replace(/[^a-z0-9]/gi, "_")}_${project.Id}.pdf`;
  doc.save(fileName);
};
