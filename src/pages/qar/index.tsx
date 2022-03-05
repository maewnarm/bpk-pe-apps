// Quality Auto Record
import React, { useState } from "react";
import jsPDF from "jspdf";
import PDFObject from "pdfobject";
import {
  Color,
  degrees,
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// import html2canvas from "html2canvas";
import {
  addFontStyle,
  drawRecordForm1,
  drawImage,
  loadFont,
} from "@/components/qar/_functions";

var defaultFont: PDFFont
var defaultSize: number = 20
var defaultColor: Color = rgb(0,0,0)

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

  async function modifyPDF() {
    fetch("http://127.0.0.1:70/pcs-controlitem.pdf", {
      headers: { "Content-Type": "application/pdf" },
    })
      .then(async (res) => {
        const pdfBytesFromLocal = await res.arrayBuffer();
        console.log(pdfBytesFromLocal);
        const doc = await PDFDocument.load(pdfBytesFromLocal);
        const pages = doc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // embed font
        doc.registerFontkit(fontkit);
        const angsanaUPC = await doc.embedFont(await loadFont("angsa.ttf"));

        defaultFont = angsanaUPC

        pdfDrawText(firstPage,"test add text",100,200)
        // firstPage.drawText("Test add text", {
        //   x: 10,
        //   y: height / 2,
        //   size: 30,
        //   font: angsanaUPC,
        //   color: rgb(1, 0, 0),
        // });
        firstPage.drawText("Test add text", {
          x: 10,
          y: 20,
          size: 30,
          // font: angsanaUPC,
          color: rgb(1, 0, 0),
        });
        firstPage.drawRectangle({
          x: 0,
          y: height / 2 - 25,
          width: 50,
          height: 50,
          borderColor: rgb(1, 0, 0),
          color: rgb(0, 1, 0),
          borderWidth: 2,
        });
        const uri = await doc.saveAsBase64({ dataUri: true });

        PDFObject.embed(uri, "#pdfembed", {
          height: "700px",
          pdfOpenParams: {
            view: "FitH",
          },
        });
      })
      .catch((e) => console.log(e));
  }

  function pdfDrawText(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    size: number = defaultSize,
    font: PDFFont = defaultFont,
    color: Color = defaultColor
  ) {
    page.drawText(text, {
      x: x,
      y: y,
      size: size,
      font: font,
      color: color,
    });
  }

  function uploadFile() {
    const input = document.getElementById("fileinput") as HTMLInputElement;
    const files = input.files;
    if (files) {
      let file = files[0];
      const formData = new FormData();
      formData.append("File", file);
      // TODO method not allow
      fetch("http://127.0.0.1:70/pcs-test.pdf", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((e) => console.log(e));
    }
  }

  return (
    <div className="qar">
      <button className="button" onClick={generatePDF}>
        trial generate pdf
      </button>
      <input id="fileinput" type="file"></input>
      <button className="button" onClick={uploadFile}>
        upload
      </button>
      <button className="button" onClick={modifyPDF}>
        trial modify pdf
      </button>
      <div id="pdfembed" style={{ height: "700px", width: "500px" }}></div>
    </div>
  );
};

export default Qar;
