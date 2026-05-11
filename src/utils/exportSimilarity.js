import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportSimilarityPDF = (results) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("Similarity Report Summary", 14, 20);

  autoTable(doc, {

  startY: 30,

  head: [[
    "File Name",
    "Status",
    "Most Similar",
    "Similarity"
  ]],

  body: results.map((r) => [

    r.file,

    r.similarity > 70 ? "High Risk" : "Safe",

    r.most_similar,

    `${r.similarity}%`

  ]),

  theme: "grid",

  headStyles: {

    fillColor: "#FFC727",

    textColor: "#000000",

    fontStyle: "bold",
  },

  bodyStyles: {

    fillColor: "#FFF7D1",

    textColor: "#000000",
  },

  alternateRowStyles: {

    fillColor: "#FFE27A",
  },

  styles: {

    halign: "center",

    valign: "middle",

    fontSize: 10,
  },
});

  doc.save("similarity-report.pdf");
};