import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePDF = async (elementToPrintId) => {
  const element = document.getElementById(elementToPrintId);
  if (!element) {
    throw new Error(`Element with id ${elementToPrintId} not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4", // standard invoice format
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgProps = pdf.getImageProperties(imgData);
  const imgRatio = imgProps.width / imgProps.height;

  let finalWidth, finalHeight;
  if (pdfWidth / pdfHeight > imgRatio) {
    finalHeight = pdfHeight;
    finalWidth = imgRatio * pdfHeight;
  } else {
    finalWidth = pdfWidth;
    finalHeight = pdfWidth / imgRatio;
  }

  pdf.addImage(
    imgData,
    "PNG",
    (pdfWidth - finalWidth) / 2,
    (pdfHeight - finalHeight) / 2,
    finalWidth,
    finalHeight
  );

  pdf.save(`invoice-${Date.now()}.pdf`);
};
