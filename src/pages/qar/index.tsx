// Quality Auto Record
import React, { useState } from "react";
import jsPDF from "jspdf";
import PDFObject from "pdfobject";
import html2canvas from "html2canvas";
import {
  addFontStyle,
  drawRecordForm1,
  drawImage,
} from "@/components/qar/_functions";

const Qar = () => {
  async function generatePDF() {
    console.log("generate pdf");
    //initial size
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

    // add font style
    addFontStyle(doc);

    // draw
    drawRecordForm1(doc);
    console.log(doc.getFontList());

    // add image
    const img = new Image();
    img.src = "denso-vector-logo.svg";
    img.setAttribute("width", "250");
    img.setAttribute("height", "95");
    img.style.position = "relative";
    img.style.left = "0";
    img.style.padding = "0";
    img.style.top = window.innerHeight.toString();
    drawImage(doc, img);

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
