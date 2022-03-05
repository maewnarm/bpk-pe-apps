import React from "react";
import jsPDF from "jspdf";
import { font_denso_normal } from "@/public/fonts/Denso-normal";
import { font_angsana_new_normal } from "@/public/fonts/angsana new-normal";
import { font_angsana_new_bold } from "@/public/fonts/angsana new-bold";
import { font_angsana_new_italic } from "@/public/fonts/angsana new-italic";
import { font_angsana_new_bolditalic } from "@/public/fonts/angsana new-bolditalic";
import { font_angsana_upc_normal } from "@/public/fonts/angsana upc-normal";
import { font_angsana_upc_bold } from "@/public/fonts/angsana upc-bold";
import { font_angsana_upc_italic } from "@/public/fonts/angsana upc-italic";
import { font_angsana_upc_bolditalic } from "@/public/fonts/angsana upc-bolditalic";
// import { PDFDocument } from "pdf-lib";

export function drawImage(doc: jsPDF, img: HTMLImageElement) {
  document.body.appendChild(img);
  // const canvasElement = await html2canvas(img, {
  //   backgroundColor: "black",
  //   width: 250,
  //   height: 95,
  //   scale: 1,
  // });
  // document.body.appendChild(canvasElement);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0);
  // document.body.appendChild(canvas);
  doc.addImage(canvas, "PNG", 4, 6, 18, 6.84);
  document.body.removeChild(img);
}

export function addFontStyle(doc: jsPDF) {
  doc
    .addFileToVFS("/Denso-normal.ttf", font_denso_normal)
    .addFont("/Denso-normal.ttf", "Denso", "normal");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_normal)
    .addFont("/Angsana-new.ttf", "Angsana new", "normal");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_bold)
    .addFont("/Angsana-new.ttf", "Angsana new", "bold");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_italic)
    .addFont("/Angsana-new.ttf", "Angsana new", "italic");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_bolditalic)
    .addFont("/Angsana-new.ttf", "Angsana new", "bolditalic");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_normal)
    .addFont("/Angsana-new.ttf", "Angsana upc", "normal");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_bold)
    .addFont("/Angsana-new.ttf", "Angsana upc", "bold");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_italic)
    .addFont("/Angsana-new.ttf", "Angsana upc", "italic");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_bolditalic)
    .addFont("/Angsana-new.ttf", "Angsana upc", "bolditalic");
}

export function drawRecordForm1(doc: jsPDF) {
  // header
  doc.setFont("Angsana upc", "bold");
  doc.setFontSize(26);
  doc.text("Check Sheet & Record Sheet", 105, 11, { align: "center" });
  doc.setFont("Angsana upc", "normal");
  doc.setFontSize(16);
  doc.text("Year:", 5, 25);
  doc.text("Month:", 30, 25);
  doc.text("Shift:", 70, 25);
  doc.text("Section:", 95, 25);
  doc.text("Operator Name:", 126, 25);
  doc.text("Process:", 5, 34);
  doc.text("Part Name:", 60, 34);
  doc.text("Part No.:", 115, 34);
  doc.text("Model:", 175, 34);

  doc.line(14, 26, 28, 26); //Year
  doc.line(42, 26, 68, 26); //Month
  doc.line(79, 26, 92, 26); //Shift
  doc.line(108, 26, 123, 26); //Section
  doc.line(151, 26, 175, 26); //Operator name
  doc.line(18, 35, 59, 35); //Process
  doc.line(77, 35, 113, 35); //Process
  doc.line(129, 35, 174, 35); //Part No.
  doc.line(186, 35, 205, 35); //Part No.

  // Approve sign
  doc.setFont("Angsana upc", "normal");
  doc.setFontSize(11);
  doc.text("Approve", 182.5, 8, { align: "center" });
  doc.text("Checked", 197.5, 8, { align: "center" });
  doc.text("/", 180, 18.5, { align: "center" });
  doc.text("/", 185, 18.5, { align: "center" });
  doc.text("/", 195, 18.5, { align: "center" });
  doc.text("/", 200, 18.5, { align: "center" });
  doc.rect(175, 5, 30, 15);
  doc.line(190, 5, 190, 20);

  // Check sheet header
  doc.setFontSize(16);
  doc.setFont("Angsana upc", "bold");
  doc.text("Check Sheet:", 5, 42);
  doc.setFontSize(14);
  doc.setFont("Angsana upc", "normal");
  doc.text(
    "ลงผลการตรวจสอบของ Lot นั้นๆด้วยเครื่องหมาย 🗸:ผ่าน, ✘:ไม่ผ่าน กรณีไม่ผ่านให้บันทึกลงในตารางบันทึกปัญหาและการแก้ไข",
    30,
    42
  );
  doc.rect(4, 38.5, 22.5, 5);

  // Check sheet Forms
  doc.setFontSize(13);
  doc.setFont("Angsana upc", "normal");
  doc.text("หัวข้อ", 7.5, 51.5);
  doc.text("ตรวจสอบ", 5, 54.5);
  doc.text("Class", 20, 52.5);
  doc.text("ค่ากำหนด", 34, 54.5);
  doc.setFontSize(11);
  doc.text("Q'Ty/Lot", 53, 54);
  doc.text("Date", 57, 49);

  // check sheet
  // table
  doc.rect(4, 46, 200.05, 61);
  for (let i = 0; i < 10; i++) {
    // row
    doc.line(4, 57 + 5 * i, 204.05, 57 + 5 * i);
  }
  for (let i = 0; i < 31; i++) {
    // column
    doc.line(63 + 4.55 * i, 46, 63 + 4.55 * i, 107);
  }
  doc.line(18, 46, 18, 107); //1st Column
  doc.line(28, 46, 28, 107); //2nd Column
  doc.line(28, 46, 63, 51); //Date 1st Row
  doc.line(28, 46, 63, 57); //Q'Ty 1st Row
  doc.line(62, 51, 204.05, 51); //Date & Q'Ty Row

  // Record sheet header
  doc.setFontSize(16);
  doc.setFont("Angsana upc", "bold");
  doc.text("Record Sheet:", 5, 115);
  doc.rect(4, 112, 22.5, 5);

  // Record sheet Forms
  doc.setFont("Angsana upc", "normal");
  //1st Record sheet Table
  doc.text("Spec.", 10, 145);
  doc.text("Freq.", 45, 145);
  doc.text("Class", 77, 145);
  //2nd Record sheet Table
  doc.text("Spec.", 115, 145);
  doc.text("Freq.", 150, 145);
  doc.text("Class", 182, 145);

  // Table Record sheet forms
  doc.rect(5, 147, 95, 70.5); //Record sheet Table#1
  doc.rect(110, 147, 95, 70.5); //Record sheet Table#2
  doc.rect(5, 220, 95, 70.5); //Record sheet Table#3
  doc.rect(110, 147, 95, 70.5); //Record sheet Table#4
}

export async function loadFont(fontName: string) {
  const fontBytes = await fetch(`http://127.0.0.1:70/fonts/${fontName}`).then(
    (res) => res.arrayBuffer()
  );
  return fontBytes;
}
