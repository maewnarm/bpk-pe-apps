// Quality Auto Record
import React, { useState } from "react";
import jsPDF from "jspdf";
import PDFObject from "pdfobject";
import { addFontStyle, drawRecordForm } from "@/components/qar/_functions";

const Qar = () => {
  function generatePDF() {
    console.log("generate pdf");
    //initial size
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

    // add font style
    addFontStyle(doc);

    // draw
    drawRecordForm(doc);
    console.log(doc.getFontList());

    // doc.save("test.pdf");
    // window.open(URL.createObjectURL(doc.output("blob")));
    // let embedString =
    //   "<embed width='100%' height='100%' src='" + doc.output("bloburl") + "'/>";
    // document
    //   .getElementById("embed")
    //   ?.setAttribute("src", doc.output("dataurlstring"));
    PDFObject.embed(doc.output("datauristring"), "#pdfembed", {
      height: "700px",
      pdfOpenParams: {
        view: "FitH",
      },
    });
  }

  return (
    <div className="qar">
      <button className="button" onClick={generatePDF}>
        trial generate pdf
      </button>
      <div id="pdfembed" style={{ height: "700px", width: "500px" }}></div>
    </div>
  );
};

export default Qar;
