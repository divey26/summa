import imageSrc from "./logo.jpg";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (columns, data, options = {}) => {
  const doc = new jsPDF();
  const { title, titleXPosition, titleYPosition } = options; // Add customizable title position
  const logo = new Image();
  logo.src = imageSrc;
  logo.onload = () => {
    const logoWidth = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "PNG", xPosition, 5, logoWidth, 40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    
    // If titleXPosition and titleYPosition are provided in options, use them
    const titlePosX = titleXPosition || (pageWidth - (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) / doc.internal.scaleFactor) / 2;
    const titlePosY = titleYPosition || 52; // Default Y position if not provided
    
    doc.setTextColor(0, 0, 0);
    doc.text(title, titlePosX, titlePosY); // Use dynamic position for title

    generateTable(doc, columns, data);
    savePDF(doc);
  };
};

const generateTable = (doc, columns, data) => {
  console.log(columns)
  console.log(data)

  const rows = data.map((row) => columns.map((col) => row[col.field]));
  console.log(rows)

  doc.autoTable({
    head: [columns.map((col) => col.headerName)],
    body: rows,
    startY: 55,
  });
};

const savePDF = (doc) => {
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);
  const filename = `document-${formattedDate}.pdf`;
  doc.save(filename);
};
