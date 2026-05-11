import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportSpellingPDF = (results) => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("Spelling Report Summary", 14, 20);

  autoTable(doc, {

    startY: 30,

    head: [[
      "File Name",
      "Spelling Mistakes",
      "Total Words",
      "Spelling Score"
    ]],

    body: results.map((r) => [

      r.file,

      r.misspelled,

      r.total_words,

      `${r.score}%`

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

  doc.save("spelling-report.pdf");
};