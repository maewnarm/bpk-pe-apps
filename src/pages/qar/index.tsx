// Quality Auto Record
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import PDFObject from "pdfobject";
import {
  Color,
  degrees,
  PageSizes,
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import html2canvas from "html2canvas";
import {
  addFontStyle,
  drawRecordForm1,
  drawImage,
  loadFont,
} from "@/components/qar/_functions";
import axios, { AxiosRequestConfig } from "axios";
import { io, Socket } from "socket.io-client";
let socket: Socket;

const Qar = () => {
  const [msg, setMsg] = useState("");
  const [update, setUpdate] = useState("");

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
        // const doc = await PDFDocument.create()
        const pages = doc.getPages();
        const firstPage = pages[0];
        // const firstPage = doc.addPage(PageSizes.A4);
        const { width, height } = firstPage.getSize();
        console.log("h:", height, "w:", width);

        // embed font
        doc.registerFontkit(fontkit);
        const angsanaUPC = await doc.embedFont(await loadFont("angsa.ttf"));
        const angsanaUPCz = await doc.embedFont(await loadFont("angsaz.ttf"));
        const wingding2 = await doc.embedFont(await loadFont("WINGDNG2.ttf"));

        firstPage.setFont(angsanaUPC);
        firstPage.setFontSize(30);
        pdfDrawText(firstPage, "test add text", 100, 200);

        firstPage.setFont(angsanaUPCz);
        pdfDrawText(firstPage, "test add text 2", 100, 220);

        firstPage.setFont(wingding2);
        firstPage.setFontSize(50);
        let textHeight = wingding2.heightAtSize(50);
        pdfDrawText(firstPage, "P", 100, height - textHeight);

        // firstPage.drawText("Test add text", {
        //   x: 10,
        //   y: height / 2,
        //   size: 30,
        //   font: angsanaUPC,
        //   color: rgb(1, 0, 0),
        // });
        // firstPage.drawText("Test add text", {
        //   x: 10,
        //   y: 20,
        //   size: 30,
        //   // font: angsanaUPC,
        //   color: rgb(1, 0, 0),
        // });
        firstPage.drawRectangle({
          x: 0,
          y: height / 2 - 25,
          width: 50,
          height: 50,
          borderColor: rgb(1, 0, 0),
          color: rgb(0, 1, 0),
          borderWidth: 2,
        });

        // embed image
        const imgBytes = await fetch("http://127.0.0.1:70/images/rog.jpg").then(
          (res) => res.arrayBuffer()
        );
        console.log(imgBytes);
        const img = await doc.embedJpg(imgBytes);
        firstPage.drawImage(img, { x: 200, y: 200, width: 250, height: 95 });

        // embed svg
        const svgObj = document.createElement("object");
        svgObj.height = "95px";
        svgObj.width = "250px";
        svgObj.data = "denso-vector-logo.svg";
        svgObj.type = "image/svg+xml";
        svgObj.onload = async function () {
          const svg = svgObj.contentDocument;
          if (svg) {
            const { height, width } = svg
              .getElementsByTagName("svg")[0]
              .getBBox();
            const path = svg.getElementsByTagName("path")[0];
            const d = path.getAttribute("d");
            // console.log(d);
            if (d) {
              let { r, g, b } = convertRGB255to1(220, 0, 50);
              firstPage.drawSvgPath(d, {
                x: 100,
                y: 100,
                scale: 0.2,
                color: rgb(r, g, b),
                opacity: 0.5,
              });

              const uri = await doc.saveAsBase64({ dataUri: true });
              PDFObject.embed(uri, "#pdfembed", {
                height: "700px",
                pdfOpenParams: {
                  view: "FitH",
                },
              });
            }
          }
        };
        document.body.appendChild(svgObj);
      })
      .catch((e) => console.log(e));
  }

  function pdfDrawText(page: PDFPage, text: string, x: number, y: number) {
    page.drawText(text, {
      x: x,
      y: y,
    });
  }

  function convertRGB255to1(
    red: number,
    green: number,
    blue: number
  ): { r: number; g: number; b: number } {
    let R = red / 255;
    let G = green / 255;
    let B = blue / 255;
    return { r: R, g: G, b: B };
  }

  function uploadFile() {
    const input = document.getElementById("fileinput") as HTMLInputElement;
    const files = input.files;
    if (files) {
      let file = files[0];
      const formData = new FormData();
      formData.append("file", file, file.name);
      // console.log(file);

      const config: AxiosRequestConfig = {
        onUploadProgress: (e) => {
          console.log(Math.round((e.loaded * 100) / e.total).toFixed(2));
        },
      };
      axios
        .post("http://127.0.0.1:8000/isv/upload", formData, config)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));

      // let xhr = new XMLHttpRequest()
      // xhr.open('post',"http://127.0.0.1:8000/isv/upload",true)
      // xhr.send(formData)
    }
  }

  useEffect(() => {
    socketInitialize();
  }, []);

  async function socketInitialize() {
    // await fetch("/api/socket");
    socket = io("http://127.0.0.1:8000/", {
      path: "/ws/socket.io/",
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    // socket = io()

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update", (msg: { data: string }) => {
      console.log(msg);
      setMsg(msg.data);
    });
  }

  function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("changed");
    // console.log(e.target.value)
    socket.emit("input", e.target.value);
  }

  return (
    <div className="qar">
      <button className="button" onClick={generatePDF}>
        trial generate pdf
      </button>
      <button className="button" onClick={modifyPDF}>
        trial modify pdf
      </button>
      <input id="fileinput" type="file"></input>
      <button className="button" onClick={uploadFile}>
        upload
      </button>
      <input type="text" onChange={inputChange}></input>
      <p>{msg}</p>
      <div id="pdfembed" style={{ height: "700px", width: "500px" }}></div>
    </div>
  );
};

export default Qar;
