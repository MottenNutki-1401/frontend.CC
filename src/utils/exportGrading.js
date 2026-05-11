import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportGradingPDF = (results) => {

  const doc = new jsPDF();

  // TITLE
  doc.setFontSize(18);

  doc.text("Grading Report Summary", 14, 20);

  // TABLE
  autoTable(doc, {

  startY: 30,

  head: [[
    "File Name",
    "Grammar",
    "Spelling",
    "Originality",
    "Total Words",
    "Final Grade"
  ]],

  body: results.map((r) => [

    r.file,

    `${r.grammar}%`,

    `${r.spelling}%`,

    `${r.originality}%`,

    r.total_words,

    `${r.final_score}%`

  ]),

  theme: "grid",

  headStyles: {

    fillColor: "#FFC727",

    textColor: "#000000",

    fontStyle: "bold",
  },

  bodyStyles: {

    fillColor:  "#FFF7D1",

    textColor:  "#000000",
  },

  alternateRowStyles: {

    fillColor:"#FFE27A",
  },

  styles: {

    halign: "center",

    valign: "middle",

    fontSize: 10,
  },
});

  // DOWNLOAD
  doc.save("grading-report.pdf");
};